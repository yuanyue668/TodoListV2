export type WindowOS = 'mac' | 'windows';

export type StickyThemeId = 'classic-yellow' | 'sage-green' | 'pastel-pink' | 'lavender' | 'slate-blue' | 'dark-memo' | 'pure-obsidian';

export interface StickyTheme {
  id: StickyThemeId;
  name: string;
  bgClass: string;
  cardClass: string;
  accentColor: string;
  textColor: string;
  borderClass: string;
  isDark?: boolean;
}

export interface PriorityLevel {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex
  badgeBg: string;
  badgeText: string;
  description?: string;
  icon?: string; // Emoji or Lucide icon name
}

export interface PriorityTemplate {
  id: string;
  name: string;
  description: string;
  isBuiltIn?: boolean;
  levels: PriorityLevel[];
}

export interface TaskFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string; // CSS color string or class name, e.g. '#ef4444'
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string; // ISO string or formatted date
  priorityLevelId: string;
  dueDate?: string; // ISO string date/time
  formatting?: TaskFormatting;
  images?: string[]; // Base64 or object URLs
  note?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface TodoTab {
  id: string;
  title: string;
  icon?: string;
  templateId: string;
  createdAt: string;
}
