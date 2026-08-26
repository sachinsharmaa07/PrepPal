export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-md w-full backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1">Email</label>
            <input type="email" className="w-full bg-slate-800 text-white rounded-md px-4 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <input type="password" className="w-full bg-slate-800 text-white rounded-md px-4 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition-all duration-300 transform hover:scale-[1.02]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
