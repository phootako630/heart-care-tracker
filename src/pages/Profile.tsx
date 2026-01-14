import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import { UserProfile } from '../types';
import { generateHealthReport } from '../utils/reportGenerator';
import { useINRRecords } from '../hooks/useINRRecords';
import { useBloodPressureRecords } from '../hooks/useBloodPressureRecords';
import { useMedications } from '../hooks/useMedications';

// 模拟用户数据 (实际应从 Firestore 获取)
const MOCK_PROFILE: UserProfile = {
  id: 'demo-user-1',
  name: '张建国',
  phone: '13800138000',
  targetINR: [2.0, 3.0],
  targetBP: { systolic: 140, diastolic: 90 },
  surgeryDate: new Date('2023-05-15')
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'info'} | null>(null);

  // 获取数据用于导出
  const { records: inrRecords } = useINRRecords();
  const { records: bpRecords } = useBloodPressureRecords();
  const { medications } = useMedications();

  const handleSave = () => {
    setIsEditing(false);
    // 实际应调用 API 更新 Firestore
    setToast({ msg: '个人信息已更新', type: 'success' });
  };

  const handleExport = async () => {
    setToast({ msg: '正在生成报告...', type: 'info' });
    try {
      await generateHealthReport(profile, inrRecords, bpRecords, medications);
      setToast({ msg: '报告下载成功', type: 'success' });
    } catch (e) {
      console.error(e);
      setToast({ msg: '导出失败', type: 'success' }); // 容错显示
    }
  };

  return (
    <div className="bg-gray-50 min-h-full pb-6">
      <header className="bg-white border-b-2 border-gray-100 px-6 py-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <h1 className="text-elder-xl font-bold text-dark">
          个人中心
        </h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-primary text-elder-base font-bold px-4 py-2"
          >
            编辑
          </button>
        )}
      </header>

      <div className="p-6 space-y-8">
        {/* 基本信息 */}
        <Card title="基本信息">
          <div className="space-y-4">
            <Input 
              type="text" 
              label="姓名" 
              value={profile.name} 
              readOnly={!isEditing}
              onChange={(v) => setProfile({...profile, name: v})}
            />
            <Input 
              type="tel" 
              label="手机号" 
              value={profile.phone} 
              readOnly={!isEditing}
              onChange={(v) => setProfile({...profile, phone: v})}
            />
            <div className="flex flex-col gap-2">
              <label className="text-elder-sm font-bold text-dark ml-1">手术日期</label>
              <div className="h-[80px] px-4 rounded-2xl bg-gray-50 border-4 border-gray-200 flex items-center text-elder-xl text-dark">
                {profile.surgeryDate ? profile.surgeryDate.toLocaleDateString() : '未设置'}
              </div>
            </div>
          </div>
        </Card>

        {/* 治疗目标 */}
        <Card title="控制目标" className="border-l-8 border-l-primary">
          <div className="space-y-6">
            <div>
              <label className="text-elder-sm font-bold text-dark mb-2 block">
                目标 INR 范围
              </label>
              <div className="flex items-center gap-4">
                <Input 
                  type="number" 
                  value={profile.targetINR[0]} 
                  readOnly={!isEditing}
                  onChange={(v) => setProfile({...profile, targetINR: [Number(v), profile.targetINR[1]]})}
                  className="flex-1"
                />
                <span className="text-elder-lg font-bold text-gray-400">-</span>
                <Input 
                  type="number" 
                  value={profile.targetINR[1]} 
                  readOnly={!isEditing}
                  onChange={(v) => setProfile({...profile, targetINR: [profile.targetINR[0], Number(v)]})}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-elder-sm font-bold text-dark mb-2 block">
                血压预警上限 (mmHg)
              </label>
              <div className="flex items-center gap-4">
                <Input 
                  type="number" 
                  label="收缩压 <"
                  value={profile.targetBP.systolic} 
                  readOnly={!isEditing}
                  onChange={(v) => setProfile({...profile, targetBP: {...profile.targetBP, systolic: Number(v)}})}
                  className="flex-1"
                />
                <Input 
                  type="number" 
                  label="舒张压 <"
                  value={profile.targetBP.diastolic} 
                  readOnly={!isEditing}
                  onChange={(v) => setProfile({...profile, targetBP: {...profile.targetBP, diastolic: Number(v)}})}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 操作区 */}
        {isEditing ? (
          <div className="flex gap-4">
            <Button variant="secondary" fullWidth onClick={() => setIsEditing(false)}>
              取消
            </Button>
            <Button variant="primary" fullWidth onClick={handleSave}>
              保存修改
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button variant="secondary" fullWidth onClick={handleExport}>
              📥 导出健康报告 (PDF)
            </Button>
            <Button variant="danger" fullWidth onClick={() => alert('演示模式：数据已清除')}>
              🗑️ 清除缓存数据
            </Button>
          </div>
        )}
      </div>

      {toast && (
        <Toast 
          message={toast.msg} 
          type={toast.type === 'success' ? 'success' : 'info'} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Profile;