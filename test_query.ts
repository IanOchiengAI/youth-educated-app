import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('mentor_profiles').select(`
            id,
            bio,
            expertise,
            avatar_url,
            county,
            profiles:id (
              name
            )
          `).eq('is_verified', true);
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
