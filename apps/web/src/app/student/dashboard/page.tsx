import { Navbar } from '@/components/Navbar';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-indigo-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-2">Resume Score</h2>
            <p className="text-4xl font-bold text-indigo-400">85/100</p>
            <p className="text-slate-400 mt-2 text-sm">Top 15% of applicants</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-2">Mock Interviews</h2>
            <p className="text-4xl font-bold text-cyan-400">3</p>
            <p className="text-slate-400 mt-2 text-sm">Completed this week</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-purple-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-2">Active Applications</h2>
            <p className="text-4xl font-bold text-purple-400">12</p>
            <p className="text-slate-400 mt-2 text-sm">2 Under Review</p>
          </div>
        </div>
      </main>
    </div>
  );
}
