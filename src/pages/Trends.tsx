import React, { useState } from 'react';
import Card from '../components/ui/Card';
import TimeRangeSelector from '../components/features/TimeRangeSelector';
import INRTrendChart from '../components/features/INRTrendChart';
import BloodPressureTrendChart from '../components/features/BloodPressureTrendChart';
import HeartRateTrendChart from '../components/features/HeartRateTrendChart';
import MedicationAdherenceCalendar from '../components/features/MedicationAdherenceCalendar';

const Trends = () => {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  return (
    <div className="bg-gray-50 min-h-full pb-6">
      <header className="bg-white border-b-2 border-gray-100 px-6 py-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-elder-xl font-bold text-dark">
          健康趋势
        </h1>
      </header>

      <div className="p-6 space-y-8">
        {/* 时间范围选择 */}
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

        {/* INR 趋势 */}
        <Card title="抗凝指标 (INR) 趋势">
          <INRTrendChart days={timeRange} />
          <p className="mt-4 text-elder-sm text-gray-500">
            绿色区域 (2.0-3.0) 为理想达标范围。
          </p>
        </Card>

        {/* 血压趋势 */}
        <Card title="血压变化趋势">
          <BloodPressureTrendChart days={timeRange} />
        </Card>

        {/* 心率趋势 (新增) */}
        <Card title="静息心率变化">
          <HeartRateTrendChart days={timeRange} />
        </Card>

        {/* 用药依从性 */}
        <Card title="用药打卡记录">
          <MedicationAdherenceCalendar />
        </Card>
      </div>
    </div>
  );
};

export default Trends;