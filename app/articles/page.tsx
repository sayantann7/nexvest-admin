"use client";
import ArticlesTable from '@/components/ArticlesTable';
import { getToken } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function ArticlesPage() {
  const router = useRouter();
  useEffect(()=>{ if(!getToken()) router.replace('/login'); },[router]);
  return (
    <AdminLayout title="Articles">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
        <ArticlesTable />
      </div>
    </AdminLayout>
  );
}

