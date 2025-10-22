import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, functions, db } from '../lib/firebaseClient';
import { httpsCallable } from 'firebase/functions';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Layout from '../components/Layout';
import { maskPhone } from '../lib/utils';

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', bloodGroup:'', district:''});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = cred.user.uid;
      // call cloud function to encrypt & save phone
      const fn = httpsCallable(functions, 'encryptAndSavePhone');
      await fn({ uid, phone: form.phone, name: form.name, bloodGroup: form.bloodGroup, district: form.district });
      // save public safe fields
      await setDoc(doc(db, 'users', uid), {
        name: form.name,
        role: 'donor',
        bloodGroup: form.bloodGroup,
        district: form.district,
        phoneMasked: maskPhone(form.phone),
        createdAt: serverTimestamp()
      }, { merge: true });
      alert('Signup complete. Redirecting to dashboard (not implemented).');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally { setLoading(false); }
  }

  return (
    <Layout>
      <h2 className="text-2xl mb-4">Donor Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" className="w-full p-2 border rounded" />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone (e.g. +88017...)" className="w-full p-2 border rounded" />
        <input value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} placeholder="Blood Group (e.g. A+)" className="w-full p-2 border rounded" />
        <input value={form.district} onChange={e=>setForm({...form,district:e.target.value})} placeholder="District" className="w-full p-2 border rounded" />
        <button disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">Sign up</button>
      </form>
    </Layout>
  )
}
