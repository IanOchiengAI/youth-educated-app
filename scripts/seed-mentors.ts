import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { FALLBACK_MENTORS } from '../src/data/mentors';

// Load env (ESM-compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need a service role key to bypass RLS

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedMentors() {
  console.log('🌱 Starting mentors seed...');

  for (const mentor of FALLBACK_MENTORS) {
    const email = `${mentor.id}@example.com`;
    
    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let userId = existingUsers?.users.find(u => u.email === email)?.id;

    if (!userId) {
      console.log(`Creating user for ${mentor.name}...`);
      // Create user
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true,
      });
      if (authErr) {
        console.error(`Failed to create auth user for ${mentor.name}:`, authErr);
        continue;
      }
      userId = authData.user.id;
    }

    if (userId) {
      console.log(`Updating profile for ${mentor.name}...`);
      // Update profile
      await supabase.from('profiles').update({
        name: mentor.name,
        role: 'mentor',
        county: mentor.county,
        onboarding_completed: true,
      }).eq('id', userId);

      // Upsert mentor profile
      const { error: mentorErr } = await supabase.from('mentor_profiles').upsert({
        id: userId,
        specialization: mentor.expertise[0] || 'General',
        bio: mentor.bio,
        expertise: mentor.expertise,
        county: mentor.county,
        avatar_url: mentor.avatarUrl || mentor.icon,
        is_verified: true,
      });

      if (mentorErr) {
        console.error(`Failed to insert mentor profile for ${mentor.name}:`, mentorErr);
      } else {
        console.log(`Successfully seeded ${mentor.name}`);
      }
    }
  }

  console.log('✅ Mentors seeding complete!');
}

seedMentors().catch(console.error);
