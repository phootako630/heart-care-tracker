import { format, isAfter, subDays, startOfDay, endOfDay, isSameDay, getDaysInMonth, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { INRRecord, BloodPressureRecord, Medication, MedicationLog } from '../types';

/**
 * 过滤并格式化 INR 数据用于图表展示
 * @param records 原始 INR 记录
 * @param days 需展示的天数范围 (7, 30, 90)
 */
export function prepareINRChartData(records: INRRecord[], days: number) {
  const cutOffDate = subDays(new Date(), days);
  
  // 1. 过滤时间范围内的记录
  // 2. 按时间升序排列（图表从左到右）
  // 3. 格式化数据
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
 * 生成当月每一天的服药依从性数据
 * @param logs 服药记录
 * @param medications 药品清单 (用于计算每天应该吃多少次)
 * @param currentMonth 当前展示的月份日期对象
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

  // 计算每天理论上需要服用的总次数
  // 注意：这里简化处理，假设所有药每天都要吃一次。
  // 实际场景可能需要解析 scheduleTime 或频率
  const dailyTotalScheduled = medications.length;

  return days.map(day => {
    const isFuture = isAfter(startOfDay(day), endOfDay(today));
    
    // 如果是未来日期，直接返回 null
    if (isFuture) {
      return {
        date: day,
        dayOfMonth: format(day, 'd'),
        rate: null,
        status: 'future'
      };
    }

    // 找到这一天的所有打卡记录
    const dayLogs = logs.filter(log => isSameDay(new Date(log.scheduledTime), day) && log.taken);
    
    // 计算完成率
    const takenCount = dayLogs.length;
    // 防止除以0
    const rate = dailyTotalScheduled === 0 ? 0 : (takenCount / dailyTotalScheduled) * 100;

    let status = 'low';
    if (rate === 100) status = 'perfect';
    else if (rate >= 50) status = 'medium';

    return {
      date: day,
      dayOfMonth: format(day, 'd'),
      rate: Math.min(rate, 100), // 封顶 100%
      status
    };
  });
}