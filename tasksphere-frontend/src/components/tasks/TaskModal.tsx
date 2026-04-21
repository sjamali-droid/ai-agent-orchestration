'use client';

import { useState, useEffect } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Task, Comment, TaskStatus, TaskPriority } from '@/types';
import { STATUS_LABELS, COLUMNS, PRIORITY_COLORS } from '@/types';
import { clsx } from 'clsx';

interface Props {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}

export default function TaskModal({ task, onClose, onUpdate }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<Comment[]>('tasks', `/comments/${task.id}`).then(setComments).catch(() => {});
  }, [task.id]);

  const save = async () => {
    setSaving(true);
    try {
      await api('tasks', `/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title, description: description || null, priority }),
      });
      onUpdate();
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (status: TaskStatus) => {
    try {
      await api('tasks', `/tasks/${task.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      onUpdate();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Status change failed');
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const c = await api<Comment>('tasks', `/comments/${task.id}`, {
      method: 'POST',
      body: JSON.stringify({ body: newComment }),
    });
    setComments((prev) => [...prev, c]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Task Detail</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description (Markdown)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none font-mono" />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <div className="flex gap-1">
                {COLUMNS.map((s) => (
                  <button key={s} onClick={() => changeStatus(s)} disabled={s === task.status}
                    className={clsx('px-2 py-1.5 rounded-md text-xs font-medium transition',
                      s === task.status ? 'bg-indigo-100 text-indigo-700 cursor-default' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', PRIORITY_COLORS[task.priority])}>{task.priority}</span>
            <span className="text-xs text-gray-400">Created {new Date(task.created_at).toLocaleDateString()}</span>
            {task.assignee_ids && task.assignee_ids.length > 0 && (
              <span className="text-xs text-gray-400">{task.assignee_ids.length} assignee(s)</span>
            )}
          </div>

          <button onClick={save} disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Paperclip size={14} /> Comments ({comments.length})
            </h4>

            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700">{c.author_name || 'User'}</span>
                    <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{c.body}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-sm text-gray-400">No comments yet</p>}
            </div>

            {user?.role !== 'guest' && (
              <div className="flex gap-2">
                <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                <button onClick={addComment}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
