import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { UserProfile, INRRecord, BloodPressureRecord, Medication } from '../types';

/**
 * 生成健康数据 PDF 报告
 * 注意：jsPDF 默认不支持中文，实际项目中需要 addFont 引入中文字体文件 (.ttf)
 */
export async function generateHealthReport(
  profile: UserProfile | null,
  inrRecords: INRRecord[],
  bpRecords: BloodPressureRecord[],
  medications: Medication[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // 辅助函数：添加文本行
  const addLine = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont(undefined, isBold ? 'bold' : 'normal');
    
    // 简单的文本自动换行处理
    const splitText = doc.splitTextToSize(text, pageWidth - 40);
    doc.text(splitText, 20, yPos);
    yPos += (splitText.length * fontSize * 0.5) + 5;
  };

  // --- 1. 标题 ---
  addLine('Health Data Report', 24, true);
  addLine(`Generated Date: ${format(new Date(), 'yyyy-MM-dd')}`, 12);
  yPos += 10;

  // --- 2. 患者信息 ---
  if (profile) {
    addLine('Patient Profile', 16, true);
    addLine(`Name: ${profile.name}`);
    addLine(`Phone: ${profile.phone}`);
    if (profile.surgeryDate) {
      addLine(`Surgery Date: ${format(profile.surgeryDate, 'yyyy-MM-dd')}`);
    }
    yPos += 5;
  }

  // --- 3. INR 记录概要 ---
  addLine('INR Records (Recent)', 16, true);
  if (inrRecords.length > 0) {
    const avgINR = inrRecords.reduce((acc, curr) => acc + curr.value, 0) / inrRecords.length;
    addLine(`Total Records: ${inrRecords.length}`);
    addLine(`Average INR: ${avgINR.toFixed(2)}`);
    // 列出最近 5 条
    inrRecords.slice(0, 5).forEach(r => {
      addLine(`${format(r.recordTime, 'MM-dd HH:mm')} - Value: ${r.value} ${r.isInRange ? '(OK)' : '(Attention)'}`, 10);
    });
  } else {
    addLine('No INR records found.', 10);
  }
  yPos += 5;

  // --- 4. 血压记录概要 ---
  addLine('Blood Pressure Records (Recent)', 16, true);
  if (bpRecords.length > 0) {
    bpRecords.slice(0, 5).forEach(r => {
      addLine(`${format(r.recordTime, 'MM-dd HH:mm')} - ${r.systolic}/${r.diastolic} mmHg`, 10);
    });
  } else {
    addLine('No BP records found.', 10);
  }
  yPos += 5;

  // --- 5. 用药清单 ---
  addLine('Medication List', 16, true);
  if (medications.length > 0) {
    medications.forEach(m => {
      addLine(`- ${m.drugName} (${m.dosage}) @ ${m.scheduleTime}`, 10);
    });
  } else {
    addLine('No medications listed.', 10);
  }

  // 保存文件
  doc.save(`Health_Report_${format(new Date(), 'yyyyMMdd')}.pdf`);
}