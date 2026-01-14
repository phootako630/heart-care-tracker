import React from 'react';

interface InputProps {
  type: 'text' | 'number' | 'tel' | 'date' | 'time';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  /** 单位后缀，如 mg, mmHg */
  unit?: string;
  className?: string;
  readOnly?: boolean;
  onClick?: () => void;
}

/**
 * Input 组件
 * 特点：
 * 1. 输入框高度 80px
 * 2. 输入文字 32px (elder-xl)
 * 3. 边框加粗 (4px)，聚焦时变色明显
 * 4. 标签和错误提示清晰可见
 */
export const Input: React.FC<InputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  label,
  error,
  unit,
  className = '',
  readOnly = false,
  onClick,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* 标签 */}
      {label && (
        <label className="text-elder-sm font-bold text-dark ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          onClick={onClick}
          className={`
            w-full 
            h-[80px] 
            px-4 
            rounded-2xl 
            bg-white 
            text-elder-xl text-dark font-medium
            border-4 
            transition-colors
            outline-none
            placeholder:text-gray-300
            ${error 
              ? 'border-alert focus:border-alert' 
              : 'border-gray-300 focus:border-primary'
            }
            ${readOnly ? 'bg-gray-50' : ''}
            ${unit ? 'pr-20' : ''} 
          `}
        />
        
        {/* 单位显示 */}
        {unit && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-elder-lg text-gray-500 font-bold pointer-events-none">
            {unit}
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-elder-sm text-alert font-bold ml-1 flex items-center">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default Input;