import { format, isAfter, subDays, startOfDay, endOfDay, isSameDay, getDaysInMonth, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { INRRecord, BloodPressureRecord, Medication, MedicationLog, HeartRateRecord } from '../types';

/**
 * 过滤并格式化 INR 数据用于图表展示
 */
export function prepareINRChartData(records: INRRecord[], days: number) {
  const cutOffDate = subDays(new Date(), days);
  
  return records
    .filter(record => isAfter(new Date(record.recordTime), cutOffDate))
    .sort((a, b) => new Date(a.recordTime).getTime() - new Date(b.recordTime).getTime())
    .map(record => ({
      date: format(new Date(record.recordTime), 'MM/dd'),
      fullDate: format(new Date(record.recordTime), 'yyyy年MM月dd日 HH:mm'),
      value: record.value,
      isInRange: record.isInRange
    }));
}

/**
 * 过滤并格式化血压数据用于图表展示
 */
export function prepareBPChartData(records: BloodPressureRecord[], days: number) {
  const cutOffDate = subDays(new Date(), days);

  return records
    .filter(record => isAfter(new Date(record.recordTime), cutOffDate))
    .sort((a, b) => new Date(a.recordTime).getTime() - new Date(b.recordTime).getTime())
    .map(record => ({
      date: format(new Date(record.recordTime), 'MM/dd'),
      fullDate: format(new Date(record.recordTime), 'yyyy年MM月dd日 HH:mm'),
      systolic: record.systolic,
      diastolic: record.diastolic,
      heartRate: record.heartRate
    }));
}

/**
 * 过滤并格式化心率数据 (新增)
 */
export function prepareHeartRateChartData(records: HeartRateRecord[], days: number) {
  const cutOffDate = subDays(new Date(), days);

  return records
    .filter(record => isAfter(new Date(record.recordTime), cutOffDate))
    .sort((a, b) => new Date(a.recordTime).getTime() - new Date(b.recordTime).getTime())
    .map(record => ({
      date: format(new Date(record.recordTime), 'MM/dd'),
      fullDate: format(new Date(record.recordTime), 'yyyy年MM月dd日 HH:mm'),
      bpm: record.bpm,
      status: record.status
    }));
}

/**
 * 生成当月每一天的服药依从性数据
 */
export function getMonthlyAdherenceData(
  logs: MedicationLog[], 
  medications: Medication[], 
  currentMonth: Date
) {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const today = new Date();

  const dailyTotalScheduled = medications.length;

  return days.map(day => {
    const isFuture = isAfter(startOfDay(day), endOfDay(today));
    
    if (isFuture) {
      return {
        date: day,
        dayOfMonth: format(day, 'd'),
        rate: null,
        status: 'future'
      };
    }

    const dayLogs = logs.filter(log => isSameDay(new Date(log.scheduledTime), day) && log.taken);
    const takenCount = dayLogs.length;
    const rate = dailyTotalScheduled === 0 ? 0 : (takenCount / dailyTotalScheduled) * 100;

    let status = 'low';
    if (rate === 100) status = 'perfect';
    else if (rate >= 50) status = 'medium';

    return {
      date: day,
      dayOfMonth: format(day, 'd'),
      rate: Math.min(rate, 100),
      status
    };
  });
}