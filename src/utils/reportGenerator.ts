import { UserProfile, INRRecord, BloodPressureRecord, Medication } from '../types';

/**
 * 触发浏览器原生打印功能生成报告
 * 这是解决前端 PDF 中文乱码最稳健、最轻量的方法。
 * 配合 index.css 中的 @media print 样式，可以生成整洁的 PDF。
 */
export async function generateHealthReport(
  profile: UserProfile | null,
  inrRecords: INRRecord[],
  bpRecords: BloodPressureRecord[],
  medications: Medication[]
) {
  // 简单的确认，防止误触
  // 在移动端，window.print() 通常会调起“打印/另存为 PDF”的系统界面
  try {
    window.print();
    return Promise.resolve(true);
  } catch (e) {
    console.error("打印调用失败", e);
    return Promise.reject(e);
  }
}