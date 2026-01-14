// ---------------------------------------------------------------------------
// 核心数据类型定义
// 针对心脏瓣膜置换术后患者管理系统
// ---------------------------------------------------------------------------

// INR (国际标准化比值) 记录
// 关键指标：用于监测抗凝药物（如华法林）的效果
export interface INRRecord {
  id: string;
  value: number;            // 具体数值，如 2.5
  recordTime: Date;         // 记录时间
  note?: string;            // 备注（如：忘记服药、饮食异常）
  isInRange: boolean;       // 是否在目标范围内（用于UI快速标红/标绿）
  targetRange: [number, number]; // 记录当时的参考范围，如 [2.0, 3.0]
}

// 血压记录
// 基础生命体征
export interface BloodPressureRecord {
  id: string;
  systolic: number;         // 收缩压（高压）
  diastolic: number;        // 舒张压（低压）
  heartRate?: number;       // 心率（次/分）
  recordTime: Date;         // 测量时间
  position: 'sitting' | 'lying'; // 测量体位：坐位/卧位
}

// 药品定义
// 用于管理患者的用药清单
export interface Medication {
  id: string;
  drugName: string;         // 药名（如：华法林）
  dosage: string;           // 剂量（如：3mg 或 1片）
  scheduleTime: string;     // 计划服用时间，格式 "HH:mm" (如 "08:00")
  reminderEnabled: boolean; // 是否开启提醒
}

// 服药日志
// 记录实际服药情况
export interface MedicationLog {
  id: string;
  medicationId: string;     // 关联的药品ID
  scheduledTime: Date;      // 计划服用日期时间
  actualTime?: Date;        // 实际服用日期时间
  taken: boolean;           // 是否已服用
}

// 用户档案
// 存储患者基本信息及医疗目标
export interface UserProfile {
  id: string;
  name: string;             // 姓名
  phone: string;            // 紧急联系电话
  targetINR: [number, number]; // 目标 INR 范围，如 [2.0, 3.0]
  targetBP: { 
    systolic: number; 
    diastolic: number; 
  }; // 目标血压上限
  surgeryDate?: Date;       // 手术日期
}
