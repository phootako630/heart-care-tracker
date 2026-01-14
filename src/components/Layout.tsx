import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './layout/BottomNav';

// 主布局组件
export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 主要内容区域 - 底部留出 80px 给导航栏 */}
      {/* max-w-md 限制在手机宽度，模拟 App 体验 */}
      <main className="flex-1 pb-[90px] w-full max-w-md mx-auto bg-gray-50 shadow-2xl min-h-screen relative">
        <Outlet />
      </main>
      
      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  );
};