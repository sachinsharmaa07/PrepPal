import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              PrepPal
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/(student)/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/jobs" className="text-slate-300 hover:text-white transition-colors">Jobs</Link>
              <Link href="/interviews" className="text-slate-300 hover:text-white transition-colors">Interviews</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-all">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
