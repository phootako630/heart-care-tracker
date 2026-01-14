import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import BottomSheet from '../ui/BottomSheet';
import NumberPad from '../ui/NumberPad';
import { useINRRecords } from '../../hooks/useINRRecords';

const INRRecordCard: React.FC = () => {
  const { records, addRecord } = useINRRecords();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 获取最新一条记录
  const latestRecord = records[0];

  // 处理数字键盘输入
  const handleNumberClick = (num: string) => {
    if (inputValue.length > 4) return; // 限制长度
    if (num === '.' && inputValue.includes('.')) return; // 防止多个小数点
    setInputValue(prev => prev + num);
  };

  const handleBackspace = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleConfirm = async () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      await addRecord(value);
      setIsSheetOpen(false);
      setInputValue('');
    }
  };

  return (
    <>
      <Card title="INR (抗凝指标)" className="border-l-8 border-l-primary">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            {latestRecord ? (
              <>
                <span className="text-elder-number font-mono font-bold text-dark leading-none">
                  {latestRecord.value.toFixed(2)}
                </span>
                <span className="text-elder-sm text-gray-500 mt-2">
                  {latestRecord.recordTime.toLocaleDateString()} 测量
                </span>
              </>
            ) : (
              <span className="text-elder-base text-gray-400">暂无记录</span>
            )}
          </div>
          
          <div>
            {latestRecord ? (
              latestRecord.isInRange ? (
                <Badge variant="success">在范围内</Badge>
              ) : (
                <Badge variant="danger">注意</Badge>
              )
            ) : null}
          </div>
        </div>

        {/* 状态提示文案 */}
        {latestRecord && !latestRecord.isInRange && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 text-elder-sm rounded-lg font-bold">
            ⚠️ 数值异常，请咨询医生调整药量
          </div>
        )}

        <Button 
          variant="primary" 
          fullWidth 
          onClick={() => setIsSheetOpen(true)}
        >
          记录新数值
        </Button>
      </Card>

      {/* 录入弹窗 */}
      <BottomSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title="输入今日 INR 值"
      >
        <div className="flex flex-col gap-6 items-center">
          <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center border-b-4 border-primary">
            <span className="text-6xl font-mono font-bold text-primary">
              {inputValue || '0.00'}
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

export default INRRecordCard;