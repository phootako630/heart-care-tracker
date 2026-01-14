import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { INRRecord } from '../types';

const DEMO_USER_ID = "demo-user-1";

export function useINRRecords() {
  const [records, setRecords] = useState<INRRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inr_records')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('record_time', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        // 转换数据库下划线字段到前端驼峰字段
        const formattedData: INRRecord[] = data.map(item => ({
          id: item.id,
          value: item.value,
          recordTime: new Date(item.record_time),
          isInRange: item.is_in_range,
          targetRange: [item.target_range_low, item.target_range_high],
          note: item.note
        }));
        setRecords(formattedData);
      }
    } catch (error) {
      console.error("Error fetching INR records:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (value: number) => {
    try {
      const targetRange = [2.0, 3.0];
      const isInRange = value >= targetRange[0] && value <= targetRange[1];

      const { error } = await supabase.from('inr_records').insert({
        user_id: DEMO_USER_ID,
        value,
        record_time: new Date().toISOString(),
        is_in_range: isInRange,
        target_range_low: targetRange[0],
        target_range_high: targetRange[1],
        note: ''
      });

      if (error) throw error;
      
      // 插入成功后刷新列表
      await fetchRecords();
      return true;
    } catch (error) {
      console.error("Error adding INR record:", error);
      return false;
    }
  };

  return { records, loading, addRecord };
}