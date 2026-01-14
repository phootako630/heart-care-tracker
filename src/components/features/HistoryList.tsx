import React from 'react';
import { format, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FaHeartPulse, FaDroplet, FaHeart } from 'react-icons/fa6';
import { INRRecord, BloodPressureRecord, HeartRateRecord } from '../../types';

interface HistoryListProps {
  inrRecords: INRRecord[];
  bpRecords: BloodPressureRecord[];
  hrRecords: HeartRateRecord[];
}

type HistoryItem = {
  type: 'INR' | 'BP' | 'HR';
  id: string;
  date: Date;
  title: string;
  value: string;
  status?: 'normal' | 'warning' | 'danger';
  icon: React.ReactNode;
};

const HistoryList: React.FC<HistoryListProps> = ({ inrRecords, bpRecords, hrRecords }) => {
  // 1. 合并并标准化所有数据
  const allItems: HistoryItem[] = [
    ...inrRecords.map((r): HistoryItem => ({
      type: 'INR',
      id: r.id,
      date: r.recordTime,
      title: '抗凝指标 (INR)',
      value: r.value.toFixed(2),
      status: r.isInRange ? 'normal' : 'danger',
      icon: <FaDroplet className="text-blue-500" />
    })),
    ...bpRecords.map((r): HistoryItem => ({
      type: 'BP',
      id: r.id,
      date: r.recordTime,
      title: '血压',
      value: `${r.systolic}/${r.diastolic} mmHg`,
      status: (r.systolic >= 140 || r.diastolic >= 90) ? 'warning' : 'normal',
      icon: <FaHeart className="text-red-500" />
    })),
    ...hrRecords.map((r): HistoryItem => ({
      type: 'HR',
      id: r.id,
      date: r.recordTime,
      title: '静息心率',
      value: `${r.bpm} 次/分`,
      status: r.status === 'normal' ? 'normal' : 'warning',
      icon: <FaHeartPulse className="text-pink-500" />
    }))
  ];

  // 2. 按时间倒序排序
  allItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  // 3. 按日期分组
  const groups: { date: Date; items: HistoryItem[] }[] = [];
  allItems.forEach(item => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && isSameDay(lastGroup.date, item.date)) {
      lastGroup.items.push(item);
    } else {
      groups.push({ date: item.date, items: [item] });
    }
  });

  if (groups.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-elder-base">
        暂无历史记录
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {/* 日期标题 */}
          <div className="sticky top-0 bg-gray-50 py-2 mb-2 z-10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <h3 className="text-elder-base font-bold text-gray-500">
              {format(group.date, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </h3>
          </div>

          {/* 当日记录列表 */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
            {group.items.map((item, index) => (
              <div 
                key={item.id}
                className={`
                  flex items-center justify-between p-4 
                  ${index !== group.items.length - 1 ? 'border-b border-gray-100' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl bg-gray-50 p-2 rounded-full">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-elder-sm text-gray-500">{item.title}</div>
                    <div className="text-elder-sm text-gray-400">
                      {format(item.date, 'HH:mm')}
                    </div>
                  </div>
                </div>
                
                <div className={`
                  text-elder-lg font-bold font-mono
                  ${item.status === 'danger' ? 'text-alert' : ''}
                  ${item.status === 'warning' ? 'text-yellow-600' : ''}
                  ${item.status === 'normal' ? 'text-dark' : ''}
                `}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;