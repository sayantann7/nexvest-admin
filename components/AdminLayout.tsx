"use client";
import AdminNav from '@/components/AdminNav';
import { ReactNode } from 'react';

export default function AdminLayout({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#07061C] text-white">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0D0C34] via-[#101a54] to-[#0D0C34] sticky top-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight leading-none">{title}</h1>
            <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">NexVest Admin Console</p>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_30%_20%,#15296B_0%,#07061C_65%)]">
          <div className="max-w-7xl mx-auto space-y-10">
            {children}
          </div>
        </main>
        <footer className="px-8 py-4 text-xs text-white/40 border-t border-white/10">
          © {new Date().getFullYear()} NexVest. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
