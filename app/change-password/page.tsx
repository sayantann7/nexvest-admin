"use client";
import { changePassword, getToken } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function ChangePasswordPage(){
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{ if(!getToken()) router.replace('/login'); },[router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setMessage(null);
    if(newPassword !== confirmPassword){ setError('Passwords do not match'); return; }
    const token = getToken(); if(!token){ setError('Not authenticated'); return; }
    setLoading(true);
    try {
      await changePassword(token, currentPassword, newPassword);
      setMessage('Password changed successfully');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
  } catch(e){ const err = e as Error; setError(err.message || 'Failed to change password'); } finally { setLoading(false); }
  };

  return (
    <AdminLayout title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-10 max-w-xl">
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Update Credentials</h2>
            <p className="text-sm text-white/50">Ensure your new password is at least 8 characters and unique.</p>
          </div>
          {error && <div className="bg-red-500/20 border border-red-500 rounded px-4 py-2 text-sm">{error}</div>}
          {message && <div className="bg-green-500/20 border border-green-500 rounded px-4 py-2 text-sm">{message}</div>}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Current Password</label>
            <input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">New Password</label>
            <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]" required />
          </div>
          <button disabled={loading} className="bg-[#0AFFFF] text-[#0D0C34] font-semibold px-8 py-3 rounded-md hover:bg-[#08e6d9] disabled:opacity-50 shadow-md">{loading? 'Changing...' : 'Change Password'}</button>
        </section>
      </form>
    </AdminLayout>
  );
}
