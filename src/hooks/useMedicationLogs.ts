import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { MedicationLog } from '../types';

export function useMedicationLogs() {
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  
  const fetchLogs = useCallback(async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_time', startOfDay.toISOString())
        .lte('scheduled_time', endOfDay.toISOString());

      if (error) throw error;

      if (data) {
        const formatted: MedicationLog[] = data.map(log => ({
          id: log.id,
          medicationId: log.medication_id,
          scheduledTime: new Date(log.scheduled_time),
          actualTime: log.actual_time ? new Date(log.actual_time) : undefined,
          taken: log.taken
        }));
        setLogs(formatted);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // 打卡服药
  const logMedication = async (medicationId: string, scheduledTimeStr: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const [hours, minutes] = scheduledTimeStr.split(':').map(Number);
      const scheduledDate = new Date();
      scheduledDate.setHours(hours, minutes, 0, 0);

      const { error } = await supabase.from('medication_logs').insert({
        user_id: user.id,
        medication_id: medicationId,
        scheduled_time: scheduledDate.toISOString(),
        actual_time: new Date().toISOString(),
        taken: true
      });

      if (error) throw error;
      await fetchLogs();
    } catch (error) {
      console.error("Error logging medication:", error);
    }
  };

  // 取消打卡
  const removeLog = async (logId: string) => {
    try {
      // 简单起见，这里假设 RLS 策略会阻止删除不属于自己的记录
      const { error } = await supabase
        .from('medication_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      await fetchLogs();
    } catch (error) {
      console.error("Error removing log:", error);
    }
  };

  return { logs, logMedication, removeLog };
}