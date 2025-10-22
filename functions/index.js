const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// Ensure you set: firebase functions:config:set encryption.key="your-32+char-secret"
const ENCRYPTION_KEY = functions.config().encryption?.key;
if (!ENCRYPTION_KEY) console.warn("Encryption key not set. Set it with `firebase functions:config:set encryption.key`");

// AES-256-GCM encryption helpers
function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag();
  return iv.toString("base64") + ":" + tag.toString("base64") + ":" + encrypted;
}

function decrypt(payload) {
  const [iv64, tag64, data] = payload.split(":");
  const iv = Buffer.from(iv64, "base64");
  const tag = Buffer.from(tag64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY), iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(data, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Callable: encrypt and save phone
exports.encryptAndSavePhone = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  const { uid, phone, name, bloodGroup, district } = data;
  if (context.auth.uid !== uid) throw new functions.https.HttpsError('permission-denied', 'UID mismatch');
  if (!ENCRYPTION_KEY) throw new functions.https.HttpsError('failed-precondition', 'Server encryption key not configured');

  const encrypted = encrypt(phone);
  await db.collection('users').doc(uid).set({
    phoneEncrypted: encrypted,
    name,
    bloodGroup,
    district,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return { success: true };
});

// Callable: create a contact reveal request
exports.requestContactReveal = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  const callerUid = context.auth.uid;
  // basic permission: allow caller to create; additional checks can be added
  const revealRef = db.collection('contactRevealRequests').doc();
  await revealRef.set({
    requestId: data.requestId,
    donorId: data.donorId,
    requestedBy: callerUid,
    status: 'requested',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  // TODO: send notification/email to donor to consent
  return { id: revealRef.id };
});

// Callable: donor consent
exports.donorConsentForReveal = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  const revealId = data.revealId;
  const revealSnap = await db.collection('contactRevealRequests').doc(revealId).get();
  if (!revealSnap.exists) throw new functions.https.HttpsError('not-found', 'Reveal request not found');
  const reveal = revealSnap.data();
  if (reveal.donorId !== context.auth.uid) throw new functions.https.HttpsError('permission-denied', 'Only the donor can consent');

  await db.collection('contactRevealRequests').doc(revealId).update({
    status: 'consented',
    consentedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // set visible flag in users collection
  await db.collection('users').doc(context.auth.uid).set({
    contactVisibleForRequests: { [reveal.requestId]: true }
  }, { merge: true });

  return { success: true };
});

// Callable: get decrypted phone if donor consented for that request
exports.getDecryptedPhoneForRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  const { donorId, requestId } = data;
  // verify caller is admin or request owner
  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  const caller = callerDoc.data() || {};
  const reqDoc = await db.collection('requests').doc(requestId).get();
  if (!reqDoc.exists) throw new functions.https.HttpsError('not-found', 'Request not found');
  const isOwner = reqDoc.data().createdBy === context.auth.uid;
  const isAdmin = caller.role === 'admin';
  if (!isOwner && !isAdmin) throw new functions.https.HttpsError('permission-denied', 'Not authorized');

  const donorDoc = await db.collection('users').doc(donorId).get();
  const donor = donorDoc.data();
  if (!donor || !donor.contactVisibleForRequests || !donor.contactVisibleForRequests[requestId]) {
    throw new functions.https.HttpsError('permission-denied', 'Donor has not consented for this request');
  }
  if (!donor.phoneEncrypted) throw new functions.https.HttpsError('not-found', 'Encrypted phone not found');
  if (!ENCRYPTION_KEY) throw new functions.https.HttpsError('failed-precondition', 'Server encryption key not configured');

  const phone = decrypt(donor.phoneEncrypted);

  // audit log
  await db.collection('contactRevealAudit').add({
    donorId,
    requestId,
    revealedTo: context.auth.uid,
    revealedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { phone };
});
