"use client";
import { getArticle, getToken, updateArticle } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';

export default function EditArticlePage(){
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [link, setLink] = useState('');
  const [newThumbnailFile, setNewThumbnailFile] = useState<File| null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);
  useEffect(()=>{ if(!getToken()) router.replace('/login'); },[router]);
  useEffect(()=>{ (async()=>{
    try {
      const a = await getArticle(id);
  setTitle(a.title); setContent(a.content); setThumbnail(a.thumbnail); setLink(a.link || '');
    } catch(e:any){ setError(e.message);} finally { setLoading(false);} })(); },[id]);

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      const token = getToken(); if(!token) throw new Error('Not authenticated');
  await updateArticle(token, id, { title, content, thumbnail: newThumbnailFile ? undefined : thumbnail, thumbnailFile: newThumbnailFile || undefined, link: link || undefined });
      router.push('/articles');
    } catch(e:any){ setError(e.message);} finally { setSaving(false);} }

  if(loading) return <AdminLayout title="Edit Article"><div className="text-white/60">Loading...</div></AdminLayout>;
  if(error) return <AdminLayout title="Edit Article"><div className="text-red-400">{error}</div></AdminLayout>;

  return (
    <AdminLayout title="Edit Article">
      <div className="space-y-10 max-w-4xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-xl space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">External Link (optional)</label>
            <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://example.com/full-report" className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Content</label>
            <textarea value={content} onChange={e=>setContent(e.target.value)} rows={14} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF] resize-y" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Current Thumbnail URL</label>
              <input value={thumbnail} onChange={e=>setThumbnail(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]" />
              <img src={thumbnail} alt="current thumbnail" className="h-40 object-cover rounded-md border border-white/10 mt-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center justify-between">Replace Thumbnail <span className="text-xs font-normal text-white/50">(optional)</span></label>
              <input
                type="file"
                accept="image/*"
                onChange={e=>{
                  const file = e.target.files?.[0] || null;
                  setNewThumbnailFile(file);
                  if(file){
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                  } else {
                    setPreviewUrl('');
                  }
                }}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF] file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:bg-[#0AFFFF] file:text-[#0D0C34] hover:file:bg-[#08e6d9]"
              />
              {previewUrl && (
                <div>
                  <p className="text-xs text-white/60 mb-1">New Preview:</p>
                  <img src={previewUrl} alt="new thumbnail preview" className="h-40 object-cover rounded-md border border-white/10" />
                </div>
              )}
            </div>
          </div>
          {error && <div className="bg-red-500/20 border border-red-500 rounded px-4 py-2 text-sm">{error}</div>}
          <div className="flex gap-4">
            <button onClick={handleSave} disabled={saving} className="bg-[#0AFFFF] text-[#0D0C34] font-semibold px-8 py-3 rounded-md hover:bg-[#08e6d9] disabled:opacity-50 shadow-md">{saving? 'Saving...' : 'Save Changes'}</button>
            <button onClick={()=>router.back()} className="px-8 py-3 rounded-md border border-white/30 hover:bg-white/10">Cancel</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
