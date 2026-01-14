import React, { useState } from 'react';
import Card from '../components/ui/Card';
import TimeRangeSelector from '../components/features/TimeRangeSelector';
import INRTrendChart from '../components/features/INRTrendChart';
import BloodPressureTrendChart from '../components/features/BloodPressureTrendChart';
import HeartRateTrendChart from '../components/features/HeartRateTrendChart';
import MedicationAdherenceCalendar from '../components/features/MedicationAdherenceCalendar';
import HistoryList from '../components/features/HistoryList';
import { useINRRecords } from '../hooks/useINRRecords';
import { useBloodPressureRecords } from '../hooks/useBloodPressureRecords';
import { useHeartRateRecords } from '../hooks/useHeartRateRecords';

const Trends = () => {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  
  // 获取数据传给 HistoryList
  const { records: inrRecords } = useINRRecords();
  const { records: bpRecords } = useBloodPressureRecords();
  const { records: hrRecords } = useHeartRateRecords();

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

        {/* 心率趋势 */}
        <Card title="静息心率变化">
          <HeartRateTrendChart days={timeRange} />
        </Card>

        {/* 用药依从性 */}
        <Card title="用药打卡记录">
          <MedicationAdherenceCalendar />
        </Card>
        
        {/* 详细历史列表 */}
        <div className="pt-4 border-t-2 border-gray-200">
          <h2 className="text-elder-lg font-bold text-dark mb-4">
            历史数据明细
          </h2>
          <HistoryList 
            inrRecords={inrRecords}
            bpRecords={bpRecords}
            hrRecords={hrRecords}
          />
        </div>
      </div>
    </div>
  );
};

export default Trends;