import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Medication } from '../types';

const DEMO_USER_ID = "demo-user-1";

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', DEMO_USER_ID);

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted: Medication[] = data.map(m => ({
            id: m.id,
            drugName: m.drug_name,
            dosage: m.dosage,
            scheduleTime: m.schedule_time,
            reminderEnabled: m.reminder_enabled
          }));
          setMedications(formatted);
        } else {
          // 如果数据库为空，提供模拟数据（演示用）
          setMedications([
            { id: '1', drugName: '华法林', dosage: '3mg (1片)', scheduleTime: '14:00', reminderEnabled: true },
            { id: '2', drugName: '倍他乐克', dosage: '25mg (半片)', scheduleTime: '08:00', reminderEnabled: true },
          ]);
        }
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  return { medications, loading };
}