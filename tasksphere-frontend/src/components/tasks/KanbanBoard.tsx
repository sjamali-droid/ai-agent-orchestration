'use client';

import type { Task, TaskStatus } from '@/types';
import { COLUMNS, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS } from '@/types';
import { clsx } from 'clsx';
import { GripVertical } from 'lucide-react';

interface Props {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSelect: (task: Task) => void;
}

export default function KanbanBoard({ tasks, onStatusChange, onSelect }: Props) {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col] = tasks.filter((t) => t.status === col);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) onStatusChange(taskId, status);
  };

  return (
    <div className="grid grid-cols-4 gap-4 min-h-[60vh]">
      {COLUMNS.map((col) => (
        <div key={col}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onDrop={(e) => onDrop(e, col)}
          className="bg-gray-50 rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className={clsx('px-2 py-0.5 rounded-md text-xs font-medium', STATUS_COLORS[col])}>
                {STATUS_LABELS[col]}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{grouped[col].length}</span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {grouped[col].map((task) => (
              <div key={task.id} draggable
                onDragStart={(e) => onDragStart(e, task.id)}
                onClick={() => onSelect(task)}
                className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-sm hover:border-indigo-200 transition group">
                <div className="flex items-start gap-2">
                  <GripVertical size={14} className="text-gray-300 mt-0.5 opacity-0 group-hover:opacity-100 transition shrink-0 cursor-grab" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={clsx('px-1.5 py-0.5 rounded text-[10px] font-medium', PRIORITY_COLORS[task.priority])}>
                        {task.priority}
                      </span>
                      {task.assignee_ids && task.assignee_ids.length > 0 && (
                        <span className="text-[10px] text-gray-400">{task.assignee_ids.length} assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
