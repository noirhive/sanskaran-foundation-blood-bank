export default function Layout({ children }) {
  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {children}
      </div>
    </div>
  )
}
