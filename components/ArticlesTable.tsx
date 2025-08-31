"use client";
import { useEffect, useState } from 'react';
import { Article, deleteArticle, getToken, listArticles } from '@/lib/api';
import Link from 'next/link';

export default function ArticlesTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listArticles();
      setArticles(data.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{load();},[]);

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this article?')) return;
    const token = getToken();
    if(!token){ alert('Not authenticated'); return; }
    setDeletingId(id);
    try {
      await deleteArticle(token, id);
      setArticles(prev => prev.filter(a=>a.id!==id));
    } catch (e) {
      const err = e as Error;
      alert(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading articles...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Articles</h2>
        <Link href="/articles/new" className="self-start sm:self-auto bg-[#0AFFFF] text-[#0D0C34] px-4 py-2 rounded-md font-medium hover:bg-[#08e6d9] text-sm md:text-base">New Article</Link>
      </div>
      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/70">
              <th className="p-3">Title</th>
              <th className="p-3">Created</th>
              <th className="p-3">Thumbnail</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-3 text-white max-w-[340px] truncate" title={a.title}>{a.title}</td>
                <td className="p-3 text-white/70 whitespace-nowrap">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.thumbnail} alt="thumb" className="h-10 w-16 object-cover rounded-md border border-white/10" />
                </td>
                <td className="p-3 text-right space-x-2 whitespace-nowrap">
                  <Link href={`/articles/${a.id}/edit`} className="text-[#0AFFFF] hover:underline">Edit</Link>
                  <button disabled={deletingId===a.id} onClick={()=>handleDelete(a.id)} className="text-red-400 hover:underline disabled:opacity-50">{deletingId===a.id ? 'Deleting...' : 'Delete'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length===0 && <div className="p-6 text-center text-white/60">No articles yet.</div>}
      </div>
    </div>
  );
}
