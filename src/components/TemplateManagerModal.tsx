import React, { useState } from 'react';
import { LayoutGrid, Plus, Trash2, Edit3, Check, Layers, AlertCircle, Info } from 'lucide-react';
import { PriorityTemplate, PriorityLevel } from '../types';

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PriorityTemplate[];
  onSaveTemplates: (templates: PriorityTemplate[]) => void;
  currentActiveTemplateId: string;
  onSelectTemplateForActiveTab: (templateId: string) => void;
}

const COLOR_PRESETS = [
  { name: '玫瑰红', hex: '#ef4444', bg: 'bg-rose-500/15 dark:bg-rose-500/25', text: 'text-rose-700 dark:text-rose-300 border-rose-200' },
  { name: '琥珀黄', hex: '#f59e0b', bg: 'bg-amber-500/15 dark:bg-amber-500/25', text: 'text-amber-700 dark:text-amber-300 border-amber-200' },
  { name: '湛天蓝', hex: '#3b82f6', bg: 'bg-blue-500/15 dark:bg-blue-500/25', text: 'text-blue-700 dark:text-blue-300 border-blue-200' },
  { name: '翡翠绿', hex: '#10b981', bg: 'bg-emerald-500/15 dark:bg-emerald-500/25', text: 'text-emerald-700 dark:text-emerald-300 border-emerald-200' },
  { name: '紫罗兰', hex: '#a855f7', bg: 'bg-purple-500/15 dark:bg-purple-500/25', text: 'text-purple-700 dark:text-purple-300 border-purple-200' },
  { name: '沉稳灰', hex: '#6b7280', bg: 'bg-gray-500/15 dark:bg-gray-500/25', text: 'text-gray-700 dark:text-gray-300 border-gray-200' },
];

export const TemplateManagerModal: React.FC<TemplateManagerModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSaveTemplates,
  currentActiveTemplateId,
  onSelectTemplateForActiveTab,
}) => {
  const [editingTemplate, setEditingTemplate] = useState<PriorityTemplate | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states for creating/editing custom template
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [levels, setLevels] = useState<PriorityLevel[]>([
    {
      id: 'lvl-1',
      name: '紧急且高效',
      color: '#ef4444',
      badgeBg: 'bg-rose-500/15 dark:bg-rose-500/25',
      badgeText: 'text-rose-700 dark:text-rose-300 border-rose-200',
      description: '最高优先级',
      icon: '🔥',
    },
    {
      id: 'lvl-2',
      name: '常规推进',
      color: '#3b82f6',
      badgeBg: 'bg-blue-500/15 dark:bg-blue-500/25',
      badgeText: 'text-blue-700 dark:text-blue-300 border-blue-200',
      description: '次优先级',
      icon: '📌',
    },
  ]);

  if (!isOpen) return null;

  const startCreateNew = () => {
    setIsCreatingNew(true);
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateDesc('');
    setLevels([
      {
        id: `lvl-${Date.now()}-1`,
        name: '优先级 A',
        color: '#ef4444',
        badgeBg: 'bg-rose-500/15 dark:bg-rose-500/25',
        badgeText: 'text-rose-700 dark:text-rose-300 border-rose-200',
        description: '需优先处理',
        icon: '🚨',
      },
      {
        id: `lvl-${Date.now()}-2`,
        name: '优先级 B',
        color: '#f59e0b',
        badgeBg: 'bg-amber-500/15 dark:bg-amber-500/25',
        badgeText: 'text-amber-700 dark:text-amber-300 border-amber-200',
        description: '计划处理',
        icon: '⭐',
      },
    ]);
  };

  const startEditTemplate = (tpl: PriorityTemplate) => {
    if (tpl.isBuiltIn) {
      alert('预置内置模板不可编辑，您可以以此为灵感新建自定义模板。');
      return;
    }
    setEditingTemplate(tpl);
    setIsCreatingNew(false);
    setTemplateName(tpl.name);
    setTemplateDesc(tpl.description);
    setLevels([...tpl.levels]);
  };

  const handleAddLevel = () => {
    const preset = COLOR_PRESETS[levels.length % COLOR_PRESETS.length];
    setLevels([
      ...levels,
      {
        id: `lvl-${Date.now()}`,
        name: `优先级 ${String.fromCharCode(65 + levels.length)}`,
        color: preset.hex,
        badgeBg: preset.bg,
        badgeText: preset.text,
        description: '新增等级描述',
        icon: '📌',
      },
    ]);
  };

  const handleUpdateLevel = (id: string, updates: Partial<PriorityLevel>) => {
    setLevels(levels.map((lvl) => (lvl.id === id ? { ...lvl, ...updates } : lvl)));
  };

  const handleRemoveLevel = (id: string) => {
    if (levels.length <= 2) {
      alert('模板至少需要包含 2 个优先级等级');
      return;
    }
    setLevels(levels.filter((lvl) => lvl.id !== id));
  };

  const handleSaveCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    const newTpl: PriorityTemplate = {
      id: editingTemplate ? editingTemplate.id : `custom-template-${Date.now()}`,
      name: templateName.trim(),
      description: templateDesc.trim() || '自定义任务优先级分类',
      isBuiltIn: false,
      levels: levels,
    };

    let updatedList: PriorityTemplate[];
    if (editingTemplate) {
      updatedList = templates.map((t) => (t.id === editingTemplate.id ? newTpl : t));
    } else {
      updatedList = [...templates, newTpl];
    }

    onSaveTemplates(updatedList);
    setIsCreatingNew(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('确定要删除此自定义模板吗？')) {
      const updatedList = templates.filter((t) => t.id !== id);
      onSaveTemplates(updatedList);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-100 dark:border-zinc-800 flex items-center justify-between bg-neutral-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              任务优先级模板管理
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {!isCreatingNew && !editingTemplate ? (
            /* List of existing templates */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    已拥有的模板清单
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    默认支持艾森豪威尔紧急重要矩阵，也支持自由定制等级。
                  </p>
                </div>
                <button
                  onClick={startCreateNew}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建自定义模板</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((tpl) => {
                  const isCurrentActive = tpl.id === currentActiveTemplateId;

                  return (
                    <div
                      key={tpl.id}
                      className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                        isCurrentActive
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-500/30'
                          : 'bg-neutral-50 dark:bg-zinc-800/60 border-neutral-200 dark:border-zinc-700/60 hover:border-neutral-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                              {tpl.name}
                              {tpl.isBuiltIn && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-zinc-700 text-neutral-600 dark:text-neutral-400 font-normal">
                                  预置
                                </span>
                              )}
                            </span>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                              {tpl.description}
                            </p>
                          </div>
                          {isCurrentActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white font-medium flex items-center gap-0.5 shadow-xs whitespace-nowrap">
                              <Check className="w-3 h-3" /> 当前页签采用
                            </span>
                          )}
                        </div>

                        {/* Priority Level badges preview */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {tpl.levels.map((lvl) => (
                            <span
                              key={lvl.id}
                              className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-medium ${lvl.badgeBg} ${lvl.badgeText}`}
                            >
                              <span>{lvl.icon || '📌'}</span>
                              <span>{lvl.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/5 dark:border-white/5">
                        {!isCurrentActive ? (
                          <button
                            onClick={() => onSelectTemplateForActiveTab(tpl.id)}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                          >
                            应用到当前页签
                          </button>
                        ) : (
                          <span className="text-[11px] text-neutral-400">正在应用中</span>
                        )}

                        {!tpl.isBuiltIn && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditTemplate(tpl)}
                              className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                              title="编辑此模板"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(tpl.id)}
                              className="p-1 rounded text-rose-500 hover:text-rose-700"
                              title="删除此模板"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Creating / Editing custom template form */
            <form onSubmit={handleSaveCustomTemplate} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-zinc-800">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {editingTemplate ? '编辑自定义模板' : '创建新的自定义优先级模板'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingTemplate(null);
                  }}
                  className="text-xs text-neutral-500 hover:underline"
                >
                  ← 返回模板列表
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    模板名称
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如：敏捷开发四级、学习打卡等级..."
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    模板简介
                  </label>
                  <input
                    type="text"
                    placeholder="简短描述该分类方式的用途"
                    value={templateDesc}
                    onChange={(e) => setTemplateDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Levels Configurator */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    优先级等级设置 ({levels.length} 个等级)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLevel}
                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> 增加等级
                  </button>
                </div>

                <div className="space-y-2">
                  {levels.map((lvl, index) => (
                    <div
                      key={lvl.id}
                      className="p-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-800/40 flex flex-col md:flex-row items-start md:items-center gap-2"
                    >
                      <div className="flex items-center gap-2 flex-1 w-full">
                        <span className="text-xs text-neutral-400 font-mono w-4">#{index + 1}</span>
                        {/* Emoji icon */}
                        <input
                          type="text"
                          value={lvl.icon || '📌'}
                          onChange={(e) => handleUpdateLevel(lvl.id, { icon: e.target.value })}
                          className="w-8 h-8 text-center text-sm rounded-lg border border-neutral-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                          title="修改图标Emoji"
                        />
                        {/* Name */}
                        <input
                          type="text"
                          required
                          value={lvl.name}
                          onChange={(e) => handleUpdateLevel(lvl.id, { name: e.target.value })}
                          className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-neutral-100"
                          placeholder="等级名称"
                        />
                      </div>

                      {/* Color picker preset */}
                      <div className="flex items-center gap-1.5">
                        {COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() =>
                              handleUpdateLevel(lvl.id, {
                                color: preset.hex,
                                badgeBg: preset.bg,
                                badgeText: preset.text,
                              })
                            }
                            className={`w-5 h-5 rounded-full border-2 transition-transform ${
                              lvl.color === preset.hex ? 'scale-125 ring-2 ring-indigo-500' : 'opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: preset.hex }}
                            title={preset.name}
                          />
                        ))}

                        <button
                          type="button"
                          onClick={() => handleRemoveLevel(lvl.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded ml-2"
                          title="删除等级"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form submit footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingTemplate(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm"
                >
                  保存模板
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
