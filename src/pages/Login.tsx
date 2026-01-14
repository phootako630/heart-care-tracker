import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 发送验证码
  const sendOTP = async () => {
    setLoading(true);
    try {
      // 注意：实际项目中需在 Supabase 后台开启 Phone Auth 并配置短信服务商
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+86${phone}`,
        options: {
          channel: 'sms',
        }
      });
      
      if (error) throw error;
      
      setStep('otp');
      alert('验证码已发送到您的手机');
    } catch (error: any) {
      alert(`发送失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 验证登录
  const verifyOTP = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+86${phone}`,
        token: otp,
        type: 'sms',
      });
      
      if (error) throw error;
      
      // 检查是否首次登录（需要完善资料）
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!profile) {
          navigate('/onboarding'); // 首次登录，去完善资料
        } else {
          navigate('/'); // 直接进入首页
        }
      }
    } catch (error: any) {
      alert(`验证失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg text-white">
            <span className="text-[48px]">❤️</span>
          </div>
          <h1 className="text-elder-2xl font-bold text-dark mb-3">
            健康记录助手
          </h1>
          <p className="text-elder-sm text-gray-600">
            为心脏瓣膜术后患者设计
          </p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-[32px] shadow-xl p-8 border-2 border-gray-100">
          {step === 'phone' ? (
            <>
              <h2 className="text-elder-lg font-bold text-dark mb-6">
                手机号登录
              </h2>
              
              <Input
                type="tel"
                label="请输入手机号"
                placeholder="13800138000"
                value={phone}
                onChange={setPhone}
              />
              
              <div className="mt-8">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={sendOTP}
                  disabled={phone.length !== 11 || loading}
                >
                  {loading ? '发送中...' : '获取验证码'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-elder-lg font-bold text-dark mb-2">
                输入验证码
              </h2>
              
              <p className="text-elder-sm text-gray-600 mb-6">
                已发送至 {phone}
              </p>
              
              <Input
                type="text"
                label="验证码"
                placeholder="123456"
                value={otp}
                onChange={setOtp}
              />
              
              <div className="mt-8">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={verifyOTP}
                  disabled={otp.length !== 6 || loading}
                >
                  {loading ? '验证中...' : '登录'}
                </Button>
              </div>
              
              <button
                onClick={() => setStep('phone')}
                className="w-full text-elder-sm text-primary font-bold mt-6 py-4"
              >
                重新获取验证码
              </button>
            </>
          )}
        </div>

        {/* 隐私提示 */}
        <p className="text-elder-xs text-gray-400 text-center mt-8 leading-relaxed">
          登录即表示同意我们的隐私政策<br/>
          您的健康数据将通过 Supabase 安全存储
        </p>
      </div>
    </div>
  );
}