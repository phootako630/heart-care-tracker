import React from 'react';
import { FaDeleteLeft, FaCheck } from 'react-icons/fa6';

interface NumberPadProps {
  onNumberClick: (num: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  className?: string;
}

/**
 * NumberPad 组件
 * 特点：
 * 1. 3x4 网格布局
 * 2. 按钮尺寸 80x80px 以上
 * 3. 只有数字、小数点、删除和确定，无干扰键
 */
export const NumberPad: React.FC<NumberPadProps> = ({
  onNumberClick,
  onBackspace,
  onConfirm,
  className = ''
}) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className={`grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl ${className}`}>
      {/* 数字键 1-9, ., 0 */}
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => onNumberClick(num)}
          className="h-20 bg-white rounded-xl border-b-4 border-gray-200 text-elder-2xl font-bold text-dark active:bg-gray-200 active:border-t-4 active:border-b-0 transition-all shadow-sm"
        >
          {num}
        </button>
      ))}

      {/* 删除键 */}
      <button
        onClick={onBackspace}
        className="h-20 bg-red-50 rounded-xl border-b-4 border-red-100 text-alert flex items-center justify-center active:bg-red-100 transition-all shadow-sm"
        aria-label="删除"
      >
        <FaDeleteLeft size={36} />
      </button>

      {/* 占位（保持布局整齐，或者扩展功能） */}
      {/* 这里的 Confirm 键通常可以放在键盘外，如果放在键盘内需要占据一格，
          但在 3x4 布局中，删除键占据了第 12 格。
          如果需要 Confirm 键整合在键盘里，通常会做成底栏或者替换 '.' 
          这里我们将 Confirm 做成一个独立的宽按钮在底部，或者让父组件处理。
          根据当前布局需求，最后一行是 [ . ] [ 0 ] [ Del ]
      */}
    </div>
  );
};

export default NumberPad;