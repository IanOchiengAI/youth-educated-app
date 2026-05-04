import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Import data
import { MODULES } from '../src/data/modules';
import { LIFEKIT_ARTICLES } from '../src/data/lifekit';
import { OPPORTUNITIES } from '../src/data/opportunities';
import { CAREER_QUESTIONS } from '../src/data/careerQuestions';

// Load env
dotenv.config({ path: resolve(__dirname, '../.env.local') });

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
    const { lessons, ...moduleData } = mod;
    
    // Upsert Module
    const { error: modErr } = await supabase.from('modules').upsert({
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description,
      points: moduleData.points,
      duration: moduleData.duration,
      category: moduleData.category,
      tier_requirement: moduleData.tierRequirement,
      premium: moduleData.premium,
      is_published: true
    });
    if (modErr) console.error(`Failed to insert module ${mod.id}:`, modErr);

    // Upsert Lessons
    for (const [idx, lesson] of lessons.entries()) {
      const { error: lesErr } = await supabase.from('lessons').upsert({
        id: lesson.id,
        module_id: mod.id,
        title: lesson.title,
        type: lesson.type,
        duration: lesson.duration,
        content: lesson.content,
        quiz_data: lesson.quiz,
        sort_order: idx
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
      category: article.category,
      min_age: article.minAge,
      max_age: article.maxAge,
      read_time: article.readTime,
      content: article.content,
      tags: article.tags,
      is_premium: article.isPremium || false
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

  console.log('✅ Seeding complete!');
}

seed().catch(console.error);
