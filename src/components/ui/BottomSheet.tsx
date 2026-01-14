import React, { useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * BottomSheet 组件
 * 特点：
 * 1. 半屏/全屏模态框，从底部滑出
 * 2. 背景遮罩变暗，聚焦注意力
 * 3. 超大关闭按钮 (60px)
 * 4. 标题居中显眼
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 如果未打开且没有动画需求（这里简化处理，直接渲染/不渲染）
  // 实际生产中建议结合 CSS Transition Group 实现离场动画
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* 内容面板 */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <h2 className="text-elder-lg font-bold text-dark ml-2">{title}</h2>
          <button 
            onClick={onClose}
            className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200"
            aria-label="关闭"
          >
            <FaXmark size={32} />
          </button>
        </div>

        {/* 滚动内容区域 */}
        <div className="p-6 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;