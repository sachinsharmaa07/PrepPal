import { Navbar } from '@/components/Navbar';

export default function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Recruiter Dashboard</h1>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            + Post New Job
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-indigo-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-2">Active Listings</h2>
            <p className="text-4xl font-bold text-indigo-400">4</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-2">Total Applicants</h2>
            <p className="text-4xl font-bold text-cyan-400">128</p>
            <p className="text-slate-400 mt-2 text-sm">24 new since yesterday</p>
          </div>
        </div>
      </main>
    </div>
  );
}
