import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

import ProtectedRoute from './components/layout/ProtectedRoute';
import BottomNav from './components/layout/BottomNav';
import NetworkStatus from './components/layout/NetworkStatus';

// 懒加载页面组件，优化首屏性能
const Login = lazy(() => import('./pages/Login'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Home = lazy(() => import('./pages/Home'));
const Trends = lazy(() => import('./pages/Trends'));
const Reminders = lazy(() => import('./pages/Reminders'));
const Profile = lazy(() => import('./pages/Profile'));

// 配置 React Query 及其持久化
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 数据 5 分钟内认为新鲜
      gcTime: 1000 * 60 * 60 * 24, // 垃圾回收时间 24 小时 (原 cacheTime)
      retry: 2,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-elder-lg text-gray-500 font-bold">正在加载应用...</div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{ persister }}
    >
      <HashRouter>
        <NetworkStatus />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* 受保护路由 */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Home />
                    <BottomNav />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trends"
              element={
                <ProtectedRoute>
                  <>
                    <Trends />
                    <BottomNav />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <>
                    <Reminders />
                    <BottomNav />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <Profile />
                    <BottomNav />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </PersistQueryClientProvider>
  );
};

export default App;