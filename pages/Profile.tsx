import React from 'react';

const Profile = () => {
  return (
    <div className="p-6">
      <h1 className="text-elder-xl font-bold text-dark mb-6">个人中心</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-elder-base text-gray-500 mb-1">姓名</div>
          <div className="text-elder-xl font-bold">张大爷</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-elder-base text-gray-500 mb-1">目标 INR</div>
          <div className="text-elder-xl font-bold text-primary">2.0 - 3.0</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;