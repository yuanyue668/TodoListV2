import React from 'react';
import { X, Download } from 'lucide-react';

interface ImagePreviewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <a
            href={imageUrl}
            download="todo-image.png"
            className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
            title="下载图片"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
            title="关闭预览"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <img
          src={imageUrl}
          alt="Task attachment"
          className="max-w-full max-h-[82vh] object-contain rounded-xl"
        />
      </div>
    </div>
  );
};
