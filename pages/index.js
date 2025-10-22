import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Sanskaran Foundation - Blood Bank</h1>
        <p className="text-gray-600 mb-6">A simple Blood Donation Management starter (Next.js + Firebase)</p>
        <div className="space-x-3">
          <Link href="/signup"><a className="px-4 py-2 bg-indigo-600 text-white rounded">Sign up (Donor)</a></Link>
          <Link href="/requests/create"><a className="px-4 py-2 border rounded">Create Request</a></Link>
          <Link href="/admin"><a className="px-4 py-2 border rounded">Admin Panel</a></Link>
        </div>
      </div>
    </Layout>
  )
}
