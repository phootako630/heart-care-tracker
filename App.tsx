import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Trends from './pages/Trends';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';

// App 根组件
// 使用 HashRouter 以兼容纯静态托管环境
// 配置主要路由结构
const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="trends" element={<Trends />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;