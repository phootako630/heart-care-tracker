import { createClient } from '@supabase/supabase-js';

// Supabase 配置
// Vite 项目中使用 import.meta.env 获取环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);