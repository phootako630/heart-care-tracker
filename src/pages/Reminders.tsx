import React, { useState, useEffect } from 'react';
import { FaBellSlash } from 'react-icons/fa6';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ReminderItem from '../components/features/ReminderItem';
import BottomSheet from '../components/ui/BottomSheet';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import { useMedications } from '../hooks/useMedications';
import { requestNotificationPermission, scheduleNotification } from '../utils/notifications';

// 模拟其他类型的提醒
const CHECKUP_REMINDERS = [
  { id: 'inr', title: 'INR 检测', frequency: '每周一次', enabled: true },
  { id: 'bp', title: '血压测量', frequency: '每天早晚', enabled: true },
];

const Reminders = () => {
  const { medications } = useMedications();
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);
  
  // 本地状态管理提醒开关 (实际应同步到 Firestore)
  const [localMedReminders, setLocalMedReminders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 检查权限状态
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationGranted(true);
    }
  }, []);

  useEffect(() => {
    // 初始化用药提醒状态
    if (medications.length > 0) {
      const initial: Record<string, boolean> = {};
      medications.forEach(m => {
        initial[m.id] = m.reminderEnabled;
      });
      setLocalMedReminders(prev => ({ ...initial, ...prev }));
    }
  }, [medications]);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationGranted(granted);
    if (granted) {
      setToast({ msg: '提醒功能已开启', type: 'success' });
      // 模拟调度所有开启的提醒
      medications.forEach(m => {
        if (localMedReminders[m.id]) {
          scheduleNotification('服药提醒', `该吃药了：${m.drugName} ${m.dosage}`, m.scheduleTime);
        }
      });
    } else {
      setToast({ msg: '未获得通知权限', type: 'error' });
    }
  };

  const toggleMedication = (id: string) => {
    setLocalMedReminders(prev => {
      const newState = !prev[id];
      // 如果开启，尝试调度
      if (newState && notificationGranted) {
        const med = medications.find(m => m.id === id);
        if (med) {
          scheduleNotification('服药提醒', `该吃药了：${med.drugName} ${med.dosage}`, med.scheduleTime);
        }
      }
      return { ...prev, [id]: newState };
    });
  };

  return (
    <div className="bg-gray-50 min-h-full pb-6">
      <header className="bg-white border-b-2 border-gray-100 px-6 py-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-elder-xl font-bold text-dark">
          提醒管理
        </h1>
      </header>

      <div className="p-6 space-y-8">
        {/* 权限提示 Banner */}
        {!notificationGranted && (
          <div className="bg-yellow-50 border-l-8 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-4">
              <FaBellSlash className="text-yellow-600 mt-1" size={24} />
              <div>
                <h3 className="text-elder-lg font-bold text-yellow-900">通知未开启</h3>
                <p className="text-elder-base text-yellow-800 mt-2">
                  为了不错过服药时间，请点击下方按钮开启通知权限。
                </p>
                <Button 
                  variant="primary" 
                  size="normal" 
                  className="mt-4"
                  onClick={handleRequestPermission}
                >
                  开启通知
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 用药提醒列表 */}
        <section>
          <h2 className="text-elder-lg font-bold text-gray-600 mb-4 px-2">
            用药提醒
          </h2>
          <div className="flex flex-col gap-4">
            {medications.length === 0 ? (
              <Card><p className="text-gray-400">暂无药物</p></Card>
            ) : (
              medications.map(med => (
                <ReminderItem
                  key={med.id}
                  title={med.drugName}
                  subtitle={med.dosage}
                  time={med.scheduleTime}
                  enabled={localMedReminders[med.id] ?? true}
                  onToggle={() => toggleMedication(med.id)}
                />
              ))
            )}
          </div>
        </section>

        {/* 常规检测提醒 */}
        <section>
          <h2 className="text-elder-lg font-bold text-gray-600 mb-4 px-2">
            常规检测
          </h2>
          <div className="flex flex-col gap-4">
            {CHECKUP_REMINDERS.map(item => (
              <ReminderItem
                key={item.id}
                title={item.title}
                frequency={item.frequency}
                enabled={item.enabled}
                onToggle={() => {}} // 暂未实现逻辑
              />
            ))}
          </div>
        </section>
      </div>

      {toast && (
        <Toast 
          message={toast.msg} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Reminders;