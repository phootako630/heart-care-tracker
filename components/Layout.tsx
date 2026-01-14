import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHeartPulse, FaChartLine, FaBell, FaUser } from 'react-icons/fa6';

// 底部导航栏组件
const BottomNavigation = () => {
  // 定义导航项配置
  const navItems = [
    { path: '/', label: '记录', icon: <FaHeartPulse /> },
    { path: '/trends', label: '趋势', icon: <FaChartLine /> },
    { path: '/reminders', label: '提醒', icon: <FaBell /> },
    { path: '/profile', label: '我的', icon: <FaUser /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t-2 border-gray-200 flex items-stretch z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 
            ${isActive 
              ? 'text-primary bg-blue-50 font-bold' 
              : 'text-gray-500 hover:bg-gray-50'}`
          }
        >
          {/* 图标尺寸设置为 32px，满足老年人可视需求 */}
          <span className="text-3xl mb-1">{item.icon}</span>
          {/* 标签文字使用 elder-sm (20px) */}
          <span className="text-elder-sm">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

// 主布局组件
export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* 主要内容区域 - 底部留出 80px 给导航栏 */}
      <main className="flex-1 pb-[90px] w-full max-w-md mx-auto bg-white shadow-lg min-h-screen relative">
        <Outlet />
      </main>
      
      {/* 底部导航栏 */}
      <div className="w-full max-w-md mx-auto fixed bottom-0 left-0 right-0">
        <BottomNavigation />
      </div>
    </div>
  );
};