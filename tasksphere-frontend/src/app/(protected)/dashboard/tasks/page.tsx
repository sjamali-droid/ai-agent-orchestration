'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskModal from '@/components/tasks/TaskModal';
import { api } from '@/lib/api';
import type { Task, Project, PaginatedResponse, TaskStatus } from '@/types';

export default function TasksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('project');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selected, setSelected] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api<PaginatedResponse<Project>>('projects', '/projects?limit=100').then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  const loadTasks = useCallback(async () => {
    if (!projectId) return;
    const params = new URLSearchParams({ project_id: projectId, limit: '200' });
    if (query) params.set('q', query);
    const r = await api<PaginatedResponse<Task>>('tasks', `/tasks?${params}`);
    setTasks(r.data);
  }, [projectId, query]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const onStatusChange = async (taskId: string, status: TaskStatus) => {
    await api('tasks', `/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t));
  };

  const createTask = async () => {
    if (!newTitle.trim() || !projectId) return;
    const task = await api<Task>('tasks', '/tasks', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId, title: newTitle }),
    });
    setTasks((prev) => [...prev, task]);
    setNewTitle('');
    setShowCreate(false);
  };

  return (
    <>
      <Header title="Tasks" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <select value={projectId || ''} onChange={(e) => router.push(`/dashboard/tasks?project=${e.target.value}`)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="">Select project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {projectId && (
            <>
              <div className="relative flex-1 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition ml-auto">
                <Plus size={16} /> New Task
              </button>
            </>
          )}
        </div>

        {!projectId ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Select a project to view tasks</p>
          </div>
        ) : (
          <KanbanBoard tasks={tasks} onStatusChange={onStatusChange} onSelect={setSelected} />
        )}
      </div>

      {selected && (
        <TaskModal task={selected} onClose={() => { setSelected(null); loadTasks(); }} onUpdate={loadTasks} />
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Create Task</h3>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus placeholder="Task title" maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && createTask()} />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
              <button onClick={createTask} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
