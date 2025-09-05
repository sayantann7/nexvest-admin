"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listUsers, UserRecord, getToken } from '../../lib/api';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Basic auth gate (same pattern as dashboard root)
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    (async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        {loading && (
          <div className="text-white/70">Loading users...</div>
        )}
        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}
        {!loading && !error && users.length === 0 && (
          <div className="text-white/60">No users found.</div>
        )}
        {!loading && !error && users.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Phone</th>
                  <th className="text-left px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-white truncate max-w-[240px]" title={u.name}>{u.name}</td>
                    <td className="px-5 py-3 text-white/80 truncate max-w-[260px]" title={u.email}>{u.email}</td>
                    <td className="px-5 py-3 text-white/80">{u.phoneNumber}</td>
                    <td className="px-5 py-3 text-white/50 whitespace-nowrap">{new Date(u.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
