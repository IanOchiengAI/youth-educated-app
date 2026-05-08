import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Import data
import { MODULES } from '../src/data/modules';
import { LIFEKIT_ARTICLES } from '../src/data/lifekit';
import { OPPORTUNITIES } from '../src/data/opportunities';
import { CAREER_QUESTIONS } from '../src/data/careerQuestions';
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

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Modules & Lessons
  console.log('Seeding Modules & Lessons...');
  for (const mod of MODULES) {
    const { content, ...moduleData } = mod;

    const { error: modErr } = await supabase.from('modules').upsert({
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description,
      icon: moduleData.icon,
      min_age: moduleData.min_age,
      is_sensitive: moduleData.is_sensitive,
      brothers_keepers_variant: moduleData.brothers_keepers_variant,
      lessons: moduleData.lessons,
      duration: moduleData.duration,
      competency: moduleData.competency,
      difficulty: moduleData.difficulty,
      is_published: true,
    });
    if (modErr) console.error(`Failed to insert module ${mod.id}:`, modErr);

    for (const [idx, lesson] of content.entries()) {
      const { error: lesErr } = await supabase.from('lessons').upsert({
        id: lesson.id,
        module_id: mod.id,
        title: lesson.title,
        duration: lesson.duration,
        sections: lesson.sections,
        sort_order: idx,
      });
      if (lesErr) console.error(`Failed to insert lesson ${lesson.id}:`, lesErr);
    }
  }

  // 2. LifeKit Articles
  console.log('Seeding LifeKit Articles...');
  for (const article of LIFEKIT_ARTICLES) {
    const { error } = await supabase.from('lifekit_articles').upsert({
      id: article.id,
      title: article.title,
      title_sw: article.title_sw,
      category: article.category,
      tags: article.tags,
      emoji: article.emoji,
      read_time: article.readTime,
      body: article.body,
      body_sw: article.body_sw,
      month: article.month ?? null,
    });
    if (error) console.error(`Failed to insert lifekit article ${article.id}:`, error);
  }

  // 3. Opportunities
  console.log('Seeding Opportunities...');
  for (const opp of OPPORTUNITIES) {
    const { error } = await supabase.from('opportunities').upsert({
      id: opp.id,
      title: opp.title,
      provider: opp.provider,
      description: opp.description,
      category: opp.category,
      points_required: opp.pointsRequired,
      deadline: opp.deadline,
      gender: opp.gender,
      min_age: opp.minAge,
      max_age: opp.maxAge,
      counties: opp.counties,
      is_published: true
    });
    if (error) console.error(`Failed to insert opportunity ${opp.id}:`, error);
  }

  // 4. Career Questions
  console.log('Seeding Career Questions...');
  for (const [idx, q] of CAREER_QUESTIONS.entries()) {
    const { error } = await supabase.from('career_questions').upsert({
      id: q.id,
      text: q.text,
      options: q.options,
      sort_order: idx
    });
    if (error) console.error(`Failed to insert career question ${q.id}:`, error);
  }

  // 5. Mentors
  console.log('Seeding Mentors...');
  for (const mentor of FALLBACK_MENTORS) {
    const email = `${mentor.id}@example.com`;
    
    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let userId = existingUsers?.users.find(u => u.email === email)?.id;

    if (!userId) {
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

      if (mentorErr) console.error(`Failed to insert mentor profile for ${mentor.name}:`, mentorErr);
    }
  }

  console.log('✅ Seeding complete!');
}

seed().catch(console.error);
