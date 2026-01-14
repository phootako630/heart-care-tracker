import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { BloodPressureRecord } from '../types';

const DEMO_USER_ID = "demo-user-1";

export function useBloodPressureRecords() {
  const [records, setRecords] = useState<BloodPressureRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blood_pressure_records')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('record_time', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        const formattedData: BloodPressureRecord[] = data.map(item => ({
          id: item.id,
          systolic: item.systolic,
          diastolic: item.diastolic,
          heartRate: item.heart_rate,
          position: item.position as 'sitting' | 'lying',
          recordTime: new Date(item.record_time)
        }));
        setRecords(formattedData);
      }
    } catch (error) {
      console.error("Error fetching BP records:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (systolic: number, diastolic: number, heartRate: number | undefined, position: 'sitting' | 'lying') => {
    try {
      const { error } = await supabase.from('blood_pressure_records').insert({
        user_id: DEMO_USER_ID,
        systolic,
        diastolic,
        heart_rate: heartRate,
        position,
        record_time: new Date().toISOString()
      });

      if (error) throw error;
      
      await fetchRecords();
      return true;
    } catch (error) {
      console.error("Error adding BP record:", error);
      return false;
    }
  };

  return { records, loading, addRecord };
}