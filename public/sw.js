const CACHE_NAME = 'health-tracker-v4';
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
  // 强制立即激活，让新 SW 接管，防止旧缓存阻碍更新
  self.skipWaiting();
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 忽略非 GET 请求
  if (event.request.method !== 'GET') return;
  
  // 忽略 chrome-extension 等协议
  if (!event.request.url.startsWith('http')) return;

  // 策略 1: 针对 HTML 页面 (Navigation) 使用 Network First
  // 这可以确保每次加载页面时都获取最新的 index.html (包含最新的 CSS/JS hash 链接)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 网络请求成功，更新缓存
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // 网络请求失败（离线），使用缓存
          return caches.match(event.request);
        })
    );
    return;
  }

  // 策略 2: 针对静态资源和图片 使用 Cache First (Stale-While-Revalidate logic optimized)
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
        
        // 3. 将新响应加入缓存
        // 过滤掉 API 请求 (Supabase)
        if (!event.request.url.includes('supabase.co')) {
             caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
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
  // 立即接管所有客户端，确保新样式立即生效
  event.waitUntil(self.clients.claim());
});