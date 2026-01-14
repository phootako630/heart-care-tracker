import React from 'react';

interface CardProps {
  /** 可选的卡片标题 */
  title?: string;
  /** 卡片内容 */
  children: React.ReactNode;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 点击事件（如果卡片本身可交互） */
  onClick?: () => void;
}

/**
 * Card 组件
 * 特点：
 * 1. 清晰的边框（2px 灰色），区分背景
 * 2. 大内边距（24px），防止内容拥挤
 * 3. 标题字体醒目（28px）
 */
export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '',
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white 
        border-2 border-gray-200 
        rounded-[20px] 
        p-6 
        shadow-sm
        ${onClick ? 'active:bg-gray-50 transition-colors' : ''}
        ${className}
      `}
    >
      {title && (
        <h2 className="text-elder-lg font-bold text-dark mb-4 border-b-2 border-gray-100 pb-2">
          {title}
        </h2>
      )}
      <div className="text-elder-base text-dark leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default Card;