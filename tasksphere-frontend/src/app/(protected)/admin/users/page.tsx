'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, UserX, UserCheck } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { User, PaginatedResponse, UserRole } from '@/types';
import { clsx } from 'clsx';

const ROLE_BADGE: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  project_manager: 'bg-blue-100 text-blue-700',
  member: 'bg-gray-100 text-gray-700',
  guest: 'bg-amber-100 text-amber-700',
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user && user.role !== 'admin') { router.replace('/dashboard/projects'); return; }
    api<PaginatedResponse<User>>('auth', '/users?limit=100').then((r) => {
      setUsers(r.data);
      setTotal(r.total);
    }).catch(() => {});
  }, [user, router]);

  const changeRole = async (userId: string, role: UserRole) => {
    await api('auth', `/users/${userId}`, { method: 'PATCH', body: JSON.stringify({ role }) });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
  };

  const deactivate = async (userId: string) => {
    if (!confirm('Deactivate this user?')) return;
    await api('auth', `/users/${userId}`, { method: 'DELETE' });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_active: false } : u));
  };

  return (
    <>
      <Header title="Admin — User Management" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={18} className="text-indigo-600" />
          <p className="text-gray-500">{total} user{total !== 1 ? 's' : ''} total</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Joined</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                      disabled={u.id === user?.id}
                      className={clsx('px-2 py-1 rounded-md text-xs font-medium border-0 cursor-pointer', ROLE_BADGE[u.role])}>
                      {(['admin', 'project_manager', 'member', 'guest'] as UserRole[]).map((r) => (
                        <option key={r} value={r}>{r.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {u.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs"><UserCheck size={14} /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-xs"><UserX size={14} /> Deactivated</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {u.is_active && u.id !== user?.id && (
                      <button onClick={() => deactivate(u.id)}
                        className="text-xs text-red-500 hover:underline">Deactivate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
