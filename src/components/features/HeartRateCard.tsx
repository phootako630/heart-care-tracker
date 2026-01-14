import React, { useState } from 'react';
import { FaHeartPulse } from 'react-icons/fa6';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import BottomSheet from '../ui/BottomSheet';
import NumberPad from '../ui/NumberPad';
import { useHeartRateRecords } from '../../hooks/useHeartRateRecords';

const HeartRateCard: React.FC = () => {
  const { records, addRecord } = useHeartRateRecords();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const latestRecord = records[0];

  // 处理数字输入
  const handleNumberClick = (num: string) => {
    if (inputValue.length > 3) return; // 心率通常不超过3位
    if (num === '.') return; // 心率通常为整数
    setInputValue(prev => prev + num);
  };

  const handleBackspace = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleConfirm = async () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      await addRecord(value);
      setIsSheetOpen(false);
      setInputValue('');
    }
  };

  // 简单的状态判断
  const getStatus = (bpm: number) => {
    if (bpm > 100) return { label: '心动过速', variant: 'danger' as const };
    if (bpm < 60) return { label: '心动过缓', variant: 'warning' as const };
    return { label: '正常', variant: 'success' as const };
  };

  return (
    <>
      <Card title="静息心率 (脉搏)" className="border-l-8 border-l-red-400">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            {latestRecord ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-elder-number font-mono font-bold text-dark leading-none">
                    {latestRecord.bpm}
                  </span>
                  <span className="text-elder-sm text-gray-500">次/分</span>
                </div>
                <span className="text-elder-sm text-gray-500 mt-2">
                  {latestRecord.recordTime.toLocaleDateString()} 测量
                </span>
              </>
            ) : (
              <span className="text-elder-base text-gray-400">暂无记录</span>
            )}
          </div>
          
          <div>
            {latestRecord && (
              <Badge variant={getStatus(latestRecord.bpm).variant}>
                {getStatus(latestRecord.bpm).label}
              </Badge>
            )}
          </div>
        </div>

        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => setIsSheetOpen(true)}
          className="border-red-400 text-red-800 hover:bg-red-50"
        >
          <div className="flex items-center gap-2">
            <FaHeartPulse /> 记录心率
          </div>
        </Button>
      </Card>

      {/* 录入弹窗 */}
      <BottomSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title="输入心率 (次/分)"
      >
        <div className="flex flex-col gap-6 items-center">
          <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center border-b-4 border-red-400">
            <span className="text-6xl font-mono font-bold text-dark">
              {inputValue || '--'}
            </span>
          </div>
          
          <NumberPad 
            onNumberClick={handleNumberClick}
            onBackspace={handleBackspace}
            onConfirm={handleConfirm}
            className="w-full"
          />

          <Button 
            variant="primary" 
            size="large" 
            fullWidth 
            onClick={handleConfirm}
            disabled={!inputValue}
          >
            确认保存
          </Button>
        </div>
      </BottomSheet>
    </>
  );
};

export default HeartRateCard;