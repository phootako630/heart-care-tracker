import React from 'react';

const Home = () => {
  return (
    <div className="p-6 space-y-8">
      <header className="mb-6">
        <h1 className="text-elder-xl font-bold text-dark">今日健康</h1>
        <p className="text-elder-base text-gray-600 mt-2">请记录今天的身体状况</p>
      </header>

      {/* 快捷操作卡片示例 */}
      <div className="grid gap-6">
        <button className="w-full h-touch-xl bg-primary text-white rounded-2xl flex items-center justify-center text-elder-lg font-bold shadow-md active:scale-95 transition-transform">
          记录 INR 值
        </button>
        
        <button className="w-full h-touch-xl bg-secondary text-dark rounded-2xl flex items-center justify-center text-elder-lg font-bold shadow-md active:scale-95 transition-transform">
          记录血压
        </button>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border-l-8 border-yellow-400 rounded-lg">
        <h2 className="text-elder-lg font-bold text-yellow-800">服药提醒</h2>
        <p className="text-elder-base mt-2 text-yellow-900">下午 14:00 记得服用华法林</p>
      </div>
    </div>
  );
};

export default Home;