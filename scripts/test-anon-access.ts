import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyFixes() {
  console.log('Testing RLS policies with anon key...');
  const anonClient = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY!);
  
  const { data, error } = await anonClient
    .from('mentor_profiles')
    .select('id, bio, expertise, profiles!inner ( name, role )')
    .eq('is_verified', true);
    
  console.log('Anon fetch result:', data?.length || 0, 'records');
  if (error) console.error('Error:', error);
}

applyFixes().catch(console.error);
