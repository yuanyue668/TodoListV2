import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Palette,
  Smile,
  Image as ImageIcon,
  Calendar,
  X,
  Plus,
  Check,
  Upload,
} from 'lucide-react';
import { TaskItem, PriorityLevel, TaskFormatting } from '../types';
import { EmojiPickerPopover } from './EmojiPickerPopover';

interface TaskEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TaskItem | null;
  priorityLevels: PriorityLevel[];
  onSaveTask: (
    title: string,
    priorityLevelId: string,
    dueDate?: string,
    formatting?: TaskFormatting,
    images?: string[],
    taskId?: string
  ) => void;
}

const TEXT_COLOR_PRESETS = [
  { name: '默认', value: '' },
  { name: '警示红', value: '#ef4444' },
  { name: '活力橙', value: '#f97316' },
  { name: '琥珀黄', value: '#d97706' },
  { name: '森林绿', value: '#10b981' },
  { name: '海洋蓝', value: '#0284c7' },
  { name: '优雅紫', value: '#9333ea' },
];

export const TaskEditorModal: React.FC<TaskEditorModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  priorityLevels,
  onSaveTask,
}) => {
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [priorityLevelId, setPriorityLevelId] = useState(
    taskToEdit?.priorityLevelId || priorityLevels[0]?.id || ''
  );
  const [dueDate, setDueDate] = useState(
    taskToEdit?.dueDate ? new Date(taskToEdit.dueDate).toISOString().slice(0, 16) : ''
  );

  // Formatting state
  const [formatting, setFormatting] = useState<TaskFormatting>(
    taskToEdit?.formatting || { bold: false, italic: false, underline: false, color: '' }
  );

  // Attached images (Base64)
  const [images, setImages] = useState<string[]>(taskToEdit?.images || []);

  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleToggleFormat = (type: 'bold' | 'italic' | 'underline') => {
    setFormatting((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSelectColor = (color: string) => {
    setFormatting((prev) => ({ ...prev, color }));
  };

  const handleInsertEmoji = (emoji: string) => {
    setTitle((prev) => prev + ' ' + emoji);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask(
      title.trim(),
      priorityLevelId,
      dueDate ? new Date(dueDate).toISOString() : undefined,
      formatting,
      images,
      taskToEdit?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-5 w-full max-w-lg shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {taskToEdit ? '编辑待办任务' : '添加新待办任务'}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Title Input with Text Preview */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              任务描述
            </label>
            <textarea
              required
              rows={3}
              placeholder="输入任务内容，支持格式效果和 Emoji..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                fontWeight: formatting.bold ? '700' : '400',
                fontStyle: formatting.italic ? 'italic' : 'normal',
                textDecoration: formatting.underline ? 'underline' : 'none',
                color: formatting.color || undefined,
              }}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
            />
          </div>

          {/* Text Formatting Toolbar (加粗、斜体、下划线、文字颜色、Emoji) */}
          <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-zinc-800/60 border border-neutral-200/60 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-2 relative">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleToggleFormat('bold')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  formatting.bold
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="加粗"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleToggleFormat('italic')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  formatting.italic
                    ? 'bg-amber-500 text-white italic'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="斜体"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleToggleFormat('underline')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  formatting.underline
                    ? 'bg-amber-500 text-white underline'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="下划线"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              {/* Color Presets */}
              <div className="h-4 w-px bg-neutral-300 dark:bg-zinc-700 mx-1" />

              <div className="flex items-center gap-1">
                {TEXT_COLOR_PRESETS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleSelectColor(color.value)}
                    className={`w-4 h-4 rounded-full border border-black/10 transition-transform ${
                      formatting.color === color.value ? 'scale-125 ring-2 ring-amber-500' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.value || '#9ca3af' }}
                    title={`文字颜色: ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Emoji and Upload Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 rounded-lg text-xs text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                title="插入 Emoji 表情"
              >
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px]">Emoji</span>
              </button>

              {showEmojiPicker && (
                <EmojiPickerPopover
                  onSelectEmoji={handleInsertEmoji}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>
          </div>

          {/* Priority Level Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              任务优先级
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityLevels.map((lvl) => {
                const isSelected = lvl.id === priorityLevelId;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setPriorityLevelId(lvl.id)}
                    className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-2 text-left transition-all ${
                      isSelected
                        ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                        : 'border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-800/40 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-sm">{lvl.icon || '📌'}</span>
                    <div className="truncate">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">{lvl.name}</div>
                      {lvl.description && (
                        <div className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
                          {lvl.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date & Time Picker */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>设置完成时间 / 截止日期</span>
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Image Attachments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>任务图片附件</span>
              </label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <Upload className="w-3 h-3" /> 上传图片
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {images.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-neutral-200 dark:border-zinc-700 group">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-3 border border-dashed border-neutral-300 dark:border-zinc-700 rounded-xl text-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  点击或拖拽选择图片添加为任务附件
                </p>
              </div>
            )}
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
            >
              取消
            </button>
            <button
              type="submit"
              className="text-xs px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors shadow-sm"
            >
              保存任务
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
