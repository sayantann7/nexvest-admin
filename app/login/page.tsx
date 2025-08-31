"use client";
import { FormEvent, useState } from 'react';
import { signin, setToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signin(username, password);
      setToken(res.token);
      router.push('/articles');
    } catch (err:any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07061C] px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-50" style={{background:'radial-gradient(circle at 20% 30%, #15296B 0%, transparent 60%), radial-gradient(circle at 80% 70%, #0D0C34 0%, transparent 55%)'}} />
      <form onSubmit={handleSubmit} className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 w-full max-w-md text-white space-y-8 shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NexVest Admin Sign In</h1>
          <p className="text-sm text-white/50 mt-2">Enter your credentials to access the management console.</p>
        </div>
        {error && <div className="bg-red-500/20 border border-red-500 text-sm px-3 py-2 rounded">{error}</div>}
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            placeholder="Enter username"
            onChange={e=>setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-[#101938] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF] focus:border-[#0AFFFF]/50 transition"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center justify-between">
            <span>Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Enter password"
              onChange={e=>setPassword(e.target.value)}
              className="w-full pr-12 px-3 py-2 rounded-md bg-[#101938] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF] focus:border-[#0AFFFF]/50 transition"
              required
            />
            <button
              type="button"
              onClick={()=>setShowPassword(p=>!p)}
              className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-white/70 hover:text-white focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
  <button disabled={loading} className="w-full bg-[#0AFFFF] text-[#0D0C34] font-semibold py-3 rounded-md hover:bg-[#08e6d9] transition disabled:opacity-50 shadow-lg">{loading? 'Signing in...' : 'Sign In'}</button>
      </form>
    </div>
  );
}
