"use client";
import { createArticle, getToken } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState, ChangeEvent } from 'react';
import Image from 'next/image';
import AdminLayout from '../../../components/AdminLayout';

export default function NewArticlePage(){
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{ if(!getToken()) router.replace('/login'); },[router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(!thumbnailFile){ setError('Thumbnail required'); return; }
    setError(null); setLoading(true);
    try {
      const token = getToken();
      if(!token) throw new Error('Not authenticated');
  await createArticle(token, { title, content, thumbnailFile, link: link || undefined });
      router.push('/articles');
  } catch (e) { const err = e as Error; setError(err.message); } finally { setLoading(false); }
  };

  return (
    <AdminLayout title="Create New Article">
      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 max-w-4xl px-2 sm:px-0">
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 shadow-xl space-y-6 md:space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">Primary Details</h2>
            <p className="text-sm text-white/50">Give your research article a concise, descriptive title and write the main content below.</p>
          </div>
          {error && <div className="bg-red-500/20 border border-red-500 rounded px-4 py-2 text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center justify-between">External Link <span className="text-xs font-normal text-white/50">(optional)</span></label>
            <input value={link} placeholder="https://example.com/full-report" onChange={e=>setLink(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Content (Markdown or Plain)</label>
            <textarea value={content} onChange={e=>setContent(e.target.value)} rows={12} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF] resize-y" required />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Thumbnail Image</label>
              <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>)=> setThumbnailFile(e.target.files?.[0] || null)} className="block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-[#0AFFFF] file:text-[#0D0C34] hover:file:bg-[#08e6d9]" required />
              {thumbnailFile && <div className="mt-3 flex items-start gap-4">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={URL.createObjectURL(thumbnailFile)} alt="preview" className="h-40 w-64 object-cover rounded-lg border border-white/10 shadow" /><div className="text-xs text-white/50 leading-relaxed max-w-sm">Preview of the selected thumbnail. Choose a visually clear image that represents the report’s focus.</div></div>}
            </div>
          </div>
        </section>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="bg-[#0AFFFF] text-[#0D0C34] font-semibold px-8 py-3 rounded-md hover:bg-[#08e6d9] disabled:opacity-50 shadow-md">{loading? 'Creating...' : 'Publish Article'}</button>
          <button type="button" onClick={()=>router.back()} className="px-8 py-3 rounded-md border border-white/30 hover:bg-white/10">Cancel</button>
        </div>
      </form>
    </AdminLayout>
  );
}
