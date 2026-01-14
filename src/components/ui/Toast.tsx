import React, { useEffect } from 'react';
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo } from 'react-icons/fa6';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

/**
 * Toast 组件
 * 特点：
 * 1. 顶部居中显示
 * 2. 自动消失
 * 3. 图标+文字，语义明确
 * 4. 高对比度配色
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-50 border-green-600 text-green-900",
    error: "bg-red-50 border-alert text-red-900",
    info: "bg-blue-50 border-blue-600 text-blue-900",
  };

  const icons = {
    success: <FaCircleCheck className="text-green-600 text-3xl shrink-0" />,
    error: <FaCircleExclamation className="text-alert text-3xl shrink-0" />,
    info: <FaCircleInfo className="text-blue-600 text-3xl shrink-0" />,
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-[110] flex justify-center pointer-events-none px-4">
      <div className={`
        pointer-events-auto
        flex items-center gap-4
        px-6 py-4
        rounded-2xl
        border-l-8
        shadow-xl
        max-w-md w-full
        animate-in slide-in-from-top duration-300
        ${styles[type]}
      `}>
        {icons[type]}
        <span className="text-elder-base font-bold break-words">
          {message}
        </span>
      </div>
    </div>
  );
};

export default Toast;