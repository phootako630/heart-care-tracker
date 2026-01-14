import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { HeartRateRecord } from '../types';

export function useHeartRateRecords() {
  const [records, setRecords] = useState<HeartRateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRecords([]);
        return;
      }

      const { data, error } = await supabase
        .from('heart_rate_records')
        .select('*')
        .eq('user_id', user.id)
        .order('record_time', { ascending: false })
        .limit(10);

      if (error) {
        console.warn("Could not fetch heart rate records", error);
        return;
      }

      if (data) {
        const formattedData: HeartRateRecord[] = data.map(item => ({
          id: item.id,
          bpm: item.bpm,
          recordTime: new Date(item.record_time),
          status: item.bpm > 100 ? 'fast' : item.bpm < 60 ? 'slow' : 'normal',
          note: item.note
        }));
        setRecords(formattedData);
      }
    } catch (error) {
      console.error("Error fetching heart rate records:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (bpm: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase.from('heart_rate_records').insert({
        user_id: user.id,
        bpm,
        record_time: new Date().toISOString(),
        note: ''
      });

      if (error) throw error;
      
      await fetchRecords();
      return true;
    } catch (error) {
      console.error("Error adding heart rate record:", error);
      return false;
    }
  };

  return { records, loading, addRecord };
}