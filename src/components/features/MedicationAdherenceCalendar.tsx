import React from 'react';
import { useMedicationLogs } from '../../hooks/useMedicationLogs';
import { useMedications } from '../../hooks/useMedications';
import { getMonthlyAdherenceData } from '../../utils/chartDataProcessors';

const MedicationAdherenceCalendar: React.FC = () => {
  const { logs } = useMedicationLogs();
  const { medications } = useMedications();
  
  // 生成当月数据
  const today = new Date();
  const monthData = getMonthlyAdherenceData(logs, medications, today);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // 颜色映射逻辑
  const getColorClass = (status: string) => {
    switch (status) {
      case 'perfect': return 'bg-green-500 border-green-600'; // 100%
      case 'medium': return 'bg-yellow-400 border-yellow-500'; // 50-99%
      case 'low': return 'bg-red-400 border-red-500'; // <50%
      case 'future': return 'bg-gray-100 border-gray-200 text-gray-300';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-elder-base font-bold text-gray-500">
          {today.getMonth() + 1}月用药打卡情况
        </span>
        <div className="flex gap-2 text-elder-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div>完成</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded"></div>缺卡</div>
        </div>
      </div>

      {/* 星期表头 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-elder-sm font-bold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-2">
        {monthData.map((day, index) => (
          <div 
            key={index}
            className={`
              aspect-square rounded-xl flex items-center justify-center border-b-4
              ${getColorClass(day.status)}
              ${day.status === 'future' ? '' : 'text-white shadow-sm'}
            `}
          >
            <span className="text-elder-base font-bold">
              {day.dayOfMonth}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationAdherenceCalendar;