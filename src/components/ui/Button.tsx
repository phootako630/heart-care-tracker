import React from 'react';

interface ButtonProps {
  /** 按钮变体：主要操作、次要操作、危险操作 */
  variant: 'primary' | 'secondary' | 'danger';
  /** 尺寸：普通(70px) 或 大(80px) */
  size?: 'normal' | 'large';
  /** 按钮内容 */
  children: React.ReactNode;
  /** 点击事件 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否占满整行 */
  fullWidth?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * Button 组件
 * 特点：
 * 1. 最小高度 70px，确保极易点击
 * 2. 字体加粗，大小 24px+
 * 3. 点击时有明显的颜色变化反馈
 * 4. 大圆角设计，视觉柔和
 */
export const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'normal',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  // 基础样式
  const baseStyles = "flex items-center justify-center font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-2xl select-none";
  
  // 尺寸样式
  const sizeStyles = size === 'large' 
    ? "h-[80px] text-elder-xl" // 80px 高度, 32px 字体
    : "h-[70px] text-elder-lg"; // 70px 高度, 28px 字体

  // 变体样式配置
  const variantStyles = {
    primary: "bg-primary text-white shadow-lg shadow-teal-900/20 hover:bg-[#005a63] active:bg-[#00484f]",
    secondary: "bg-white text-primary border-4 border-primary hover:bg-teal-50 active:bg-teal-100",
    danger: "bg-alert text-white shadow-lg shadow-red-900/20 hover:bg-[#b91c1c] active:bg-[#991b1b]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : 'w-auto px-8'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;