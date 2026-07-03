import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAILS = [
  'ianochiengai@gmail.com',
  'murimiwambuim@gmail.com',
  'nderitu.suzanne@gmail.com',
  'dylangathia@gmail.com',
  'sheilakamau0@gmail.com',
];

async function promoteAdmins() {
  console.log('Fetching users from auth...');
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Failed to list users:', listError.message);
    process.exit(1);
  }

  console.log(`Found ${users.length} total users in auth.`);

  for (const user of users) {
    if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      console.log(`Promoting ${user.email} (ID: ${user.id}) to admin...`);
      
      // 1. Ensure profile exists and has role 'admin'
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error(`Error fetching profile for ${user.email}:`, fetchError.message);
        continue;
      }

      if (!profile) {
        console.log(`No profile row found for ${user.email}. Creating one...`);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            role: 'admin',
            joined_at: new Date().toISOString()
          });
        if (insertError) {
          console.error(`Failed to create admin profile for ${user.email}:`, insertError.message);
        } else {
          console.log(`Admin profile created for ${user.email}`);
        }
      } else if (profile.role !== 'admin') {
        console.log(`Updating profile role for ${user.email} from '${profile.role}' to 'admin'...`);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        if (updateError) {
          console.error(`Failed to update profile role for ${user.email}:`, updateError.message);
        } else {
          console.log(`Profile role updated to admin for ${user.email}`);
        }
      } else {
        console.log(`${user.email} already has admin profile role.`);
      }
    }
  }
}

promoteAdmins().catch(console.error);
