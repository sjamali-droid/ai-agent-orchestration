'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Lock, Globe, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';
import type { Project, PaginatedResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function ProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    api<PaginatedResponse<Project>>('projects', '/projects').then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    const p = await api<Project>('projects', '/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description: desc || null, is_private: isPrivate }),
    });
    setProjects((prev) => [p, ...prev]);
    setShowModal(false);
    setName('');
    setDesc('');
    setIsPrivate(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    await api('projects', `/projects/${id}`, { method: 'DELETE' });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const canCreate = user?.role === 'admin' || user?.role === 'project_manager';

  return (
    <>
      <Header title="Projects" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          {canCreate && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
              <Plus size={16} /> New Project
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} onClick={() => router.push(`/dashboard/tasks?project=${p.id}`)}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 cursor-pointer transition group">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">{p.name}</h3>
                <div className="flex items-center gap-2">
                  {p.is_private ? <Lock size={14} className="text-amber-500" /> : <Globe size={14} className="text-green-500" />}
                  {(user?.role === 'admin' || user?.id === p.owner_id) && (
                    <button onClick={(e) => { e.stopPropagation(); remove(p.id); }}
                      className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              {p.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{p.description}</p>}
              <p className="text-xs text-gray-400 mt-3">{new Date(p.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No projects yet</p>
            {canCreate && <p className="text-sm mt-1">Create your first project to get started</p>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Create Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-gray-700">Private project</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
              <button onClick={create} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
