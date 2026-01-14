import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { useHeartRateRecords } from '../../hooks/useHeartRateRecords';
import { prepareHeartRateChartData } from '../../utils/chartDataProcessors';

interface HeartRateTrendChartProps {
  days: 7 | 30 | 90;
}

const HeartRateTrendChart: React.FC<HeartRateTrendChartProps> = ({ days }) => {
  const { records } = useHeartRateRecords();
  const data = prepareHeartRateChartData(records, days);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-red-200 rounded-xl shadow-lg">
          <p className="text-elder-base font-bold text-dark">{payload[0].payload.fullDate}</p>
          <p className="text-elder-lg font-bold text-red-500 mt-2">
            心率: {payload[0].value} 次/分
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-elder-base text-gray-400">该时间段暂无数据</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          
          {/* 正常心率范围背景 (60-100) */}
          <ReferenceArea 
            y1={60} 
            y2={100} 
            fill="#10B981" 
            fillOpacity={0.05} 
          />

          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 16, fill: '#6B7280' }} 
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[40, 140]} 
            tick={{ fontSize: 18, fontWeight: 'bold', fill: '#374151' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Line
            type="monotone"
            dataKey="bpm"
            stroke="#F87171" 
            strokeWidth={4}
            dot={{ r: 6, strokeWidth: 0, fill: '#F87171' }}
            activeDot={{ r: 8, strokeWidth: 0, fill: '#DC2626' }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HeartRateTrendChart;