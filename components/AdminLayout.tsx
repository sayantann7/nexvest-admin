"use client";
import AdminNav from '@/components/AdminNav';
import { ReactNode, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = useCallback(()=> setNavOpen(false),[]);
  return (
    <div className="flex min-h-screen bg-[#07061C] text-white">
      <div className="hidden md:flex"><AdminNav /></div>
      {navOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeNav} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] bg-[#0D0C34] shadow-xl border-r border-white/10">
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
              <span className="text-lg font-semibold">Menu</span>
              <button aria-label="Close navigation" onClick={closeNav} className="p-2 rounded-md hover:bg-white/10"><X className="h-5 w-5" /></button>
            </div>
            <AdminNav onNavigate={closeNav} mobile />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-[#0D0C34] via-[#101a54] to-[#0D0C34] sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button aria-label="Open navigation" onClick={()=>setNavOpen(true)} className="md:hidden p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#0AFFFF]"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight leading-none truncate">{title}</h1>
              <p className="text-[10px] md:text-xs text-white/50 mt-1 uppercase tracking-wider hidden sm:block">NexVest Admin Console</p>
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 md:gap-3 shrink-0">{actions}</div>}
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[radial-gradient(circle_at_30%_20%,#15296B_0%,#07061C_65%)]">
          <div className="mx-auto space-y-8 md:space-y-10 w-full max-w-7xl">
            {children}
          </div>
        </main>
        <footer className="px-4 md:px-8 py-4 text-[10px] md:text-xs text-white/40 border-t border-white/10">© {new Date().getFullYear()} NexVest. All rights reserved.</footer>
      </div>
    </div>
  );
}
