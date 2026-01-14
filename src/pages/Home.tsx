import React from 'react';
import INRRecordCard from '../components/features/INRRecordCard';
import BloodPressureCard from '../components/features/BloodPressureCard';
import MedicationCheckList from '../components/features/MedicationCheckList';

const Home = () => {
  // 获取当前日期用于标题
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="bg-gray-50 min-h-full">
      {/* 页面头部 */}
      <header className="bg-white border-b-2 border-gray-100 px-6 py-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-elder-xl font-bold text-dark">
          今日健康记录
        </h1>
        <p className="text-elder-base text-gray-500 mt-2 font-medium">
          {today}
        </p>
      </header>

      {/* 内容区域 */}
      <div className="p-6 flex flex-col gap-6">
        {/* 重要提醒：如果所有药都没吃，可以在这里加个顶部Banner */}
        
        {/* 1. 抗凝指标 (最重要) */}
        <section>
          <INRRecordCard />
        </section>

        {/* 2. 血压记录 */}
        <section>
          <BloodPressureCard />
        </section>

        {/* 3. 用药打卡 */}
        <section className="mb-4">
          <MedicationCheckList />
        </section>
      </div>
    </div>
  );
};

export default Home;