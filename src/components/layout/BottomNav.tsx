import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHeartPulse, FaChartLine, FaBell, FaUser } from 'react-icons/fa6';

const BottomNav: React.FC = () => {
  // 定义导航项配置
  const navItems = [
    { path: '/', label: '记录', icon: <FaHeartPulse /> },
    { path: '/trends', label: '趋势', icon: <FaChartLine /> },
    { path: '/reminders', label: '提醒', icon: <FaBell /> },
    { path: '/profile', label: '我的', icon: <FaUser /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t-2 border-gray-200 flex items-stretch z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] max-w-md mx-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 select-none
            ${isActive 
              ? 'text-primary bg-blue-50 font-bold' 
              : 'text-gray-500 hover:bg-gray-50'}`
          }
        >
          {/* 图标尺寸设置为 28px */}
          <span className="text-[28px] mb-0.5">{item.icon}</span>
          {/* 标签文字使用 elder-xs/sm */}
          <span className="text-[18px] leading-none">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;