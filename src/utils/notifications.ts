/**
 * 请求浏览器通知权限
 * @returns boolean 是否获得权限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('此浏览器不支持桌面通知');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * 发送即时通知
 */
export function sendNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png', // 假设有这个图标
    });
  }
}

/**
 * 简单的定时提醒调度 (模拟)
 * 在实际 PWA 中，应使用 Service Worker 的 Push API 或 Periodic Sync
 */
export function scheduleNotification(title: string, body: string, timeStr: string) {
  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);

  // 如果时间已过，设为明天
  if (targetTime.getTime() < now.getTime()) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const delay = targetTime.getTime() - now.getTime();

  // 仅演示：使用 setTimeout (页面关闭后会失效)
  setTimeout(() => {
    sendNotification(title, body);
  }, delay);

  console.log(`已调度通知: "${title}" 于 ${timeStr}`);
}