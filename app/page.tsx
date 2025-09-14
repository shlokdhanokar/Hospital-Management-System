import { BedManagement } from "@/components/bed-management"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Hospital Bed Management System</h1>
          <p className="text-slate-600 text-lg">Manage patient beds, expenses, and discharge summaries</p>
        </header>
        <BedManagement />
      </div>
    </main>
  )
}
