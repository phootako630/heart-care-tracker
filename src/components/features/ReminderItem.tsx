import React from 'react';
import { FaClock } from 'react-icons/fa6';

interface ReminderItemProps {
  title: string;
  subtitle?: string;
  time?: string;
  frequency?: string;
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

const ReminderItem: React.FC<ReminderItemProps> = ({
  title,
  subtitle,
  time,
  frequency,
  enabled,
  onToggle,
  className = ''
}) => {
  return (
    <div className={`
      flex items-center justify-between 
      p-4 
      bg-white 
      rounded-2xl 
      border-2 
      shadow-sm
      ${enabled ? 'border-primary' : 'border-gray-200'}
      ${className}
    `}>
      {/* 左侧信息 */}
      <div className="flex-1">
        <div className={`text-elder-lg font-bold ${enabled ? 'text-dark' : 'text-gray-400'}`}>
          {title}
        </div>
        {subtitle && (
          <div className="text-elder-sm text-gray-500">
            {subtitle}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <FaClock className={enabled ? 'text-primary' : 'text-gray-300'} size={20} />
          <span className={`text-elder-xl font-bold font-mono ${enabled ? 'text-primary' : 'text-gray-300'}`}>
            {time || frequency}
          </span>
        </div>
      </div>

      {/* 右侧开关按钮 */}
      <button
        onClick={onToggle}
        className={`
          w-[80px] h-[44px] 
          rounded-full 
          relative 
          transition-colors duration-300
          shrink-0 ml-4
          ${enabled ? 'bg-primary' : 'bg-gray-300'}
        `}
        aria-label={enabled ? "关闭提醒" : "开启提醒"}
      >
        <div className={`
          absolute top-1
          w-[36px] h-[36px] 
          bg-white 
          rounded-full 
          shadow-md 
          transition-transform duration-300
          ${enabled ? 'left-[40px]' : 'left-1'}
        `} />
      </button>
    </div>
  );
};

export default ReminderItem;