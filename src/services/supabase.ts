import { createClient } from '@supabase/supabase-js';

// Supabase 配置
// 请在 Supabase 控制台获取 URL 和 Anon Key
// 在实际项目中请使用 import.meta.env.VITE_SUPABASE_URL 等环境变量
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);