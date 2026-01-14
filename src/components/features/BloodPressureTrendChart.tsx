import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { useBloodPressureRecords } from '../../hooks/useBloodPressureRecords';
import { prepareBPChartData } from '../../utils/chartDataProcessors';

interface BloodPressureTrendChartProps {
  days: 7 | 30 | 90;
}

const BloodPressureTrendChart: React.FC<BloodPressureTrendChartProps> = ({ days }) => {
  const { records } = useBloodPressureRecords();
  const data = prepareBPChartData(records, days);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-secondary rounded-xl shadow-lg">
          <p className="text-elder-base font-bold text-dark">{payload[0].payload.fullDate}</p>
          <div className="mt-2 space-y-1">
            <p className="text-elder-lg font-bold text-blue-600">
              高压: {payload[0].payload.systolic}
            </p>
            <p className="text-elder-lg font-bold text-amber-500">
              低压: {payload[0].payload.diastolic}
            </p>
          </div>
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
          
          {/* 警戒线 */}
          <ReferenceLine y={140} stroke="#DC2626" strokeDasharray="3 3" label={{ value: '140', fill: '#DC2626', fontSize: 14 }} />
          <ReferenceLine y={90} stroke="#DC2626" strokeDasharray="3 3" label={{ value: '90', fill: '#DC2626', fontSize: 14 }} />

          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 16, fill: '#6B7280' }} 
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[60, 180]} 
            tick={{ fontSize: 18, fontWeight: 'bold', fill: '#374151' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', fontSize: '20px' }} 
            iconSize={20}
          />
          
          <Line
            name="收缩压 (高压)"
            type="monotone"
            dataKey="systolic"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: 'white' }}
          />
          <Line
            name="舒张压 (低压)"
            type="monotone"
            dataKey="diastolic"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BloodPressureTrendChart;