import React, { useState } from 'react';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Image as ImageIcon,
  GripVertical,
  Clock,
  AlertCircle,
  MoreVertical,
  Type,
} from 'lucide-react';
import { TaskItem as TaskItemType, PriorityLevel, TaskFormatting } from '../types';

interface TaskItemProps {
  task: TaskItemType;
  priorityLevel?: PriorityLevel;
  allPriorityLevels: PriorityLevel[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: TaskItemType) => void;
  onChangePriority: (taskId: string, newLevelId: string) => void;
  onPreviewImage: (imageUrl: string) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  priorityLevel,
  allPriorityLevels,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onChangePriority,
  onPreviewImage,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  // Formatting helpers
  const formatting: TaskFormatting = task.formatting || {};

  // Preserve user custom color exactly if set; if not set, customColor is undefined and Tailwind dark:text-white applies
  const customColor = !task.completed && formatting.color ? formatting.color : undefined;

  const textStyles: React.CSSProperties = {
    fontWeight: formatting.bold ? '700' : '400',
    fontStyle: formatting.italic ? 'italic' : 'normal',
    textDecoration: formatting.underline ? 'underline' : 'none',
    color: customColor,
  };

  // Due date status logic
  const getDueStatus = () => {
    if (!task.dueDate) return null;
    const due = new Date(task.dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 3600);

    const formatted = due.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (task.completed) {
      return { text: `截止时间: ${formatted}`, status: 'done' };
    }

    if (diffHours < 0) {
      return { text: `已逾期 (${formatted})`, status: 'overdue' };
    }
    if (diffHours <= 24) {
      return { text: `今日到期 (${formatted})`, status: 'urgent' };
    }
    return { text: `截止: ${formatted}`, status: 'normal' };
  };

  const dueStatus = getDueStatus();

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`group relative flex items-start gap-2.5 p-2.5 rounded-xl border transition-all duration-200 backdrop-blur-sm ${
        task.completed
          ? 'bg-black/5 dark:bg-zinc-900/60 border-black/5 dark:border-zinc-800/60 opacity-80'
          : 'bg-black/5 dark:bg-zinc-800/80 hover:bg-black/[0.08] dark:hover:bg-zinc-800 border-black/10 dark:border-zinc-700/70 hover:shadow-xs'
      } ${isDragging ? 'opacity-40 scale-[0.98] border-amber-400' : ''}`}
    >
      {/* 1. COMPLETION CHECKBOX AT THE ABSOLUTE FRONT (完成按钮在任务最前方) */}
      <button
        onClick={() => onToggleComplete(task.id)}
        className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
          task.completed
            ? 'bg-neutral-500 border-neutral-500 dark:bg-neutral-500 dark:border-neutral-500 text-white shadow-xs'
            : 'border-neutral-400 dark:border-zinc-400 hover:border-amber-500 hover:bg-amber-500/10 dark:hover:border-amber-400'
        }`}
        title={task.completed ? '标记为未完成' : '标记为已完成'}
      >
        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
      </button>

      {/* Main Task Content */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Title and priority badge header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            {/* Title with Formatting */}
            <p
              style={textStyles}
              className={`text-xs leading-normal break-words transition-colors ${
                task.completed
                  ? 'line-through text-neutral-400 dark:text-zinc-400 font-normal'
                  : 'text-neutral-900 dark:text-white font-medium'
              }`}
            >
              {task.title}
            </p>

            {/* Small text below marking completion timestamp if completed */}
            {task.completed && task.completedAt && (
              <p className="text-[10px] text-neutral-400 dark:text-neutral-300 flex items-center gap-1 font-mono">
                <Clock className="w-2.5 h-2.5" />
                <span>已于 {task.completedAt} 完成</span>
              </p>
            )}
          </div>

          {/* Priority Level Badge */}
          {priorityLevel && (
            <div className="relative shrink-0">
              <button
                onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 transition-transform hover:scale-105 ${
                  priorityLevel.badgeBg || 'bg-neutral-100'
                } ${priorityLevel.badgeText || 'text-neutral-700'}`}
                title="点击切换任务优先级"
              >
                <span>{priorityLevel.icon || '📌'}</span>
                <span>{priorityLevel.name}</span>
              </button>

              {/* Quick priority switch dropdown */}
              {showPriorityMenu && (
                <div className="absolute right-0 top-full mt-1 z-30 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl p-1 shadow-xl text-xs w-36 space-y-0.5">
                  <div className="px-2 py-1 text-[10px] text-neutral-500 dark:text-neutral-300 font-semibold border-b border-neutral-100 dark:border-zinc-800">
                    更改优先级
                  </div>
                  {allPriorityLevels.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        onChangePriority(task.id, lvl.id);
                        setShowPriorityMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg text-[11px] flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-200 transition-colors ${
                        lvl.id === task.priorityLevelId ? 'font-bold text-amber-600 dark:text-amber-400' : ''
                      }`}
                    >
                      <span>{lvl.icon || '📌'}</span>
                      <span className="truncate">{lvl.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Due Date & Attached Images */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {dueStatus && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-mono ${
                dueStatus.status === 'overdue'
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-200 font-bold'
                  : dueStatus.status === 'urgent'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-200 font-semibold'
                  : 'bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-200'
              }`}
            >
              <Calendar className="w-2.5 h-2.5" />
              <span>{dueStatus.text}</span>
            </span>
          )}

          {/* Attached image thumbnails */}
          {task.images && task.images.length > 0 && (
            <div className="flex items-center gap-1.5">
              {task.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onPreviewImage(img)}
                  className="relative group/img w-7 h-7 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 hover:ring-2 hover:ring-amber-500 transition-all shrink-0"
                  title="点击查看图片"
                >
                  <img src={img} alt="attachment" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons & Drag Handle */}
      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEditTask(task)}
          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="编辑任务"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDeleteTask(task.id)}
          className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="删除任务"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Drag handle */}
        <div
          className="p-1 text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400 cursor-grab active:cursor-grabbing"
          title="按住拖拽排序"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
