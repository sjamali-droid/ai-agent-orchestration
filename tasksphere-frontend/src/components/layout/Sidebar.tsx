'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, KanbanSquare, Shield, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

const NAV = [
  { href: '/dashboard/projects', label: 'Projects', icon: LayoutDashboard },
  { href: '/dashboard/tasks', label: 'Tasks', icon: KanbanSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-indigo-600">TaskSphere</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
              pathname.startsWith(item.href) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
        {user?.role === 'admin' && (
          <Link href="/admin/users"
            className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
              pathname.startsWith('/admin') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
            <Shield size={18} />
            Admin
          </Link>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition">
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
