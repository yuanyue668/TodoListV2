import React from 'react';
import { Smile, X } from 'lucide-react';

interface EmojiPickerPopoverProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = [
  {
    name: '常用/标记',
    list: ['📌', '🚨', '🌟', '⚡', '☕', '🔥', '⭐', '💡', '📝', '🎯', '🚀', '⏰', '🎉', '✅', '❌', '❤️'],
  },
  {
    name: '工作/学习',
    list: ['💻', '📚', '✉️', '📊', '📈', '🖊️', '📁', '🎓', '🔬', '⚙️', '💬', '📞', '🛠️', '🔑', '🎨', '💼'],
  },
  {
    name: '生活/健康',
    list: ['🏋️‍♂️', '🏃‍♂️', '🥗', '🍎', '🍕', '☕', '💧', '💊', '🧘‍♀️', '🛒', '🚲', '✈️', '🐶', '🌿', '☀️', '🌙'],
  },
  {
    name: '情绪/符号',
    list: ['😀', '😎', '🤔', '💪', '👍', '🙌', '👀', '💯', '🌈', '✨', '🎁', '🔔', '🏷️', '📍', '💰', '🏆'],
  },
];

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({ onSelectEmoji, onClose }) => {
  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-3 shadow-2xl w-64 text-xs space-y-3">
      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100 dark:border-zinc-800">
        <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
          <Smile className="w-3.5 h-3.5 text-amber-500" /> 选择 Emoji 表情
        </span>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
        {EMOJI_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 mb-1 block">
              {cat.name}
            </span>
            <div className="grid grid-cols-6 gap-1">
              {cat.list.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onSelectEmoji(emoji);
                    onClose();
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 flex items-center justify-center text-base transition-transform hover:scale-110 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
