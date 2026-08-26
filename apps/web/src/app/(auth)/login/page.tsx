'use client';

import { GoogleLogin } from '@react-oauth/google';
import apiClient from '@/lib/api/client';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await apiClient.post('/auth/google', {
        idToken: credentialResponse.credential
      });
      if (res.data?.success) {
        localStorage.setItem('token', res.data.data.token);
        router.push('/dashboard'); // redirect to student dashboard by default
      }
    } catch (err) {
      console.error('Login failed', err);
      alert('Google login failed. Please try again.');
    }
  };

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

        <div className="mt-6 flex items-center justify-center">
          <div className="border-t border-slate-700 flex-grow"></div>
          <span className="px-3 text-slate-500 text-sm">Or continue with</span>
          <div className="border-t border-slate-700 flex-grow"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            theme="filled_black"
            size="large"
            shape="rectangular"
          />
        </div>
      </div>
    </div>
  );
}
