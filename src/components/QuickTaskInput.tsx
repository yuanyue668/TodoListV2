import React, { useState } from 'react';
import { Plus, SlidersHorizontal, Sparkles } from 'lucide-react';
import { PriorityLevel } from '../types';

interface QuickTaskInputProps {
  priorityLevels: PriorityLevel[];
  onQuickAdd: (title: string, priorityLevelId: string) => void;
  onOpenRichEditor: () => void;
}

export const QuickTaskInput: React.FC<QuickTaskInputProps> = ({
  priorityLevels,
  onQuickAdd,
  onOpenRichEditor,
}) => {
  const [title, setTitle] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState(priorityLevels[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onQuickAdd(title.trim(), selectedLevelId || priorityLevels[0]?.id || '');
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 rounded-2xl bg-black/5 dark:bg-zinc-800/90 border border-black/10 dark:border-zinc-700 hover:bg-black/[0.07] dark:hover:bg-zinc-800 transition-colors shadow-sm backdrop-blur-md flex items-center gap-2"
    >
      <input
        type="text"
        placeholder="添加待办事项... (Enter 快速创建)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-transparent border-none text-xs sm:text-sm px-2 py-1 text-neutral-900 dark:text-zinc-50 font-medium placeholder-neutral-400 dark:placeholder-zinc-400 focus:outline-none"
      />

      {/* Priority level selector dropdown inside input bar */}
      {priorityLevels.length > 0 && (
        <select
          value={selectedLevelId || priorityLevels[0]?.id}
          onChange={(e) => setSelectedLevelId(e.target.value)}
          className="text-[11px] px-2 py-1 rounded-xl bg-black/5 dark:bg-zinc-700 text-neutral-700 dark:text-zinc-100 font-medium border-none focus:outline-none cursor-pointer max-w-[110px] truncate"
        >
          {priorityLevels.map((lvl) => (
            <option key={lvl.id} value={lvl.id} className="bg-white dark:bg-zinc-800">
              {lvl.icon || '📌'} {lvl.name}
            </option>
          ))}
        </select>
      )}

      {/* Quick Add Button */}
      <button
        type="submit"
        disabled={!title.trim()}
        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0"
      >
        <Plus className="w-3.5 h-3.5 stroke-[3]" />
        <span className="hidden sm:inline">添加</span>
      </button>

      {/* Rich Editor Modal Trigger */}
      <button
        type="button"
        onClick={onOpenRichEditor}
        className="p-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-neutral-600 dark:text-neutral-300 transition-colors shrink-0"
        title="打开图文/高级样式编辑器"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
      </button>
    </form>
  );
};
