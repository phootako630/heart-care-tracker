const CACHE_NAME = 'health-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // 注意：在实际构建中，Vite 会生成带有 hash 的文件名
  // 这里列出的是静态资源，生产环境建议配合 Workbox 自动生成列表
  '/manifest.json'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: 缓存已打开');
      return cache.addAll(urlsToCache);
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 忽略非 GET 请求
  if (event.request.method !== 'GET') return;
  
  // 忽略 chrome-extension 等协议
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. 缓存命中，直接返回缓存
      if (response) {
        return response;
      }
      
      // 2. 否则发起网络请求
      return fetch(event.request).then((response) => {
        // 检查响应是否有效
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // 3. 将新响应加入缓存 (Supabase API 请求通常不在此处缓存，由 React Query 处理)
        // 这里主要缓存 JS/CSS/Image 资源
        const responseToCache = response.clone();
        
        // 过滤掉 API 请求，避免缓存动态数据
        if (!event.request.url.includes('supabase.co')) {
             caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        
        return response;
      });
    })
  );
});

// 清理旧缓存
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: 清理旧缓存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});