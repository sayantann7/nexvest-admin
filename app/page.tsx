"use client";
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';
import { Article, listArticles, getToken } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RootDashboard(){
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(()=>{
    const token = getToken();
    if(!token){
      router.replace('/login');
      return; // don't proceed to fetch
    }
    setAuthChecked(true);
    (async()=>{ try { const data = await listArticles(); setArticles(data.slice().sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); } finally { setLoading(false);} })();
  },[router]);

  const total = articles.length;
  const latest = articles.slice(0,5);

  if(!authChecked) {
    return <div className="min-h-screen flex items-center justify-center bg-[#07061C] text-white/60">Redirecting...</div>;
  }

  return (
    <AdminLayout title="Dashboard" actions={<Link href="/articles/new" className="bg-[#0AFFFF] text-[#0D0C34] font-medium px-5 py-2.5 rounded-md hover:bg-[#08e6d9] shadow">New Article</Link>}>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-6 shadow-lg">
          <h3 className="text-sm font-medium text-white/60">Total Articles</h3>
          <p className="text-4xl font-semibold mt-3 tracking-tight">{loading ? '—' : total}</p>
          <p className="text-[11px] text-white/40 mt-2 uppercase">All published research</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-6 shadow-lg">
          <h3 className="text-sm font-medium text-white/60">Latest Published</h3>
          <p className="text-4xl font-semibold mt-3 tracking-tight">{loading ? '—' : latest.length}</p>
          <p className="text-[11px] text-white/40 mt-2 uppercase">Updated recently</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-6 shadow-lg">
          <h3 className="text-sm font-medium text-white/60">Storage</h3>
          <p className="text-4xl font-semibold mt-3 tracking-tight">∞</p>
          <p className="text-[11px] text-white/40 mt-2 uppercase">S3 backed assets</p>
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent Articles</h2>
          <Link href="/articles" className="text-xs font-medium text-[#0AFFFF] hover:underline">View All</Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Created</th>
                <th className="text-left px-5 py-3 font-medium">Preview</th>
              </tr>
            </thead>
            <tbody>
              {(!loading && latest.length === 0) && (
                <tr><td colSpan={3} className="px-5 py-6 text-center text-white/50">No articles yet.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={3} className="px-5 py-6 text-center text-white/40">Loading...</td></tr>
              )}
              {latest.map(a => (
                <tr key={a.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-5 py-3 font-medium text-white truncate max-w-[420px]" title={a.title}><Link href={`/articles/${a.id}/edit`} className="hover:underline">{a.title}</Link></td>
                  <td className="px-5 py-3 text-white/60 whitespace-nowrap">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3"><img src={a.thumbnail} className="h-12 w-20 object-cover rounded-md border border-white/10" alt="thumb" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
