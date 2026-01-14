import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
       setAuthenticated(!!session);
       setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
    } catch (error) {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-elder-lg text-gray-600 font-bold">加载中...</div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}