import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Medication } from '../types';

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setMedications([]);
          return;
        }

        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id);

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
          setMedications([]);
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