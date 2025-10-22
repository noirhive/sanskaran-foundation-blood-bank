import { useState } from 'react';
import DonorCard from './DonorCard';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebaseClient';

export default function AdminPanel({ matchedDonors, requestId, onReveal }) {
  const [loading, setLoading] = useState(false);

  async function handleRequestReveal(donor) {
    setLoading(true);
    try {
      const fn = httpsCallable(functions, 'requestContactReveal');
      const res = await fn({ requestId, donorId: donor.uid });
      alert('Reveal request created. Donor will be notified to consent. RevealId: ' + res.data.id);
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {matchedDonors.map(d => (
        <DonorCard key={d.uid} donor={d} onRequestReveal={handleRequestReveal} />
      ))}
    </div>
  )
}
