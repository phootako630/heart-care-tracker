import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import BottomSheet from '../ui/BottomSheet';
import Input from '../ui/Input';
import { useBloodPressureRecords } from '../../hooks/useBloodPressureRecords';

const BloodPressureCard: React.FC = () => {
  const { records, addRecord } = useBloodPressureRecords();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // 表单状态
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');

  const latestRecord = records[0];

  // 简单的血压状态判断
  const getBPStatus = (sys: number, dia: number) => {
    if (sys >= 160 || dia >= 100) return { label: '高血压', variant: 'danger' as const };
    if (sys >= 140 || dia >= 90) return { label: '偏高', variant: 'warning' as const };
    return { label: '正常', variant: 'success' as const };
  };

  const handleSave = async () => {
    if (!systolic || !diastolic) return;
    
    await addRecord(
      Number(systolic), 
      Number(diastolic), 
      heartRate ? Number(heartRate) : undefined, 
      'sitting'
    );
    
    // 重置并关闭
    setSystolic('');
    setDiastolic('');
    setHeartRate('');
    setIsSheetOpen(false);
  };

  return (
    <>
      <Card title="血压/心率" className="border-l-8 border-l-accent">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            {latestRecord ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-elder-display font-mono font-bold text-dark">
                    {latestRecord.systolic}/{latestRecord.diastolic}
                  </span>
                  <span className="text-elder-sm text-gray-500">mmHg</span>
                </div>
                {latestRecord.heartRate && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-elder-lg text-gray-600">
                      ❤️ {latestRecord.heartRate}
                    </span>
                    <span className="text-elder-xs text-gray-400">次/分</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-elder-base text-gray-400">暂无记录</span>
            )}
          </div>

          {latestRecord && (
            <Badge variant={getBPStatus(latestRecord.systolic, latestRecord.diastolic).variant}>
              {getBPStatus(latestRecord.systolic, latestRecord.diastolic).label}
            </Badge>
          )}
        </div>

        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => setIsSheetOpen(true)}
        >
          记录血压
        </Button>
      </Card>

      <BottomSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title="记录血压"
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="number" 
              label="收缩压 (高压)" 
              placeholder="120" 
              value={systolic} 
              onChange={setSystolic}
            />
            <Input 
              type="number" 
              label="舒张压 (低压)" 
              placeholder="80" 
              value={diastolic} 
              onChange={setDiastolic}
            />
          </div>
          
          <Input 
            type="number" 
            label="心率 (选填)" 
            placeholder="75" 
            unit="次/分"
            value={heartRate} 
            onChange={setHeartRate}
          />

          <div className="h-4"></div> {/* Spacer */}

          <Button 
            variant="primary" 
            size="large" 
            fullWidth 
            onClick={handleSave}
            disabled={!systolic || !diastolic}
          >
            保存记录
          </Button>
        </div>
      </BottomSheet>
    </>
  );
};

export default BloodPressureCard;