import { useState } from 'react';
import Layout from '../../components/Layout';
import { addDoc, collection, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebaseClient';
import AdminPanel from '../../components/AdminPanel';

export default function CreateRequest() {
  const [form, setForm] = useState({ patientName:'', bloodGroup:'', units:1, hospitalName:'', district:''});
  const [matched, setMatched] = useState([]);
  const [requestId, setRequestId] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();
    // create request
    const docRef = await addDoc(collection(db, 'requests'), {
      patientName: form.patientName,
      bloodGroup: form.bloodGroup,
      units: form.units,
      hospitalName: form.hospitalName,
      location: { district: form.district },
      createdBy: auth?.currentUser?.uid || null,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    setRequestId(docRef.id);
    // find matches
    const q = query(collection(db, 'users'), where('bloodGroup','==', form.bloodGroup), where('district','==', form.district), limit(10));
    const snaps = await getDocs(q);
    const donors = snaps.docs.map(d => ({ uid: d.id, ...d.data() }));
    setMatched(donors);
  }

  return (
    <Layout>
      <h2 className="text-2xl mb-4">Create Blood Request</h2>
      <form onSubmit={handleCreate} className="space-y-3 max-w-md">
        <input value={form.patientName} onChange={e=>setForm({...form,patientName:e.target.value})} placeholder="Patient name" className="w-full p-2 border rounded" />
        <input value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} placeholder="Blood group" className="w-full p-2 border rounded" />
        <input value={form.units} onChange={e=>setForm({...form,units:e.target.value})} type="number" placeholder="Units" className="w-full p-2 border rounded" />
        <input value={form.hospitalName} onChange={e=>setForm({...form,hospitalName:e.target.value})} placeholder="Hospital name" className="w-full p-2 border rounded" />
        <input value={form.district} onChange={e=>setForm({...form,district:e.target.value})} placeholder="District" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create request & match donors</button>
      </form>

      {matched.length > 0 && (
        <>
          <h3 className="mt-6 text-xl">Matched donors</h3>
          <AdminPanel matchedDonors={matched} requestId={requestId} />
        </>
      )}
    </Layout>
  )
}
