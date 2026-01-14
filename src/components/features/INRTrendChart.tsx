import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import { useINRRecords } from '../../hooks/useINRRecords';
import { prepareINRChartData } from '../../utils/chartDataProcessors';

interface INRTrendChartProps {
  days: 7 | 30 | 90;
}

const INRTrendChart: React.FC<INRTrendChartProps> = ({ days }) => {
  const { records } = useINRRecords();
  const data = prepareINRChartData(records, days);

  // 自定义 Tooltip 内容
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-primary rounded-xl shadow-lg">
          <p className="text-elder-base font-bold text-dark">{payload[0].payload.fullDate}</p>
          <p className="text-elder-lg font-bold text-primary mt-2">
            INR: {payload[0].value.toFixed(2)}
          </p>
          <p className="text-elder-sm text-gray-500">
            {payload[0].payload.isInRange ? '✅ 正常' : '⚠️ 异常'}
          </p>
        </div>
      );
    }
    return null;
  };

  // 自定义数据点：异常显示红色
  const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isAbnormal = !payload.isInRange;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={6} 
        stroke={isAbnormal ? "#D62828" : "#2563EB"} 
        strokeWidth={3} 
        fill="white" 
      />
    );
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
          
          {/* 目标范围背景 (2.0 - 3.0) */}
          <ReferenceArea 
            y1={2.0} 
            y2={3.0} 
            fill="#10B981" 
            fillOpacity={0.1} 
          />
          <ReferenceLine y={2.0} stroke="#10B981" strokeDasharray="5 5" label={{ value: '2.0', fill: '#10B981', fontSize: 16, position: 'insideLeft' }} />
          <ReferenceLine y={3.0} stroke="#10B981" strokeDasharray="5 5" label={{ value: '3.0', fill: '#10B981', fontSize: 16, position: 'insideLeft' }} />

          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 16, fill: '#6B7280' }} 
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[1, 4]} 
            tick={{ fontSize: 18, fontWeight: 'bold', fill: '#374151' }}
            tickCount={5}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563EB"
            strokeWidth={4}
            dot={<CustomizedDot />}
            activeDot={{ r: 8, strokeWidth: 0, fill: '#2563EB' }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default INRTrendChart;