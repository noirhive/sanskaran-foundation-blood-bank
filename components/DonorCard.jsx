export default function DonorCard({ donor, onRequestReveal }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border">
      <div>
        <div className="font-semibold">{donor.name || "No name"}</div>
        <div className="text-sm text-gray-600">{donor.bloodGroup} • {donor.district}</div>
        <div className="text-sm mt-2">Phone: {donor.phoneMasked || "Hidden"}</div>
      </div>
      <div>
        <button
          onClick={() => onRequestReveal(donor)}
          className="px-3 py-2 bg-indigo-600 text-white rounded-md"
        >
          Request Contact
        </button>
      </div>
    </div>
  )
}
