import { PriorityTemplate, TodoTab, TaskItem, StickyThemeId, WindowOS } from '../types';
import { BUILT_IN_TEMPLATES, INITIAL_TABS, INITIAL_TASKS } from '../data/defaultTemplates';

const KEYS = {
  TEMPLATES: 'sticky_todo_templates',
  TABS: 'sticky_todo_tabs',
  ACTIVE_TAB: 'sticky_todo_active_tab',
  TASKS: 'sticky_todo_tasks',
  THEME: 'sticky_todo_theme',
  DARK_MODE: 'sticky_todo_dark_mode',
  WINDOW_OS: 'sticky_todo_window_os',
};

export const getStoredTemplates = (): PriorityTemplate[] => {
  try {
    const raw = localStorage.getItem(KEYS.TEMPLATES);
    if (!raw) return BUILT_IN_TEMPLATES;
    const custom: PriorityTemplate[] = JSON.parse(raw);
    // Ensure built-in templates are always present & up-to-date
    const builtInIds = new Set(BUILT_IN_TEMPLATES.map((t) => t.id));
    const customOnly = custom.filter((t) => !builtInIds.has(t.id));
    return [...BUILT_IN_TEMPLATES, ...customOnly];
  } catch (e) {
    console.error('Failed to parse templates from storage', e);
    return BUILT_IN_TEMPLATES;
  }
};

export const saveCustomTemplates = (templates: PriorityTemplate[]) => {
  try {
    const customOnly = templates.filter((t) => !t.isBuiltIn);
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(customOnly));
  } catch (e) {
    console.error('Failed to save templates', e);
  }
};

export const getStoredTabs = (): TodoTab[] => {
  try {
    const raw = localStorage.getItem(KEYS.TABS);
    return raw ? JSON.parse(raw) : INITIAL_TABS;
  } catch (e) {
    return INITIAL_TABS;
  }
};

export const saveStoredTabs = (tabs: TodoTab[]) => {
  localStorage.setItem(KEYS.TABS, JSON.stringify(tabs));
};

export const getStoredActiveTabId = (): string => {
  return localStorage.getItem(KEYS.ACTIVE_TAB) || INITIAL_TABS[0]?.id || '';
};

export const saveStoredActiveTabId = (tabId: string) => {
  localStorage.setItem(KEYS.ACTIVE_TAB, tabId);
};

export const getStoredTasks = (): Record<string, TaskItem[]> => {
  try {
    const raw = localStorage.getItem(KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  } catch (e) {
    return INITIAL_TASKS;
  }
};

export const saveStoredTasks = (tasks: Record<string, TaskItem[]>) => {
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

export const getStoredTheme = (): StickyThemeId => {
  return (localStorage.getItem(KEYS.THEME) as StickyThemeId) || 'classic-yellow';
};

export const saveStoredTheme = (themeId: StickyThemeId) => {
  localStorage.setItem(KEYS.THEME, themeId);
};

export const getStoredDarkMode = (): boolean => {
  const raw = localStorage.getItem(KEYS.DARK_MODE);
  if (raw !== null) return raw === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const saveStoredDarkMode = (isDark: boolean) => {
  localStorage.setItem(KEYS.DARK_MODE, isDark ? 'true' : 'false');
};

export const getStoredWindowOS = (): WindowOS => {
  const raw = localStorage.getItem(KEYS.WINDOW_OS) as WindowOS;
  if (raw) return raw;
  const isMac = navigator.userAgent.toLowerCase().includes('mac');
  return isMac ? 'mac' : 'windows';
};

export const saveStoredWindowOS = (os: WindowOS) => {
  localStorage.setItem(KEYS.WINDOW_OS, os);
};
