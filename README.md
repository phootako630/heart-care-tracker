# 🏥 健康记录助手 (HealthTracker)

专为心脏瓣膜置换术后老年患者设计的健康数据管理工具。

## ✨ 核心功能

- **📊 健康监测**：简便记录每日 INR（抗凝指标）和血压数据。
- **📈 趋势分析**：清晰的图表展示，直观了解健康走势。
- **⏰ 智能提醒**：用药、复诊提醒，防止遗忘。
- **📱 PWA 支持**：可安装至手机桌面，支持离线使用，适应弱网环境。
- **👴 适老化设计**：超大字体、高对比度、极简操作逻辑。
- **🔒 数据安全**：基于 Supabase 的云端存储与 RLS 权限控制。

## 🚀 技术架构

- **前端**：React 18 + TypeScript + Vite
- **UI**：Tailwind CSS (定制老年人字体系统)
- **状态管理/缓存**：TanStack Query + Zustand
- **后端/数据库**：Supabase (PostgreSQL + Auth)
- **部署**：Vercel / Netlify

## 📦 快速开始

### 1. 环境准备
确保已安装 Node.js (v16+)。

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制 `.env.example` 为 `.env.local` 并填入 Supabase 信息：
```env
VITE_SUPABASE_URL=你的_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
```

### 4. 数据库设置
登录 Supabase 控制台，在 SQL Editor 中运行 `SUPABASE_SETUP.sql` 文件中的脚本，以创建表结构和安全策略。

### 5. 启动开发
```bash
npm run dev
```

## 🌐 部署指南 (Vercel)

1. 将代码提交至 GitHub/GitLab。
2. 登录 Vercel，导入项目。
3. 在 Vercel 项目设置中添加环境变量 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)。
4. 部署即可，Vercel 会自动识别 `vercel.json` 配置。

## 📱 手机端安装 (PWA)

1. **iOS (Safari)**：点击底部分享按钮 -> "添加到主屏幕"。
2. **Android (Chrome)**：点击右上角菜单 -> "安装应用" 或 "添加到主屏幕"。

## 📄 许可证

MIT License