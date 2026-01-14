import React from 'react';

interface TimeRangeSelectorProps {
  value: 7 | 30 | 90;
  onChange: (days: 7 | 30 | 90) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const options = [
    { label: '最近7天', value: 7 },
    { label: '最近30天', value: 30 },
    { label: '最近90天', value: 90 },
  ] as const;

  return (
    <div className="flex gap-4">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 
              h-[60px] 
              rounded-xl 
              text-elder-base font-bold 
              transition-all
              border-2
              ${isActive 
                ? 'bg-primary text-white border-primary shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TimeRangeSelector;