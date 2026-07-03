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

  /* ── Learn Page ─────────────────────────────── */
  'learn.title': { English: 'Learn', Kiswahili: 'Jifunze' },
  'learn.subtitle': { English: 'Courses and guides for real life', Kiswahili: 'Kozi na miongozo ya maisha halisi' },
  'learn.courses_subtitle': { English: 'Offline courses for your next step', Kiswahili: 'Kozi za nje ya mtandao kwa hatua yako ijayo' },
  'learn.lifekit_subtitle': { English: 'Guides and stories for real life', Kiswahili: 'Miongozo na hadithi za maisha halisi' },
  'learn.tab_courses': { English: 'Courses', Kiswahili: 'Kozi' },
  'learn.tab_lifekit': { English: 'Life Kit', Kiswahili: 'Mfuko wa Maisha' },
  'learn.course_library': { English: 'Course Library', Kiswahili: 'Maktaba ya Kozi' },
  'learn.course_library_hint': { English: 'Built into the app for reliable offline learning.', Kiswahili: 'Zimo ndani ya app ili ujifunze hata bila mtandao.' },
  'learn.loading_courses': { English: 'Loading courses...', Kiswahili: 'Inapakia kozi...' },
  'learn.loading_articles': { English: 'Loading articles...', Kiswahili: 'Inapakia makala...' },
  'learn.no_courses': { English: 'No courses found', Kiswahili: 'Hakuna kozi zilizopatikana' },
  'learn.lesson': { English: 'lesson', Kiswahili: 'somo' },
  'learn.lessons': { English: 'lessons', Kiswahili: 'masomo' },
  'learn.free_badge': { English: 'Free', Kiswahili: 'Bure' },
  'learn.offline_badge': { English: 'Offline ready', Kiswahili: 'Tayari nje ya mtandao' },
  'learn.offline_short': { English: 'Offline', Kiswahili: 'Nje ya mtandao' },
  'learn.age_locked_badge': { English: 'Age locked', Kiswahili: 'Umri umefungwa' },
  'learn.age_locked_message': { English: 'Available from age {age}.', Kiswahili: 'Inapatikana kuanzia miaka {age}.' },
  'learn.progress': { English: 'Progress', Kiswahili: 'Maendeleo' },
  'learn.search_placeholder': { English: 'Search articles...', Kiswahili: 'Tafuta makala...' },
  'learn.no_articles': { English: 'No articles found', Kiswahili: 'Hakuna makala yaliyopatikana' },
  'learn.see_all_arrow': { English: 'See all →', Kiswahili: 'Ona zote →' },
  'learn.article_not_found': { English: 'Article not found', Kiswahili: 'Makala hayapatikani' },
  'learn.article_detail_back': { English: 'Back to Life Kit', Kiswahili: 'Rudi Mfuko wa Maisha' },
  'learn.content_coming_soon': { English: 'Content coming soon ✨', Kiswahili: 'Maudhui yanakuja hivi karibuni ✨' },

  /* ── Module View ─────────────────────────────── */
  'module.content_unavailable_title': { English: 'Course pack needed', Kiswahili: 'Pakiti ya kozi inahitajika' },
  'module.content_unavailable_body': { English: 'Connect to the internet to refresh your YE+ access and download this course pack.', Kiswahili: 'Unganisha intaneti ili kuthibitisha YE+ na kupakua pakiti hii ya kozi.' },

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
  'onboarding.guardian_phone': { English: 'Guardian phone', Kiswahili: 'Simu ya mlezi' },
  'onboarding.keep_safe': { English: 'Keep it safe.', Kiswahili: 'Baki salama.' },
  'onboarding.all_set': { English: "You're all set!", Kiswahili: 'Umekamilisha kila kitu!' },
  'onboarding.ready_journey': { English: 'Ready to start your journey with Amara?', Kiswahili: 'Uko tayari kuanza safari yako na Amara?' },
  'onboarding.complete': { English: 'Complete', Kiswahili: 'Kamilisha' },
  'onboarding.completing': { English: 'Completing...', Kiswahili: 'Inakamilisha...' },

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

  /* ── Leaderboard & Gamification ── */
  'leaderboard.title':        { English: 'Cohort Leaders', Kiswahili: 'Viongozi wa Kundi' },
  'leaderboard.offline':      { English: 'Leaderboard unavailable offline', Kiswahili: 'Orodha ya viongozi haipatikani nje ya mtandao' },
  'leaderboard.top_half':     { English: "You're in the top half!", Kiswahili: 'Uko kwenye nusu ya juu!' },
  'leaderboard.keep_pushing':  { English: "Keep pushing, you're getting there!", Kiswahili: 'Endelea kujitahidi, unakaribia!' },
  'leaderboard.pts_away':     { English: 'Only {points} pts away from the top 5', Kiswahili: 'Bado pointi {points} tu kufikia 5 bora' },
  'leaderboard.resets':       { English: 'Resets every Monday at 00:00 EAT', Kiswahili: 'Huanza upya kila Jumatatu saa 00:00 EAT' },
  'leaderboard.cohort':       { English: '{county} Cohort', Kiswahili: 'Kundi la {county}' },
  'leaderboard.pts_abbr':     { English: 'pts', Kiswahili: 'pointi' },

  /* ── Mentor Browse ── */
  'mentor_browse.title':      { English: 'Talk to a Mentor', Kiswahili: 'Soga na Mshauri' },
  'mentor_browse.tagline':    { English: 'Your guide. Your pace.', Kiswahili: 'Mwongozo wako. Kasi yako.' },
  'mentor_browse.tab_browse': { English: 'Browse Mentors', Kiswahili: 'Tazama Washauri' },
  'mentor_browse.tab_my':     { English: 'My Mentor', Kiswahili: 'Mshauri Wangu' },
  'mentor_browse.vetted_hint': { English: 'All mentors are vetted and safeguarding-trained', Kiswahili: 'Washauri wote wamekaguliwa na kuelimishwa kuhusu usalama' },
  'mentor_browse.find_btn':   { English: 'Help me find the right mentor', Kiswahili: 'Nisaidie kupata mshauri anayefaa' },
  'mentor_browse.guide_hint': { English: '{persona} will guide you to your best match', Kiswahili: '{persona} atakuongoza kupata chaguo bora' },
  'mentor_browse.coming_soon': { English: 'Coming soon', Kiswahili: 'Inakuja hivi karibuni' },
  'mentor_browse.coming_soon_mentors': { English: 'Coming soon', Kiswahili: 'Washauri wanakuja hivi karibuni' },
  'mentor_browse.featured_week': { English: 'Featured This Week', Kiswahili: 'Washauri Mashuhuri Wiki Hii' },
  'mentor_browse.featured':   { English: 'Featured', Kiswahili: 'Mashuhuri' },
  'mentor_browse.wish_knew':  { English: 'One thing I wish I knew at your age…', Kiswahili: 'Kitu kimoja ningependa kujua nilipokuwa na umri wako…' },
  'mentor_browse.connect_with': { English: 'Connect with this mentor', Kiswahili: 'Ungana na mshauri huyu' },
  'mentor_browse.connect':    { English: 'Connect', Kiswahili: 'Ungana' },
  'mentor_browse.connected':  { English: 'Connected ✓', Kiswahili: 'Umeunganishwa ✓' },
  'mentor_browse.pending':    { English: 'Request pending', Kiswahili: 'Ombi linasubiri' },
  'mentor_browse.preview_only': { English: 'Preview only', Kiswahili: 'Onyesho tu' },
  'mentor_browse.connecting': { English: 'Sending Request…', Kiswahili: 'Inatuma Maombi…' },
  'mentor_browse.offline_short': { English: 'Offline', Kiswahili: 'Nje ya mtandao' },
  'mentor_browse.all_fields': { English: 'All Fields', Kiswahili: 'Nyanja Zote' },
  'mentor_browse.all_mentors': { English: 'All Mentors', Kiswahili: 'Washauri Wote' },
  'mentor_browse.field_mentors': { English: '{field} Mentors', Kiswahili: 'Washauri wa {field}' },
  'mentor_browse.empty':      { English: 'No mentors available in this category yet.', Kiswahili: 'Hakuna washauri wanaopatikana katika kundi hili bado.' },
  'mentor_browse.safe_title': { English: 'Safe & Verified', Kiswahili: 'Salama & Wamethibitishwa' },
  'mentor_browse.safe_desc':  { English: 'All mentors undergo strict vetting and safeguarding training.', Kiswahili: 'Washauri wote hupitia ukaguzi mkali na mafunzo ya usalama.' },
  'mentor_browse.wisdom_title': { English: "Mentor's Wisdom", Kiswahili: 'Hekima ya Mshauri' },
  
  /* ── Mentor Matching Quiz ── */
  'mentor_match.browse_all':  { English: "I know what I'm looking for → Browse all mentors", Kiswahili: 'Ninajua ninachotafuta → Tazama washauri wote' },
  'mentor_match.goal_q':      { English: "What's the one thing you most want to change in the next 3 months?", Kiswahili: 'Je, ni kitu gani kimoja unachotaka kubadilisha zaidi katika miezi 3 ijayo?' },
  'mentor_match.style_q':     { English: 'How do you prefer to get guidance?', Kiswahili: 'Je, unapendelea kupata mwongozo vipi?' },
  'mentor_match.avail_q':     { English: 'How often can you commit to meeting?', Kiswahili: 'Je, unaweza kujitolea kukutana mara ngapi?' },
  'mentor_match.searching':   { English: '{persona} is finding your matches...', Kiswahili: '{persona} anatafuta washauri wanaokufaa...' },
  'mentor_match.results_title': { English: 'Your Top Matches', Kiswahili: 'Washauri Wanaokufaa Zaidi' },
  'mentor_match.no_matches':  { English: 'No matches found right now. Try browsing all mentors!', Kiswahili: 'Hakuna washauri waliopatikana kwa sasa. Jaribu kutazama washauri wote!' },
  'mentor_match.top_match_badge': { English: 'Top Match', Kiswahili: 'Chaguo Bora' },
  'mentor_match.recommend_desc': { English: '{name} specialises in {expertise} and has helped students {goal_reason}.', Kiswahili: '{name} amebobea katika {expertise} na amesaidia wanafunzi {goal_reason}.' },
  'mentor_match.stay_with':   { English: 'Stay with {name}', Kiswahili: 'Baki na {name}' },
  'mentor_match.browse_again': { English: 'Browse Again', Kiswahili: 'Tafuta Tena' },
  'mentor_match.fit_title':   { English: 'Finding the right fit', Kiswahili: 'Kupata anayefaa' },
  'mentor_match.fit_desc':    { English: 'Sometimes it takes a few tries to find the right mentor. Would you like to explore other mentors?', Kiswahili: 'Wakati mwingine inachukua majaribio kadhaa kupata mshauri anayefaa. Je, ungependa kuangalia washauri wengine?' },
  'mentor_match.offline_cached': { English: 'Offline — Displaying cached data', Kiswahili: 'Nje ya mtandao — Inaonyesha data iliyohifadhiwa' },

  /* ── Mentor Matching Quiz Options ── */
  'mentor_match.goal.learn_skill': { English: 'Learn a skill', Kiswahili: 'Jifunze ujuzi' },
  'mentor_match.goal.start_something': { English: 'Start something', Kiswahili: 'Anza mradi' },
  'mentor_match.goal.build_confidence': { English: 'Build confidence', Kiswahili: 'Jenga kujiamini' },
  'mentor_match.goal.improve_school': { English: 'Improve at school', Kiswahili: 'Fanya vizuri shuleni' },
  'mentor_match.goal.understand_money': { English: 'Understand money', Kiswahili: 'Elewa fedha' },
  'mentor_match.goal.health_wellbeing': { English: 'Health & wellbeing', Kiswahili: 'Afya na ustawi' },

  'mentor_match.style.clear_plan': { English: 'Give me a clear plan and structure', Kiswahili: 'Nipe mpango wazi na muundo' },
  'mentor_match.style.listen_figure': { English: 'Listen to me and help me figure it out', Kiswahili: 'Nisikilize na unisaidie kupata suluhisho' },
  'mentor_match.style.challenge_me': { English: 'Challenge me and push me harder', Kiswahili: 'Nikabili na unisukume kufanya zaidi' },
  'mentor_match.style.regular_checkins': { English: 'Check in on me regularly', Kiswahili: 'Nikaguliwe mara kwa mara' },

  'mentor_match.avail.once_a_week': { English: 'Once a week (30 min)', Kiswahili: 'Mara moja kwa wiki (dakika 30)' },
  'mentor_match.avail.every_two_weeks': { English: 'Every two weeks (45 min)', Kiswahili: 'Kila wiki mbili (dakika 45)' },
  'mentor_match.avail.once_a_month': { English: 'Once a month (60 min)', Kiswahili: 'Mara moja kwa mwezi (dakika 60)' },
  'mentor_match.avail.flexible': { English: 'Flexible — just when I need it', Kiswahili: 'Kubadilika — wakati tu ninapohitaji' },

  'mentor_match.reason.learn_skill': { English: 'learn new skills', Kiswahili: 'kujifunza ujuzi mpya' },
  'mentor_match.reason.start_something': { English: 'start their own projects', Kiswahili: 'kuanzisha miradi yao wenyewe' },
  'mentor_match.reason.build_confidence': { English: 'build self-confidence', Kiswahili: 'kujenga kujiamini' },
  'mentor_match.reason.improve_school': { English: 'improve academically', Kiswahili: 'kufanya vizuri kimasomo' },
  'mentor_match.reason.understand_money': { English: 'understand personal finance', Kiswahili: 'kuelewa fedha za kibinafsi' },
  'mentor_match.reason.health_wellbeing': { English: 'improve their wellbeing', Kiswahili: 'kuboresha ustawi wao' },

  /* ── My Mentor Page ── */
  'my_mentor.sessions':       { English: 'Sessions', Kiswahili: 'Vipindi' },
  'my_mentor.next_sync':      { English: 'Next Sync', Kiswahili: 'Mkutano Ujao' },
  'my_mentor.active':         { English: 'Active', Kiswahili: 'Kikamilifu' },
  'my_mentor.scheduled':      { English: 'Scheduled', Kiswahili: 'Kimeratibiwa' },
  'my_mentor.message':        { English: 'Message', Kiswahili: 'Tuma Ujumbe' },

  /* ── Sign In ── */
  'signin.choose_title':      { English: 'Choose Sign In', Kiswahili: 'Chagua Kuingia' },
  'signin.choose_access':     { English: 'Pick the access type that matches this test account.', Kiswahili: 'Chagua aina ya ufikiaji inayolingana na akaunti hii ya jaribio.' },
  'signin.verify_title':      { English: 'Verify Code', Kiswahili: 'Thibitisha Msimbo' },
  'signin.verify_desc':       { English: 'We sent a 6-digit code to', Kiswahili: 'Tulituma msimbo wa tarakimu 6 kwa' },
  'signin.phone_description': { English: 'Enter your phone number to sign in or sign up.', Kiswahili: 'Ingiza nambari yako ya simu ili kuingia au kujisajili.' },
  'signin.enter_phone':       { English: 'Enter phone number', Kiswahili: 'Ingiza nambari ya simu' },
  'signin.send_code':         { English: 'Send Code', Kiswahili: 'Tuma Msimbo' },
  'signin.sending_code':      { English: 'Sending...', Kiswahili: 'Inatuma...' },

  /* ── Age Warning ── */
  'onboarding.age_warning':   { English: 'Youth Educated is designed specifically for youth aged 10-22. Standard accounts cannot be older than 22. If you are an approved mentor or admin, please log in with your registered account.', Kiswahili: 'Youth Educated imeundwa mahususi kwa vijana wenye umri wa miaka 10-22. Akaunti za kawaida haziwezi kuwa zaidi ya miaka 22. Ikiwa wewe ni mshauri au msimamizi aliyeidhinishwa, tafadhali ingia kwa kutumia akaunti yako iliyosajiliwa.' },
};

/**
 * Translate a key into the target language.
 * Falls back to the key itself when no match is found —
 * this keeps the UI readable even if a key is missing.
 */
export function t(key: string, lang: Language = 'English'): string {
  return translations[key]?.[lang] ?? key;
}
