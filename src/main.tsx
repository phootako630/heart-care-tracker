import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 注册 Service Worker 以支持 PWA 和离线能力
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW 注册成功，作用域:', registration.scope);
      })
      .catch((error) => {
        console.log('SW 注册失败:', error);
      });
  });
} 
// 在开发环境，主动注销可能存在的 Service Worker，防止缓存干扰开发
else if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
      console.log('开发环境：已注销 Service Worker 以清除缓存');
    }
  });
}