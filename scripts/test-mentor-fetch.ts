import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing mentor fetch with anon key...');
  const { data, error } = await supabase
    .from('mentor_profiles')
    .select('id, bio, expertise, avatar_url, county, profiles ( name )')
    .eq('is_verified', true);
    
  if (error) {
    console.error('Error fetching mentors:', error);
  } else {
    console.log('Mentors fetched:', data?.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

test();
