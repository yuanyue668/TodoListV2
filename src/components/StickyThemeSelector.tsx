import React from 'react';
import { Palette, Check, X } from 'lucide-react';
import { STICKY_THEMES } from '../data/defaultTemplates';
import { StickyTheme, StickyThemeId } from '../types';

interface StickyThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: StickyThemeId;
  onSelectTheme: (themeId: StickyThemeId) => void;
}

export const StickyThemeSelector: React.FC<StickyThemeSelectorProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-500" />
            <span>便签纸张皮肤与外观</span>
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {STICKY_THEMES.map((theme) => {
            const isSelected = theme.id === currentThemeId;

            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  theme.cardClass
                } ${
                  isSelected
                    ? 'ring-2 ring-amber-500 border-amber-500 scale-[1.02]'
                    : 'hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {theme.name}
                  </span>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
