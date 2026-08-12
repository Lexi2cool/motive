import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Dashboard</h2>
        <p className="text-sm text-slate-400">Track your progress and achievements</p>
      </div>
      <Dashboard />
    </div>
  )
}
