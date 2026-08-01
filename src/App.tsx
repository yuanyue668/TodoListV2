import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  LayoutGrid,
  List,
  Sparkles,
  Inbox,
  Palette,
} from 'lucide-react';

import {
  WindowOS,
  StickyThemeId,
  StickyTheme,
  PriorityTemplate,
  PriorityLevel,
  TaskItem as TaskItemType,
  TodoTab,
  TaskFormatting,
} from './types';

import { STICKY_THEMES, BUILT_IN_TEMPLATES } from './data/defaultTemplates';
import {
  getStoredTemplates,
  saveCustomTemplates,
  getStoredTabs,
  saveStoredTabs,
  getStoredActiveTabId,
  saveStoredActiveTabId,
  getStoredTasks,
  saveStoredTasks,
  getStoredTheme,
  saveStoredTheme,
  getStoredDarkMode,
  saveStoredDarkMode,
  getStoredWindowOS,
  saveStoredWindowOS,
} from './utils/storage';

import { TitleBar } from './components/TitleBar';
import { TabBar } from './components/TabBar';
import { TaskItem } from './components/TaskItem';
import { QuickTaskInput } from './components/QuickTaskInput';
import { TaskEditorModal } from './components/TaskEditorModal';
import { TemplateManagerModal } from './components/TemplateManagerModal';
import { StickyThemeSelector } from './components/StickyThemeSelector';
import { ImagePreviewModal } from './components/ImagePreviewModal';

export default function App() {
  // Application State
  const [windowOs, setWindowOs] = useState<WindowOS>(getStoredWindowOS);
  const [isPinned, setIsPinned] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(getStoredDarkMode);
  const [themeId, setThemeId] = useState<StickyThemeId>(getStoredTheme);

  const [templates, setTemplates] = useState<PriorityTemplate[]>(getStoredTemplates);
  const [tabs, setTabs] = useState<TodoTab[]>(getStoredTabs);
  const [activeTabId, setActiveTabId] = useState<string>(getStoredActiveTabId);
  const [tasks, setTasks] = useState<Record<string, TaskItemType[]>>(getStoredTasks);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'group' | 'list'>('group');

  // Modals
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItemType | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Drag and Drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Current active theme & tab
  const currentTheme = STICKY_THEMES.find((t) => t.id === themeId) || STICKY_THEMES[0];
  const isEffectiveDark = isDark || Boolean(currentTheme.isDark);

  // Sync Dark Mode class on body/html
  useEffect(() => {
    if (isEffectiveDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredDarkMode(isDark);
  }, [isEffectiveDark, isDark]);

  const handleSelectTheme = (newThemeId: StickyThemeId) => {
    setThemeId(newThemeId);
    const selectedTheme = STICKY_THEMES.find((t) => t.id === newThemeId);
    if (selectedTheme?.isDark) {
      setIsDark(true);
    }
  };

  // Persist helpers
  useEffect(() => {
    saveStoredWindowOS(windowOs);
  }, [windowOs]);

  useEffect(() => {
    saveStoredTheme(themeId);
  }, [themeId]);

  useEffect(() => {
    saveCustomTemplates(templates);
  }, [templates]);

  useEffect(() => {
    saveStoredTabs(tabs);
  }, [tabs]);

  useEffect(() => {
    saveStoredActiveTabId(activeTabId);
  }, [activeTabId]);

  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Current active tab
  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const currentTemplate =
    templates.find((tpl) => tpl.id === (currentTab?.templateId || 'eisenhower-matrix')) ||
    templates[0];

  const currentTabTasks = tasks[activeTabId] || [];

  // Filter tasks based on search & completion filter
  const filteredTasks = currentTabTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? !task.completed
        : task.completed;
    return matchesSearch && matchesStatus;
  });

  // Tab management actions
  const handleAddTab = (title: string, templateId: string, icon?: string) => {
    const newTab: TodoTab = {
      id: `tab-${Date.now()}`,
      title,
      icon,
      templateId,
      createdAt: new Date().toISOString(),
    };
    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    setActiveTabId(newTab.id);
  };

  const handleUpdateTab = (tabId: string, title: string, templateId: string) => {
    setTabs(
      tabs.map((t) => (t.id === tabId ? { ...t, title, templateId } : t))
    );
  };

  const handleDeleteTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[0].id);
    }
  };

  // Task actions
  const handleToggleComplete = (id: string) => {
    setTasks((prev) => {
      const tabList = prev[activeTabId] || [];
      const updated = tabList.map((task) => {
        if (task.id === id) {
          const isNowCompleted = !task.completed;
          const nowFormatted = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
          return {
            ...task,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? nowFormatted : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });
      return { ...prev, [activeTabId]: updated };
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => ({
      ...prev,
      [activeTabId]: (prev[activeTabId] || []).filter((t) => t.id !== id),
    }));
  };

  const handleQuickAddTask = (title: string, priorityLevelId: string) => {
    const newTask: TaskItemType = {
      id: `task-${Date.now()}`,
      title,
      completed: false,
      priorityLevelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: currentTabTasks.length + 1,
    };

    setTasks((prev) => ({
      ...prev,
      [activeTabId]: [newTask, ...(prev[activeTabId] || [])],
    }));
  };

  const handleSaveTask = (
    title: string,
    priorityLevelId: string,
    dueDate?: string,
    formatting?: TaskFormatting,
    images?: string[],
    taskId?: string
  ) => {
    setTasks((prev) => {
      const tabList = prev[activeTabId] || [];
      if (taskId) {
        // Edit existing
        const updated = tabList.map((t) =>
          t.id === taskId
            ? {
                ...t,
                title,
                priorityLevelId,
                dueDate,
                formatting,
                images,
                updatedAt: new Date().toISOString(),
              }
            : t
        );
        return { ...prev, [activeTabId]: updated };
      } else {
        // Create new
        const newTask: TaskItemType = {
          id: `task-${Date.now()}`,
          title,
          completed: false,
          priorityLevelId,
          dueDate,
          formatting,
          images,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: tabList.length + 1,
        };
        return { ...prev, [activeTabId]: [newTask, ...tabList] };
      }
    });
  };

  const handleChangeTaskPriority = (taskId: string, newLevelId: string) => {
    setTasks((prev) => {
      const tabList = prev[activeTabId] || [];
      const updated = tabList.map((t) =>
        t.id === taskId ? { ...t, priorityLevelId: newLevelId, updatedAt: new Date().toISOString() } : t
      );
      return { ...prev, [activeTabId]: updated };
    });
  };

  // Drag and Drop reordering logic
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDropOnTask = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetTaskId) return;

    setTasks((prev) => {
      const list = [...(prev[activeTabId] || [])];
      const draggedIndex = list.findIndex((t) => t.id === draggedTaskId);
      const targetIndex = list.findIndex((t) => t.id === targetTaskId);

      if (draggedIndex < 0 || targetIndex < 0) return prev;

      const [removed] = list.splice(draggedIndex, 1);
      list.splice(targetIndex, 0, removed);

      return { ...prev, [activeTabId]: list };
    });

    setDraggedTaskId(null);
  };

  return (
    <div
      className={`min-h-screen p-2 sm:p-4 md:p-8 flex items-center justify-center font-sans antialiased transition-colors duration-300 ${
        isEffectiveDark ? 'bg-zinc-950 text-zinc-100' : 'bg-neutral-200 text-neutral-900'
      }`}
    >
      {/* Sticky Note Application Window Container */}
      <div
        className={`w-full max-w-4xl min-h-[640px] max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          currentTheme.bgClass
        } ${currentTheme.borderClass} ${
          isPinned ? 'ring-2 ring-amber-500/80 shadow-amber-500/10' : ''
        }`}
      >
        {/* Title Bar (Mac OS / Windows UI Switcher, Pin, Theme, Templates, Dark mode) */}
        <TitleBar
          os={windowOs}
          setOs={setWindowOs}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
          isDark={isDark}
          toggleDarkMode={() => setIsDark(!isDark)}
          currentTheme={currentTheme}
          onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
          onOpenTemplateManager={() => setIsTemplateManagerOpen(true)}
        />

        {/* Tab Bar (Multiple Todo Lists / Tabs) */}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onAddTab={handleAddTab}
          onUpdateTab={handleUpdateTab}
          onDeleteTab={handleDeleteTab}
          templates={templates}
        />

        {/* Toolbar & Filter Bar */}
        <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex flex-wrap items-center justify-between gap-3">
          {/* Active Tab Info */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>{currentTab?.icon || '📌'}</span>
              <span>{currentTab?.title}</span>
            </span>
          </div>

          {/* Search, Filter & Quadrant View toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-300 pointer-events-none" />
              <input
                type="text"
                placeholder="搜索任务..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-500 w-28 sm:w-36 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-400"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/10 text-[11px] font-medium">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-black/10 dark:bg-white/20 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-black/10 dark:bg-white/20 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100'
                }`}
              >
                进行中
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-black/10 dark:bg-white/20 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100'
                }`}
              >
                已完成
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/10 text-[11px]">
              <button
                onClick={() => setViewMode('group')}
                className={`p-1 rounded-lg transition-colors ${
                  viewMode === 'group'
                    ? 'bg-black/10 dark:bg-white/20 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-neutral-400 dark:text-neutral-300'
                }`}
                title="按优先级分组排列"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-black/10 dark:bg-white/20 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-neutral-400 dark:text-neutral-300'
                }`}
                title="单列紧凑列表"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Task Input Bar */}
        <div className="px-4 py-3">
          <QuickTaskInput
            priorityLevels={currentTemplate.levels}
            onQuickAdd={handleQuickAddTask}
            onOpenRichEditor={() => {
              setTaskToEdit(null);
              setIsTaskEditorOpen(true);
            }}
          />
        </div>

        {/* Task List / Quadrant Matrix Container */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-5 no-scrollbar">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 text-neutral-400 dark:text-neutral-500">
              <Inbox className="w-10 h-10 stroke-1 opacity-60 text-amber-500" />
              <div className="space-y-1">
                <p className="text-xs font-semibold">暂无待办事项</p>
                <p className="text-[11px] text-neutral-400">
                  上方输入框直接 Enter 快速记下你的第一条灵感吧！
                </p>
              </div>
            </div>
          ) : viewMode === 'group' ? (
            /* Quadrant / Grouped View based on template levels */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTemplate.levels.map((level) => {
                const levelTasks = filteredTasks.filter(
                  (t) => t.priorityLevelId === level.id
                );

                return (
                  <div
                    key={level.id}
                    className="p-3.5 rounded-2xl bg-black/5 dark:bg-zinc-900/70 border border-black/5 dark:border-zinc-800/80 space-y-2.5 flex flex-col"
                  >
                    {/* Quadrant Header */}
                    <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{level.icon || '📌'}</span>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-800 dark:text-zinc-100">
                            {level.name}
                          </h4>
                          {level.description && (
                            <p className="text-[10px] text-neutral-500 dark:text-zinc-300">
                              {level.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-200 font-mono">
                        {levelTasks.length} 项
                      </span>
                    </div>

                    {/* Task list in quadrant */}
                    <div className="space-y-2 flex-1">
                      {levelTasks.length > 0 ? (
                        levelTasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            priorityLevel={level}
                            allPriorityLevels={currentTemplate.levels}
                            onToggleComplete={handleToggleComplete}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={(t) => {
                              setTaskToEdit(t);
                              setIsTaskEditorOpen(true);
                            }}
                            onChangePriority={handleChangeTaskPriority}
                            onPreviewImage={(url) => setPreviewImageUrl(url)}
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropOnTask(e, task.id)}
                          />
                        ))
                      ) : (
                        <div className="p-4 border border-dashed border-black/10 dark:border-white/10 rounded-xl text-center">
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                            该分类暂无任务
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Flat List View */
            <div className="space-y-2">
              {filteredTasks.map((task) => {
                const level = currentTemplate.levels.find(
                  (l) => l.id === task.priorityLevelId
                );
                return (
                  <TaskItem
                    key={task.id}
                    task={task}
                    priorityLevel={level}
                    allPriorityLevels={currentTemplate.levels}
                    onToggleComplete={handleToggleComplete}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={(t) => {
                      setTaskToEdit(t);
                      setIsTaskEditorOpen(true);
                    }}
                    onChangePriority={handleChangeTaskPriority}
                    onPreviewImage={(url) => setPreviewImageUrl(url)}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropOnTask(e, task.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Status Bar */}
        <div className="px-4 py-2 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              已完成:{' '}
              <strong className="text-amber-600 dark:text-amber-400">
                {currentTabTasks.filter((t) => t.completed).length}
              </strong>{' '}
              / {currentTabTasks.length}
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">支持 Windows / Mac OS 便签挂载</span>
          </div>

          <button
            onClick={() => setIsTemplateManagerOpen(true)}
            className="hover:underline text-indigo-600 dark:text-indigo-400 font-medium"
          >
            设置优先级分类模板 →
          </button>
        </div>
      </div>

      {/* Modals */}
      <TaskEditorModal
        isOpen={isTaskEditorOpen}
        onClose={() => {
          setIsTaskEditorOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        priorityLevels={currentTemplate.levels}
        onSaveTask={handleSaveTask}
      />

      <TemplateManagerModal
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
        templates={templates}
        onSaveTemplates={setTemplates}
        currentActiveTemplateId={currentTemplate.id}
        onSelectTemplateForActiveTab={(templateId) => {
          handleUpdateTab(currentTab.id, currentTab.title, templateId);
          setIsTemplateManagerOpen(false);
        }}
      />

      <StickyThemeSelector
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
        currentThemeId={themeId}
        onSelectTheme={handleSelectTheme}
      />

      <ImagePreviewModal
        imageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
      />
    </div>
  );
}
