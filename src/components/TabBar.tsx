import React, { useState } from 'react';
import { Plus, MoreHorizontal, Edit2, Trash2, Settings, FileText, Check } from 'lucide-react';
import { TodoTab, PriorityTemplate } from '../types';

interface TabBarProps {
  tabs: TodoTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onAddTab: (title: string, templateId: string, icon?: string) => void;
  onUpdateTab: (tabId: string, title: string, templateId: string) => void;
  onDeleteTab: (tabId: string) => void;
  templates: PriorityTemplate[];
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  onUpdateTab,
  onDeleteTab,
  templates,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTab, setEditingTab] = useState<TodoTab | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newTemplateId, setNewTemplateId] = useState(templates[0]?.id || 'eisenhower-matrix');
  const [newIcon, setNewIcon] = useState('📌');

  const EMOJI_OPTIONS = ['📌', '💻', '☕', '📝', '🎯', '🚀', '⭐', '💡', '📚', '🏋️‍♂️', '🛒', '🎨'];

  const handleCreateTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTab(newTitle.trim(), newTemplateId, newIcon);
    setNewTitle('');
    setIsAddOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTab || !newTitle.trim()) return;
    onUpdateTab(editingTab.id, newTitle.trim(), newTemplateId);
    setEditingTab(null);
  };

  const openEditModal = (tab: TodoTab) => {
    setEditingTab(tab);
    setNewTitle(tab.title);
    setNewTemplateId(tab.templateId);
  };

  return (
    <div className="border-b border-black/10 dark:border-white/10 px-3 py-1.5 bg-black/5 dark:bg-white/5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar flex-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const template = templates.find((t) => t.id === tab.templateId);

          return (
            <div
              key={tab.id}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-black/10 dark:bg-zinc-800 text-neutral-900 dark:text-zinc-50 font-bold shadow-xs border-black/10 dark:border-zinc-700 scale-[1.02]'
                  : 'bg-black/5 dark:bg-zinc-900/60 hover:bg-black/10 dark:hover:bg-zinc-800 text-neutral-600 dark:text-zinc-200 border-transparent'
              }`}
              onClick={() => onSelectTab(tab.id)}
            >
              <span className="text-sm">{tab.icon || '📌'}</span>
              <span>{tab.title}</span>

              {/* Tab menu button */}
              <div
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(tab);
                }}
                title="设置标签页"
              >
                <MoreHorizontal className="w-3 h-3" />
              </div>
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          onClick={() => {
            setNewTitle('');
            setNewTemplateId(templates[0]?.id || 'eisenhower-matrix');
            setIsAddOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors border border-dashed border-black/15 dark:border-white/15 whitespace-nowrap"
          title="新建待办清单页签"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新页签</span>
        </button>
      </div>

      {/* Modal for Creating or Editing Tab */}
      {(isAddOpen || editingTab) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>{editingTab ? '编辑待办页签' : '新建待办事项页签'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingTab(null);
                }}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingTab ? handleSaveEdit : handleCreateTab} className="space-y-4">
              {/* Tab Icon Selection */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  页签图标
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewIcon(emoji)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                        newIcon === emoji
                          ? 'bg-amber-100 dark:bg-amber-900/40 ring-2 ring-amber-500'
                          : 'bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Title */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  页签名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="如：工作需求、个人目标..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Bound Priority Template */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  选择任务优先级模板
                </label>
                <select
                  value={newTemplateId}
                  onChange={(e) => setNewTemplateId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.levels.length} 个等级)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                  每个页签使用独立的优先级划分规则（如艾森豪威尔矩阵或自定义四级）。
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-zinc-800">
                {editingTab && tabs.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`确定要删除页签 "${editingTab.title}" 吗？其下的任务也将被移除。`)) {
                        onDeleteTab(editingTab.id);
                        setEditingTab(null);
                      }
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>删除页签</span>
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddOpen(false);
                      setEditingTab(null);
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors shadow-sm"
                  >
                    {editingTab ? '保存修改' : '确认创建'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
