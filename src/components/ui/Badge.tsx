import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

/**
 * Badge 组件
 * 特点：
 * 1. 字体清晰 (18px 加粗)
 * 2. 颜色具有明确语义
 * 3. 胶囊形状
 */
export const Badge: React.FC<BadgeProps> = ({ 
  variant, 
  children,
  className = '' 
}) => {
  const styles = {
    success: "bg-green-100 text-green-800 border-2 border-green-600",
    warning: "bg-yellow-100 text-yellow-800 border-2 border-yellow-600",
    danger: "bg-red-100 text-red-800 border-2 border-alert",
    info: "bg-blue-100 text-blue-800 border-2 border-blue-600",
  };

  return (
    <span className={`
      inline-flex items-center justify-center
      px-4 py-1.5
      rounded-full
      text-elder-xs font-bold
      ${styles[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;