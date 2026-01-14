import React from 'react';
import Card from '../ui/Card';
import { useMedications } from '../../hooks/useMedications';
import { useMedicationLogs } from '../../hooks/useMedicationLogs';
import { FaCheck } from 'react-icons/fa6';

const MedicationCheckList: React.FC = () => {
  const { medications } = useMedications();
  const { logs, logMedication, removeLog } = useMedicationLogs();

  return (
    <Card title="今日用药" className="border-l-8 border-l-secondary">
      {medications.length === 0 ? (
        <p className="text-elder-base text-gray-500 py-4 text-center">
          暂无用药计划
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {medications.map((med) => {
            // 查找今日是否已服用
            const log = logs.find(l => l.medicationId === med.id);
            const isTaken = !!log;

            const handleToggle = () => {
              if (isTaken) {
                removeLog(log.id);
              } else {
                logMedication(med.id, med.scheduleTime);
              }
            };

            return (
              <div 
                key={med.id}
                onClick={handleToggle}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none
                  ${isTaken 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 active:bg-gray-50'
                  }
                `}
              >
                {/* Checkbox UI */}
                <div className={`
                  w-10 h-10 rounded-lg border-2 flex items-center justify-center shrink-0
                  ${isTaken 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-gray-300'
                  }
                `}>
                  {isTaken && <FaCheck size={24} />}
                </div>

                {/* 文本信息 */}
                <div className="flex-1">
                  <div className={`text-elder-lg font-bold ${isTaken ? 'text-green-800' : 'text-dark'}`}>
                    {med.drugName}
                  </div>
                  <div className="flex items-center gap-3 text-elder-sm text-gray-500">
                    <span>{med.dosage}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{med.scheduleTime}</span>
                  </div>
                </div>

                {/* 状态文字 (仅在未服用时显示"待服"，已服用靠颜色区分) */}
                {!isTaken && (
                  <span className="text-elder-sm font-bold text-gray-400">
                    待服
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default MedicationCheckList;