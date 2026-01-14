import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase 配置信息
// 在生产环境中，这些值应从 .env 文件中获取 (import.meta.env.VITE_FIREBASE_...)
// 这里为了演示结构，使用占位符
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456:web:abcdef"
};

// 初始化 Firebase 应用实例
const app = initializeApp(firebaseConfig);

// 导出 Firestore 数据库实例
export const db = getFirestore(app);

// 导出 Auth 认证实例
export const auth = getAuth(app);

export default app;