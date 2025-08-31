"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken, getToken } from '@/lib/api';
import { useEffect, useState } from 'react';
import { FileText, PlusCircle, Shield, LayoutGrid } from 'lucide-react';

const navGroups = [
  {
    title: 'Content',
    items: [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
      { href: '/articles', label: 'Articles', icon: FileText },
      { href: '/articles/new', label: 'New Article', icon: PlusCircle }
    ]
  },
  {
    title: 'Account',
    items: [
      { href: '/change-password', label: 'Change Password', icon: Shield }
    ]
  }
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{setMounted(true)},[]);
  if(!mounted) return null;
  const token = getToken();
  return (
    <aside className="w-68 bg-[#0D0C34] border-r border-white/10 text-white min-h-screen flex flex-col">
      <div className="px-6 pt-6 pb-5 border-b border-white/10">
        <div className="text-xl font-bold tracking-tight">NexVest <span className="text-[#0AFFFF]">Admin</span></div>
        <p className="text-[10px] mt-1 uppercase tracking-wider text-white/40">Control Center</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {navGroups.map(group => (
          <div key={group.title} className="space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-white/40 px-2 font-semibold">{group.title}</p>
            <ul className="space-y-1">
              {group.items.map(item => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium relative ${active ? 'bg-white text-[#0D0C34]' : 'text-white/70 hover:bg-white/10 hover:text-white'} transition-colors`}> 
                      <Icon className={`h-4 w-4 ${active ? 'text-[#0D0C34]' : 'text-[#0AFFFF] group-hover:text-[#0AFFFF]'}`} />
                      <span className="truncate">{item.label}</span>
                      {active && <span className="absolute inset-y-0 left-0 w-1 bg-[#0AFFFF] rounded-r-sm" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        {token && (
          <button onClick={()=>{clearToken(); router.push('/login')}} className="w-full bg-white/10 hover:bg-white/20 text-xs font-medium rounded-md px-3 py-2 tracking-wide">Logout</button>
        )}
        {!token && (
          <button onClick={()=>router.push('/login')} className="w-full bg-[#0AFFFF] text-[#0D0C34] text-xs font-semibold rounded-md px-3 py-2 tracking-wide">Login</button>
        )}
      </div>
    </aside>
  );
}

