import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'; 

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
if ('serviceWorker' in navigator) {
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