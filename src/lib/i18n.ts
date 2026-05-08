/**
 * i18n — Lightweight translation system for Youth Educated
 * ----------------------------------------------------------
 * No react-i18next. No formatjs. Just a clean Record and a
 * helper function — exactly as a Mombasa 14-year-old expects.
 *
 * Built by Bi Zawadi – proper Kiswahili, not Google Translate.
 */

export type Language = 'English' | 'Kiswahili';

const translations: Record<string, Record<Language, string>> = {
  /* ── Navigation ────────────────────────────────────────── */
  'nav.home':        { English: 'Home',        Kiswahili: 'Nyumbani' },
  'nav.lifekit':     { English: 'Life Kit',    Kiswahili: 'Mfuko wa Maisha' },
  'nav.chat':        { English: 'Chat',        Kiswahili: 'Soga' },
  'nav.circles':     { English: 'Circles',     Kiswahili: 'Vikundi' },
  'nav.mentor':      { English: 'Mentor',      Kiswahili: 'Mshauri' },
  'nav.ask_mentor':  { English: 'Ask Mentor',  Kiswahili: 'Uliza Mshauri' },
  'nav.calendar':    { English: 'Calendar',    Kiswahili: 'Kalenda' },
  'nav.mypanel':     { English: 'My Panel',    Kiswahili: 'Paneli Yangu' },
  'nav.admin':       { English: 'Admin',       Kiswahili: 'Msimamizi' },

  /* ── Dashboard ─────────────────────────────────────────── */
  'dashboard.greeting':  { English: 'Welcome back',              Kiswahili: 'Karibu tena' },
  'dashboard.tagline':   { English: 'A mentor in every pocket',  Kiswahili: 'Mshauri mfukoni mwako' },
  'dashboard.streak':    { English: 'Day Streak',                Kiswahili: 'Siku Mfululizo' },
  'dashboard.points':    { English: 'Points',                    Kiswahili: 'Pointi' },
  'dashboard.mood':      { English: 'How are you today?',        Kiswahili: 'Habari yako leo?' },
  'dashboard.ready':     { English: 'Ready for your next step?', Kiswahili: 'Tayari kwa hatua yako?' },
  'dashboard.mood_checkin': { English: 'Mood Check-in',          Kiswahili: 'Hali ya Moyo' },
  'dashboard.earn_points': { English: 'Earn +10 points daily.',  Kiswahili: 'Pata pointi +10 kila siku.' },
  'dashboard.current_tier': { English: 'Current Tier',           Kiswahili: 'Kiwango Sasa' },
  'dashboard.total_points': { English: 'Total Points',           Kiswahili: 'Jumla ya Pointi' },
  'dashboard.circle_activity': { English: 'Circle Activity',     Kiswahili: 'Shughuli za Vikundi' },
  'dashboard.view_all': { English: 'View All',                   Kiswahili: 'Ona Zote' },
  'dashboard.continue_learning': { English: 'Continue Learning', Kiswahili: 'Endelea Kujifunza' },
  'dashboard.from_lifekit': { English: 'From the Life Kit',      Kiswahili: 'Kutoka Mfuko wa Maisha' },
  'dashboard.see_all': { English: 'See all',                     Kiswahili: 'Ona zote' },
  'dashboard.top_cohort': { English: 'Top of the Cohort',        Kiswahili: 'Bora Kundi' },
  'dashboard.no_recent_activity': { English: 'No recent activity. Start the conversation!', Kiswahili: 'Hakuna shughuli hivi karibuni. Anza mazungumzo!' },

  /* ── Quick Actions ─────────────────────────────────────── */
  'action.ask_amara': { English: 'Ask Amara',    Kiswahili: 'Uliza Amara' },
  'action.ask_ai':    { English: 'Ask AI',       Kiswahili: 'Uliza AI' },
  'action.career':    { English: 'Career Map',   Kiswahili: 'Ramani ya Kazi' },
  'action.opps':      { English: 'Opps Board',   Kiswahili: 'Fursa' },
  'action.goals':     { English: 'My Goals',     Kiswahili: 'Malengo Yangu' },
  'action.mentor':    { English: 'Ask Mentor',   Kiswahili: 'Uliza Mshauri' },
  'action.learn':     { English: 'Life Kit',     Kiswahili: 'Mfuko wa Maisha' },
  'action.circles':   { English: 'Circles',      Kiswahili: 'Vikundi' },

  /* ── Premium / YE+ ─────────────────────────────────────── */
  'premium.badge':    { English: 'YE+',          Kiswahili: 'YE+' },
  'premium.locked':   { English: 'Premium',      Kiswahili: 'Premium' },
  'premium.upgrade':  { English: 'Upgrade to YE+', Kiswahili: 'Panda daraja la YE+' },

  /* ── Common Buttons ────────────────────────────────────── */
  'btn.continue':  { English: 'Continue',  Kiswahili: 'Endelea' },
  'btn.back':      { English: 'Back',      Kiswahili: 'Rudi' },
  'btn.save':      { English: 'Save',      Kiswahili: 'Hifadhi' },
  'btn.signout':   { English: 'Sign Out',  Kiswahili: 'Toka' },

  /* ── Profile Tabs ──────────────────────────────────────── */
  'profile.overview': { English: 'Overview', Kiswahili: 'Muhtasari' },
  'profile.wellness': { English: 'Wellness', Kiswahili: 'Afya' },
  'profile.badges':   { English: 'Badges',   Kiswahili: 'Beji' },
  'profile.settings': { English: 'Setup',    Kiswahili: 'Mipangilio' },

  /* ── Header / App Identity ─────────────────────────────── */
  'app.name':         { English: 'Youth Educated',     Kiswahili: 'Youth Educated' },
  'app.name_full':    { English: 'Youth Educated App', Kiswahili: 'Youth Educated App' },
  'app.mentor_badge': { English: 'Mentor',             Kiswahili: 'Mshauri' },

  /* ── Offline Banner ────────────────────────────────────── */
  'app.offline':      { English: 'Offline Mode',       Kiswahili: 'Hali ya Nje ya Mtandao' },

  /* ── Learn Page (Life Kit) ─────────────────────────────── */
  'learn.title': { English: 'YE+ Life Kit', Kiswahili: 'YE+ Mfuko wa Maisha' },
  'learn.subtitle': { English: 'Guides and stories for real life', Kiswahili: 'Miongozo na hadithi za maisha halisi' },
  'learn.search_placeholder': { English: 'Search articles...', Kiswahili: 'Tafuta makala...' },
  'learn.no_articles': { English: 'No articles found', Kiswahili: 'Hakuna makala yaliyopatikana' },
  'learn.see_all_arrow': { English: 'See all →', Kiswahili: 'Ona zote →' },
  'learn.article_not_found': { English: 'Article not found', Kiswahili: 'Makala hayapatikani' },
  'learn.article_detail_back': { English: 'Back to Life Kit', Kiswahili: 'Rudi Mfuko wa Maisha' },
  'learn.content_coming_soon': { English: 'Content coming soon ✨', Kiswahili: 'Maudhui yanakuja hivi karibuni ✨' },

  /* ── Life Kit Categories ───────────────────────────────── */
  'category.all':            { English: 'All',           Kiswahili: 'Zote' },
  'category.mentor-stories': { English: 'Mentor Stories', Kiswahili: 'Hadithi za Washauri' },
  'category.school':         { English: 'School',        Kiswahili: 'Shule' },
  'category.mental-health':  { English: 'Mental Health', Kiswahili: 'Afya ya Akili' },
  'category.relationships':  { English: 'Relationships', Kiswahili: 'Uhusiano' },
  'category.safety':         { English: 'Safety',        Kiswahili: 'Usalama' },
  'category.future':         { English: 'Future',        Kiswahili: 'Hatima' },
  'category.money':          { English: 'Money',         Kiswahili: 'Fedha' },

  /* ── Life Kit Tags ─────────────────────────────────────── */
  'tag.Exams':        { English: 'Exams',        Kiswahili: 'Mitihani' },
  'tag.Friendship':   { English: 'Friendship',   Kiswahili: 'Urafiki' },
  'tag.Stress':       { English: 'Stress',       Kiswahili: 'Msongo' },
  'tag.Confidence':   { English: 'Confidence',   Kiswahili: 'Kujiamini' },
  'tag.Money':        { English: 'Money',        Kiswahili: 'Fedha' },
  'tag.Career':       { English: 'Career',       Kiswahili: 'Kazi' },
  'tag.MentalHealth': { English: 'Mental Health', Kiswahili: 'Afya ya Akili' },
  'tag.Relationships': { English: 'Relationships', Kiswahili: 'Uhusiano' },
  'tag.School':       { English: 'School',       Kiswahili: 'Shule' },
  'tag.Safety':       { English: 'Safety',       Kiswahili: 'Usalama' },
  'tag.Future':       { English: 'Future',       Kiswahili: 'Hatima' },
  'tag.Decisions':    { English: 'Decisions',    Kiswahili: 'Uamuzi' },
  'tag.Technology':   { English: 'Technology',   Kiswahili: 'Teknolojia' },

  /* ── Chat Page ─────────────────────────────────────────── */
  'chat.amara_greeting': { English: 'Talk to Amara...', Kiswahili: 'Soga na Amara...' },
  'chat.online': { English: 'Online', Kiswahili: 'Kwenye Mtandao' },
  'chat.offline_mode': { English: 'Offline Mode', Kiswahili: 'Nje ya Mtandao' },
  'chat.action_modes': { English: 'Action Modes', Kiswahili: 'Njia za Kutenda' },
  'chat.roleplay_scenarios': { English: 'Roleplay Scenarios', Kiswahili: 'Mazingira ya Kuigiza' },
  'chat.socratic_quiz': { English: 'Socratic Quiz', Kiswahili: 'Chemsha Bongo' },
  'chat.socratic_desc': { English: 'Test your knowledge with Amara.', Kiswahili: 'Pima maarifa yako na Amara.' },
  'chat.exit_mode': { English: 'Exit Mode', Kiswahili: 'Toka kwenye Njia' },
  'chat.locked_safety': { English: 'Chat disabled for your safety. Please seek help.', Kiswahili: 'Soga imezimwa kwa usalama wako. Tafadhali tafuta usaidizi.' },

  /* ── Voice Chat ───────────────────────────────────────── */
  'voice.title': { English: 'Voice Chat', Kiswahili: 'Soga ya Sauti' },
  'voice.subtitle': { English: "Talk to Amara naturally. She's listening.", Kiswahili: 'Ongea na Amara kawaida. Anasikiliza.' },
  'voice.listening': { English: 'Listening...', Kiswahili: 'Anasikiliza...' },
  'voice.thinking': { English: 'Thinking...', Kiswahili: 'Anatafakari...' },
  'voice.amara_active': { English: 'Amara Active', Kiswahili: 'Amara Yuko Tayari' },
  'voice.mic_error': { English: 'Microphone error. Please check permissions.', Kiswahili: 'Hitilafu ya kipaza sauti. Tafadhali angalia ruhusa.' },
  'voice.unsupported': { English: 'Voice recognition is not supported in this browser.', Kiswahili: 'Utambuzi wa sauti hautegemezwi katika kivinjari hiki.' },
  'voice.mic_denied': { English: 'Microphone permission denied. Please allow it in settings.', Kiswahili: 'Ruhusa ya kipaza sauti imekataliwa. Tafadhali ruhusu katika mipangilio.' },
  'voice.timeout': { English: 'Amara is taking too long to respond. Please try again.', Kiswahili: 'Amara anachukua muda mrefu kujibu. Tafadhali jaribu tena.' },
  'voice.network_error': { English: 'Could not reach Amara. Check your connection.', Kiswahili: 'Imeshindwa kufikia Amara. Angalia muunganisho wako.' },

  /* ── Onboarding ───────────────────────────────────────── */
  'onboarding.welcome': { English: 'Welcome to YE!', Kiswahili: 'Karibu YE!' },
  'onboarding.step_indicator': { English: 'Step', Kiswahili: 'Hatua ya' },
  'onboarding.of': { English: 'of', Kiswahili: 'kati ya' },
  'onboarding.mambo': { English: "Mambo! Let's get started.", Kiswahili: 'Mambo! Tuanze sasa.' },
  'onboarding.what_name': { English: "What's your name?", Kiswahili: 'Jina lako ni nani?' },
  'onboarding.enter_name': { English: 'Enter your name', Kiswahili: 'Andika jina lako' },
  'onboarding.tell_us_intro': { English: 'Tell us about yourself (optional)', Kiswahili: 'Tuambie kukuhusu (hiari)' },
  'onboarding.intro_placeholder': { English: 'Type or speak a short introduction…', Kiswahili: 'Andika au uongee utangulizi mfupi…' },
  'onboarding.pref_lang': { English: 'Preferred Language', Kiswahili: 'Lugha Unayopendelea' },
  'onboarding.how_old': { English: 'How old are you?', Kiswahili: 'Una umri gani?' },
  'onboarding.age_hint': { English: 'We use this to show you age-appropriate modules.', Kiswahili: 'Tunatumia hii kukuonyesha masomo yanayofaa umri wako.' },
  'onboarding.years_old': { English: 'years old', Kiswahili: 'miaka' },
  'onboarding.where_live': { English: 'Where do you live?', Kiswahili: 'Unaishi wapi?' },
  'onboarding.select_county': { English: 'Select your county', Kiswahili: 'Chagua kaunti yako' },
  'onboarding.choose_county': { English: 'Choose County', Kiswahili: 'Chagua Kaunti' },
  'onboarding.tell_about_self': { English: 'Tell us about yourself.', Kiswahili: 'Tuambie kukuhusu.' },
  'onboarding.gender_male': { English: 'Male', Kiswahili: 'Mwanaume' },
  'onboarding.gender_female': { English: 'Female', Kiswahili: 'Mwanamke' },
  'onboarding.gender_none': { English: 'Prefer not to say', Kiswahili: 'Napendelea kutosema' },
  'onboarding.what_goals': { English: 'What are your goals?', Kiswahili: 'Malengo yako ni yapi?' },
  'onboarding.goals_hint': { English: 'Pick up to 3 things you want to work on.', Kiswahili: 'Chagua hadi vitu 3 unavyotaka kufanyia kazi.' },
  'onboarding.safety': { English: 'Safety First', Kiswahili: 'Usalama Kwanza' },
  'onboarding.guardian_consent': { English: 'Parental / Guardian Consent', Kiswahili: 'Idhini ya Mzazi / Mlezi' },
  'onboarding.guardian_hint': { English: 'Because you are under 16, we need a guardian to approve your access.', Kiswahili: 'Kwa sababu una umri wa chini ya miaka 16, tunahitaji mlezi kuidhinisha ufikiaji wako.' },
  'onboarding.guardian_agree': { English: 'My guardian agrees to the terms of service.', Kiswahili: 'Mlezi wangu anakubaliana na masharti ya huduma.' },
  'onboarding.keep_safe': { English: 'Keep it safe.', Kiswahili: 'Baki salama.' },
  'onboarding.all_set': { English: "You're all set!", Kiswahili: 'Umekamilisha kila kitu!' },
  'onboarding.ready_journey': { English: 'Ready to start your journey with Amara?', Kiswahili: 'Uko tayari kuanza safari yako na Amara?' },
  'onboarding.complete': { English: 'Complete', Kiswahili: 'Kamilisha' },

  /* ── Opportunities ──────────────────────────────────────── */
  'opps.title': { English: 'Opportunities', Kiswahili: 'Fursa' },
  'opps.subtitle': { English: 'Growth & Funding', Kiswahili: 'Ukuaji & Ufadhili' },
  'opps.search': { English: 'Search programs, scholarships...', Kiswahili: 'Tafuta programu, ufadhili...' },
  'opps.merit_score': { English: 'Your Merit Score', Kiswahili: 'Alama Zako za Kustahili' },
  'opps.loading': { English: 'Loading Opportunities...', Kiswahili: 'Inapakia Fursa...' },
  'opps.apply_anytime': { English: 'Apply anytime', Kiswahili: 'Tuma maombi wakati wowote' },
  'opps.closing_soon': { English: 'Closing soon', Kiswahili: 'Inafungwa hivi karibuni' },
  'opps.days_left': { English: 'days left', Kiswahili: 'siku zimesalia' },

  /* ── CareerMapper ───────────────────────────────────────── */
  'career.title': { English: 'Career Map', Kiswahili: 'Ramani ya Kazi' },
  'career.subtitle': { English: 'Your Future Path', Kiswahili: 'Njia Yako ya Hatima' },
  'career.discover': { English: 'Discover your ideal path', Kiswahili: 'Gundua njia yako bora' },
  'career.match': { English: 'Match', Kiswahili: 'Mechi' },
  'career.demand': { English: 'Demand', Kiswahili: 'Mahitaji' },

  /* ── Goals ──────────────────────────────────────────────── */
  'goals.title': { English: 'My Goals', Kiswahili: 'Malengo Yangu' },
  'goals.subtitle': { English: 'Track Your Progress', Kiswahili: 'Fuatilia Maendeleo Yako' },
  'goals.add_new': { English: 'Add New Goal', Kiswahili: 'Ongeza Lengo Jipya' },
  'goals.completed': { English: 'Completed', Kiswahili: 'Imekamilika' },

  /* ── Mentor Dashboard ───────────────────────────────────── */
  'mentor.console': { English: 'Mentor Console', Kiswahili: 'Dashibodi ya Mshauri' },
  'mentor.empowering': { English: 'Empowering your students today.', Kiswahili: 'Kuwawezesha wanafunzi wako leo.' },
  'mentor.students': { English: 'Students', Kiswahili: 'Wanafunzi' },
  'mentor.sessions': { English: 'Sessions', Kiswahili: 'Vipindi' },
  'mentor.impact': { English: 'Impact', Kiswahili: 'Athari' },
  'mentor.portfolio': { English: 'My Portfolio', Kiswahili: 'Wanafunzi Wangu' },
  'mentor.recent_sync': { English: 'Recent Sync', Kiswahili: 'Usawazishaji wa Hivi Karibuni' },
  'mentor.just_now': { English: 'Just Now', Kiswahili: 'Sasa Hivi' },
  'mentor.no_students': { English: 'No matched students yet.', Kiswahili: 'Hakuna wanafunzi waliolinganishwa bado.' },
};

/**
 * Translate a key into the target language.
 * Falls back to the key itself when no match is found —
 * this keeps the UI readable even if a key is missing.
 */
export function t(key: string, lang: Language = 'English'): string {
  return translations[key]?.[lang] ?? key;
}
