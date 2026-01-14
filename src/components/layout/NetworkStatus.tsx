import React, { useEffect, useState } from 'react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-3 px-4 z-[100] shadow-md animate-in slide-in-from-top">
      <p className="text-elder-sm font-bold">
        ⚠️ 当前网络不可用，已切换至离线模式
      </p>
    </div>
  );
}