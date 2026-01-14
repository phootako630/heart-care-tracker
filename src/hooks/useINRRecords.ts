import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { INRRecord } from '../types';

export function useINRRecords() {
  const [records, setRecords] = useState<INRRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRecords([]);
        return;
      }

      // 计算90天前的日期
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data, error } = await supabase
        .from('inr_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('record_time', ninetyDaysAgo.toISOString()) // 获取最近90天
        .order('record_time', { ascending: false });

      if (error) throw error;

      if (data) {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const targetRange = [2.0, 3.0];
      const isInRange = value >= targetRange[0] && value <= targetRange[1];

      const { error } = await supabase.from('inr_records').insert({
        user_id: user.id,
        value,
        record_time: new Date().toISOString(),
        is_in_range: isInRange,
        target_range_low: targetRange[0],
        target_range_high: targetRange[1],
        note: ''
      });

      if (error) throw error;
      
      await fetchRecords();
      return true;
    } catch (error) {
      console.error("Error adding INR record:", error);
      return false;
    }
  };

  return { records, loading, addRecord };
}