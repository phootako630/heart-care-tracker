import React from 'react';

const Reminders = () => {
  return (
    <div className="p-6">
      <h1 className="text-elder-xl font-bold text-dark mb-6">用药提醒</h1>
      <ul className="space-y-4">
        <li className="p-4 bg-white border-2 border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
          <div>
            <div className="text-elder-lg font-bold">华法林</div>
            <div className="text-elder-base text-gray-500">3mg (1片)</div>
          </div>
          <div className="text-elder-xl font-bold text-primary">08:00</div>
        </li>
      </ul>
    </div>
  );
};

export default Reminders;