import React from 'react';
import { Pin, Moon, Sun, Monitor, Palette, LayoutGrid, X, Minus, Square, Copy } from 'lucide-react';
import { WindowOS, StickyTheme } from '../types';

interface TitleBarProps {
  os: WindowOS;
  setOs: (os: WindowOS) => void;
  isPinned: boolean;
  setIsPinned: React.Dispatch<React.SetStateAction<boolean>>;
  isDark: boolean;
  toggleDarkMode: () => void;
  currentTheme: StickyTheme;
  onOpenThemeSelector: () => void;
  onOpenTemplateManager: () => void;
  appName?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  os,
  setOs,
  isPinned,
  setIsPinned,
  isDark,
  toggleDarkMode,
  currentTheme,
  onOpenThemeSelector,
  onOpenTemplateManager,
  appName = 'Sticky Note Todo',
}) => {
  return (
    <div className="select-none flex items-center justify-between px-3 py-2 border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-t-2xl transition-colors">
      {/* Left side: Window controls based on OS choice */}
      <div className="flex items-center space-x-2">
        {os === 'mac' ? (
          <div className="flex items-center space-x-2 group pr-2">
            <button
              title="关闭便签"
              className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center text-[8px] text-rose-950 font-bold opacity-90 group-hover:opacity-100 shadow-sm"
            >
              <X className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              title="最小化"
              className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center text-[8px] text-amber-950 font-bold opacity-90 group-hover:opacity-100 shadow-sm"
            >
              <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              title="最大化/全屏"
              className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center text-[8px] text-emerald-950 font-bold opacity-90 group-hover:opacity-100 shadow-sm"
            >
              <Copy className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500/80" />
            <span className="text-xs font-semibold tracking-tight text-neutral-600 dark:text-neutral-400">
              Win 窗口
            </span>
          </div>
        )}

        {/* Title & OS Toggle */}
        <div className="flex items-center space-x-2 border-l border-black/10 dark:border-white/10 pl-3">
          <span className="text-xs font-bold tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
            <span className="text-sm">📌</span>
            <span>桌面便签</span>
          </span>

          <button
            onClick={() => setOs(os === 'mac' ? 'windows' : 'mac')}
            className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-600 dark:text-neutral-300 transition-all flex items-center gap-1"
            title={`切换窗口样式 (当前: ${os === 'mac' ? 'Mac OS' : 'Windows'})`}
          >
            <Monitor className="w-3 h-3" />
            <span className="font-mono uppercase">{os}</span>
          </button>
        </div>
      </div>

      {/* Right side: Actions (Pin, Theme, Templates, Dark mode, Win controls if Windows) */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => setIsPinned(!isPinned)}
          className={`p-1.5 rounded-lg transition-all text-xs flex items-center gap-1 ${
            isPinned
              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium'
              : 'text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title={isPinned ? '取消窗口置顶' : '置顶便签窗口'}
        >
          <Pin className={`w-3.5 h-3.5 transition-transform ${isPinned ? 'rotate-45 fill-current' : ''}`} />
          <span className="hidden sm:inline text-[11px]">{isPinned ? '已置顶' : '置顶'}</span>
        </button>

        <button
          onClick={onOpenTemplateManager}
          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
          title="优先级模板管理"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline text-[11px] font-medium">模板管理</span>
        </button>

        <button
          onClick={onOpenThemeSelector}
          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
          title="便签皮肤与配色"
        >
          <Palette className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline text-[11px] font-medium">皮肤</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title={isDark ? '切换浅色便签' : '切换夜间/深色模式'}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
        </button>

        {/* Windows Right Window Buttons */}
        {os === 'windows' && (
          <div className="flex items-center space-x-0.5 ml-1 pl-1 border-l border-black/10 dark:border-white/10">
            <button className="p-1 text-neutral-500 hover:bg-black/10 dark:hover:bg-white/10 rounded">
              <Minus className="w-3 h-3" />
            </button>
            <button className="p-1 text-neutral-500 hover:bg-black/10 dark:hover:bg-white/10 rounded">
              <Square className="w-2.5 h-2.5" />
            </button>
            <button className="p-1 text-neutral-500 hover:bg-rose-500 hover:text-white rounded transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
