import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surgeryDate: '',
    targetINRMin: 2.0,
    targetINRMax: 3.0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      // 创建用户资料
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          surgery_date: formData.surgeryDate || null,
          target_inr_min: formData.targetINRMin,
          target_inr_max: formData.targetINRMax,
          phone: user.phone || ''
        });

      if (error) throw error;

      navigate('/');
    } catch (error: any) {
      alert(`保存失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1">
        <header className="mb-8 mt-4">
          <h1 className="text-elder-2xl font-bold text-dark mb-3">
            完善个人信息
          </h1>
          <p className="text-elder-sm text-gray-600">
            为了更好地管理您的健康，我们需要了解一些基本情况。
          </p>
        </header>

        <Card className="mb-6">
          <Input
            type="text"
            label="您的姓名"
            placeholder="请输入真实姓名"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
          />
        </Card>

        <Card className="mb-6">
          <Input
            type="date"
            label="手术日期（可选）"
            value={formData.surgeryDate}
            onChange={(value) => setFormData({ ...formData, surgeryDate: value })}
          />
        </Card>

        <Card className="mb-8">
          <h3 className="text-elder-lg font-bold text-dark mb-4">
            INR 目标范围
          </h3>
          <p className="text-elder-sm text-gray-500 mb-6">
            通常为 2.0 - 3.0，请遵医嘱设置。
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="最小值"
              value={String(formData.targetINRMin)}
              onChange={(value) => setFormData({ ...formData, targetINRMin: parseFloat(value) })}
            />
            <Input
              type="number"
              label="最大值"
              value={String(formData.targetINRMax)}
              onChange={(value) => setFormData({ ...formData, targetINRMax: parseFloat(value) })}
            />
          </div>
        </Card>

        <Button
          variant="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={!formData.name || loading}
        >
          {loading ? '保存中...' : '开始使用'}
        </Button>
      </div>
    </div>
  );
}