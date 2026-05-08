// ─────────────────────────────────────────────────────────────
// YE+ Life Kit — Month 1 Content Library
// Short-form guides and mentor stories for Kenyan youth (10–22)
// ─────────────────────────────────────────────────────────────

export interface LifeKitArticle {
  id: string
  title: string
  title_sw: string
  category: string
  tags: string[]
  emoji: string
  readTime: string
  body: string
  body_sw: string
  month?: number
}

export interface LifeKitCategory {
  id: string
  label: string
  label_sw: string
  shortLabel: string
  shortLabel_sw: string
  emoji: string
}

// ── Categories ───────────────────────────────────────────────

export const LIFEKIT_CATEGORIES: LifeKitCategory[] = [
  { id: 'all', label: 'All', label_sw: 'Zote', shortLabel: 'All', shortLabel_sw: 'Zote', emoji: '✨' },
  { id: 'mentor-stories', label: 'Been There, Learnt That', label_sw: 'Nilikuwapo, Nilijifunza', shortLabel: 'Mentor Stories', shortLabel_sw: 'Hadithi', emoji: '🏆' },
  { id: 'school', label: 'School & Learning', label_sw: 'Shule na Masomo', shortLabel: 'School', shortLabel_sw: 'Shule', emoji: '📚' },
  { id: 'mental-health', label: 'Mental Health & Emotions', label_sw: 'Afya ya Akili na Hisia', shortLabel: 'Mental Health', shortLabel_sw: 'Afya Akili', emoji: '💙' },
  { id: 'relationships', label: 'Relationships & Social Life', label_sw: 'Uhusiano na Maisha ya Jamii', shortLabel: 'Relationships', shortLabel_sw: 'Uhusiano', emoji: '🤝' },
  { id: 'safety', label: 'Safety & Life Skills', label_sw: 'Usalama na Stadi za Maisha', shortLabel: 'Safety', shortLabel_sw: 'Usalama', emoji: '🛡️' },
  { id: 'future', label: 'Future & Career', label_sw: 'Hatima na Kazi', shortLabel: 'Future', shortLabel_sw: 'Hatima', emoji: '🚀' },
  { id: 'money', label: 'Money Basics', label_sw: 'Misingi ya Fedha', shortLabel: 'Money', shortLabel_sw: 'Fedha', emoji: '💰' },
]

// ── Tags ─────────────────────────────────────────────────────

export const LIFEKIT_TAGS: string[] = [
  'Exams',
  'Friendship',
  'Stress',
  'Confidence',
  'Money',
  'Career',
  'MentalHealth',
  'School',
  'Safety',
  'Future',
  'Decisions',
  'Technology',
]

// ── Articles — Month 1 ──────────────────────────────────────

export const LIFEKIT_ARTICLES: LifeKitArticle[] = [
  // ▸ Mentor Stories
  {
    id: 'ms-1',
    title: 'I wish I took school more seriously. Here is why',
    title_sw: 'Natamani ningechukulia shule kwa umakini zaidi. Hii ndiyo sababu',
    category: 'mentor-stories',
    tags: ['School', 'Confidence'],
    emoji: '📖',
    readTime: '3 min',
    body: `Let me be honest with you — when I was in Form 2 at a school in Eastlands, Nairobi, I thought school was just something you survived. I would sit at the back, copy homework on the matatu ride to school, and count down to closing time. I genuinely believed that books were not for someone like me.

Here is what I learned the hard way:

1. **School is not just about grades — it is about options.** When I finished Form 4, my KCSE results locked me out of courses I actually wanted. My friends who had put in the work were choosing between universities while I was figuring out what to do next. The grades did not make them smarter than me — they just had more doors open.

2. **The subjects you hate might save you later.** I used to sleep through Maths lessons. But when I started a small business selling mitumba clothes in Gikomba, guess what I needed? Maths. Calculating profits, M-Pesa float, stock — all of it. I had to teach myself what I ignored in class.

3. **Your teachers are not the enemy.** I know some teachers are tough — mine used to call me "the dreamer" because I was always looking out the window. But one teacher, Madam Njeri, pulled me aside in Form 3 and said, "You are sharp, but you are wasting it." That sentence changed something in me. Not overnight, but it planted a seed.

4. **Starting late is better than never starting.** I went back and did a diploma after two years of hustling. It was harder as an adult — working during the day, studying at night. If I had just pushed myself in secondary school, I would have saved myself so much stress.

You do not have to be the top student in your class. But please, take your education seriously while you have it. Future you will say asante sana.`,
    body_sw: `Wacha nikuambie ukweli — nilipokuwa Kidato cha 2 katika shule moja huko Eastlands, Nairobi, nilifikiri shule ni kitu unachopaswa tu kuvumilia. Nilikuwa naketi nyuma, nakili kazi ya nyumbani kwenye matatu nikielekea shuleni, na kuhesabu saa za kufunga shule. Kwa kweli nilikuwa naamini kuwa vitabu si vya mtu kama mimi.

Haya ndiyo niliyojifunza kwa njia ngumu:

1. **Shule si kuhusu alama pekee — ni kuhusu nafasi.** Nilipomaliza Kidato cha 4, matokeo yangu ya KCSE yalinizuia kupata kozi ambazo nilikuwa nazitaka. Marafiki zangu waliokuwa wameweka bidii walikuwa wanachagua kati ya vyuo vikuu huku mimi nikihangaika kujua nifanye nini baadaye. Alama hazikuwafanya wawe na akili zaidi yangu — walikuwa tu na milango mingi iliyofunguliwa.

2. **Masomo unayoyachukia yanaweza kukuokoa baadaye.** Nilikuwa nalala wakati wa vipindi vya Hisabati. Lakini nilipoanzisha biashara ndogo ya kuuza nguo za mitumba huko Gikomba, unadhani nilihitaji nini? Hisabati. Kupiga hesabu za faida, M-Pesa, bidhaa — yote hayo. Ilinibidi nijifunze mwenyewe yale niliyoyapuuza darasani.

3. **Walimu wako si maadui zako.** Najua kuna walimu wakali — wangu walizoea kuniita "muota ndoto" kwa sababu nilikuwa kila mara natazama nje kupitia dirishani. Lakini mwalimu mmoja, Madam Njeri, alinichukua pembeni katika Kidato cha 3 na kusema, "Wewe ni mwerevu, lakini unapoteza kipaji chako." Sentensi hiyo ilibadilisha kitu ndani yangu. Si mara moja, lakini ilipanda mbegu.

4. **Kuanza kwa kuchelewa ni bora kuliko kutokuanza kabisa.** Nilirudi na kufanya diploma baada ya miaka miwili ya kuhangaika mitaani. Ilikuwa ngumu zaidi nikiwa mtu mzima — kufanya kazi mchana, kusoma usiku. Ikiwa ningejisukuma tu katika shule ya upili, ningejiondolea msongo wa mawazo mwingi sana.

Huna haja ya kuwa mwanafunzi bora zaidi darasani kwako. Lakini tafadhali, chukulia elimu yako kwa umakini ukiwa nayo. Wewe wa baadaye atasema asante sana.`,
    month: 1,
  },
  {
    id: 'ms-2',
    title: 'What no one tells you about choosing a career',
    title_sw: 'Kile ambacho hakuna mtu anayekuambia kuhusu kuchagua kazi',
    category: 'mentor-stories',
    tags: ['Career', 'Future'],
    emoji: '🗺️',
    readTime: '4 min',
    body: `When I was your age, growing up in Kisumu, every adult asked me the same question: "Utakuwa nani ukikuwa mkubwa?" And the only answers they accepted were doctor, lawyer, or engineer. So I said doctor — not because I wanted to be one, but because it made my mum smile.

Here is what nobody told me about choosing a career:

1. **You do not have to know right now.** Seriously. I changed my mind three times after KCSE. First I wanted medicine, then I tried accounting, and I ended up in communications. And you know what? I love what I do. The journey was not straight, but it got me here. Most successful people in Kenya did not follow a straight line either.

2. **Pay attention to what makes you lose track of time.** When I was in secondary school, I could spend hours writing stories in my exercise book while everyone else was at games. I did not realize that was a clue about my future career. What do you enjoy doing so much that you forget to check your phone? That thing might be pointing you somewhere.

3. **Talk to people who are doing the jobs you are curious about.** I wish I had done this earlier. Not career day speeches — real conversations. Ask your auntie's friend who works in IT what her day actually looks like. DM that Kenyan YouTuber you admire. Send a polite WhatsApp message. Most people are happy to share.

4. **Your career does not define your whole life.** This one took me years to understand. In Kenya we tie so much identity to "what you do." But you are more than your job title. You are allowed to have a career that pays the bills AND a passion on the side.

Do not let anyone pressure you into choosing before you are ready. Explore, ask questions, try things. Your path is yours — not your parents', not your teacher's, not your WhatsApp group's.`,
    body_sw: `Nilipokuwa na umri wako, nikikulia huko Kisumu, kila mtu mzima aliniuliza swali lile lile: \"Utakuwa nani ukikuwa mkubwa?\" Na majibu pekee waliyokubali yalikuwa daktari, wakili, au mhandisi. Kwa hivyo nikasema daktari — si kwa sababu nilitaka kuwa mmoja, lakini kwa sababu ilimfanya mama yangu atabasamu.

Hivi ndivyo hakuna aliyeniambia kuhusu kuchagua kazi:

1. **Huna haja ya kujua hivi sasa.** Kwa kweli. Nilibadilisha mawazo yangu mara tatu baada ya KCSE. Kwanza nilitaka udaktari, kisha nikajaribu uhasibu, na nikaishia katika mawasiliano. Na unajua nini? Napenda kile ninachofanya. Safari haikuwa nyoofu, lakini ilifikisha hapa. Watu wengi waliofanikiwa nchini Kenya hawakufuata njia nyoofu pia.

2. **Zingatia kile kinachokufanya usahau muda.** Nilipokuwa katika shule ya upili, ningeweza kutumia saa nyingi kuandika hadithi katika daftari langu huku kila mtu mwingine akiwa michezoni. Sikutambua kuwa hiyo ilikuwa dalili kuhusu kazi yangu ya baadaye. Je, ni nini unachofurahia kufanya kiasi kwamba unasahau kuangalia simu yako? Hicho kitu huenda kinakuonyesha mwelekeo fulani.

3. **Zungumza na watu wanaofanya kazi unazozitamani.** Natamani ningefanya hivi mapema. Si hotuba za siku ya taaluma — mazungumzo ya kweli. Mwulize rafiki wa shangazi yako anayefanya kazi ya IT jinsi siku yake inavyokuwa. Watumie ujumbe wa faragha wale Wakenya wanaofanya YouTube unaovutiwa nao. Tuma ujumbe wa heshima wa WhatsApp. Watu wengi hufurahi kushiriki uzoefu wao.

4. **Kazi yako haiamui maisha yako yote.** Hili lilichukua miaka mingi kwangu kuelewa. Nchini Kenya tunajihusisha sana na \"kile unachofanya.\" Lakini wewe ni zaidi ya jina la kazi yako. Unaruhusiwa kuwa na kazi inayolipa mahitaji yako NA kitu kingine unachokipenda kando.

Usikubali mtu yeyote akushinikize kuchagua kabla hujawa tayari. Chunguza, uliza maswali, jaribu vitu. Njia yako ni yako — si ya wazazi wako, si ya mwalimu wako, wala si ya kundi lako la WhatsApp.`,
    month: 1,
  },
  {
    id: 'ms-3',
    title: 'How I dealt with failing and what it taught me',
    title_sw: 'Jinsi nilivyokabiliana na kufeli na kile kilichonifunza',
    category: 'mentor-stories',
    tags: ['Confidence', 'Stress'],
    emoji: '💪',
    readTime: '3 min',
    body: `I will never forget the day my Form 2 results were pinned on the notice board at our school in Thika. I had dropped from position 15 to position 43. My best friend saw it before I did and gave me that look — you know the one. I wanted the ground to swallow me.

Here is how I got through it and what failure actually taught me:

1. **Failing does not mean you are a failure.** I know it sounds like something a motivational poster would say, but hear me out. That term I failed, I had been dealing with my parents separating. I could barely sleep, let alone concentrate on Chemistry. My grades dropped, but that did not mean my brain stopped working. Sometimes life hits you and your performance dips. That is human, not stupid.

2. **I stopped comparing myself to others.** The student who came first in class had a private tutor, a quiet home, and parents who checked homework every night. I was sharing a textbook with my deskmate. We were not running the same race. Once I accepted that, I focused on improving MY own score, not beating someone else.

3. **I asked for help — and it was not as scary as I thought.** I swallowed my pride and went to my Maths teacher after school. I expected her to shame me. Instead, she gave me extra exercises and checked on me weekly. That one move brought my Maths grade from a D to a B in two terms.

4. **Failure is data, not a death sentence.** Each bad grade told me something — I was not practising enough, I did not understand a concept, or I needed a different study method. When I started treating failure as feedback, everything changed.

If you have failed at something recently — a test, a tryout, a friendship — breathe. It is not the end. Inuka, learn the lesson, and keep moving. Wewe ni warrior.`,
    body_sw: `Sitawahi kusahau siku ambayo matokeo yangu ya Kidato cha 2 yaliwekwa kwenye ubao wa matangazo katika shule yetu huko Thika. Nilikuwa nimeshuka kutoka nafasi ya 15 hadi nafasi ya 43. Rafiki yangu wa dhati aliyaona kabla yangu na kunipa ule mtazamo — unaujua. Nilitamani ardhi ipasuke inimeze.

Hivi ndivyo nilivyovuka hapo na kile ambacho kufeli kulinifundisha hasa:

1. **Kufeli haimaanishi kuwa wewe ni mshindwa.** Najua inasikika kama kitu ambacho kimeandikwa kwenye bango la kutia moyo, lakini nisikilize. Muhula ule niliofeli, nilikuwa nikikabiliana na kutengana kwa wazazi wangu. Sikuweza hata kulala, achilia mbali kuzingatia Kemia. Alama zangu zilishuka, lakini hiyo haikumaanisha kuwa ubongo wangu uliacha kufanya kazi. Wakati mwingine maisha yanakupiga na utendaji wako unashuka. Hiyo ni ubinadamu, si upumbavu.

2. **Niliacha kujilinganisha na wengine.** Mwanafunzi aliyekuwa wa kwanza darasani alikuwa na mwalimu wa ziada nyumbani, mazingira tulivu, na wazazi waliokagua kazi ya nyumbani kila usiku. Mimi nilikuwa nikishiriki kitabu kimoja na mwenzangu. Hatukuwa tukikimbia mbio moja. Mara tu nilipokubali hilo, nilizingatia kuboresha alama YANGU mwenewe, si kumshinda mtu mwingine.

3. **Niliomba msaada — na haikuwa ya kutisha kama nilivyofikiri.** Nilimeza kiburi changu na kwenda kwa mwalimu wangu wa Hisabati baada ya shule. Nilitegemea angeniaibisha. Badala yake, alinipa mazoezi ya ziada na kunikagua kila wiki. Hatua hiyo moja ilileta alama yangu ya Hisabati kutoka D hadi B katika mihula miwili.

4. **Kufeli ni data, si hukumu ya kifo.** Kila alama mbaya iliniambia kitu — sikuwa nikifanya mazoezi ya kutosha, sikuwa nimeelewa somo, au nilihitaji njia tofauti ya kusoma. Nilipoanza kuchukulia kufeli kama maoni ya kuboresha, kila kitu kilibadilika.

Ikiwa umefeli katika jambo fulani hivi karibuni — mtihani, jaribio la mchezo, urafiki — vuta pumzi. Sio mwisho. Inuka, jifunze somo, na uendelee mbele. Wewe ni shujaa.`,
    month: 1,
  },
  {
    id: 'ms-4',
    title: 'Confidence is not natural. Here is how I built mine',
    title_sw: 'Kujiamini si jambo la asili. Hivi ndivyo nilivyojenga kwangu',
    category: 'mentor-stories',
    tags: ['Confidence'],
    emoji: '⭐',
    readTime: '3 min',
    body: `Growing up in Murang'a, I was the quietest kid in class. During assemblies I would hide behind taller students. When teachers asked questions, I knew the answer but my mouth would not open. I thought confident people were just born that way — like some factory setting I did not have.

I was wrong. Here is how I built my confidence brick by brick:

1. **I started with tiny wins.** I did not wake up one day and become a public speaker. I started by answering one question in class per day. Just one. My heart would race, my voice would shake, but I did it. After a few weeks, it became normal. Confidence is like a muscle at the gym — you have to exercise it, and it grows slowly.

2. **I stopped worrying about what everyone thinks.** In secondary school, there is so much pressure to be cool. I used to rehearse what I would say at break time so I would not sound dumb. Then I realized — most people are too busy worrying about themselves to judge you. That thought was so freeing. Most of your classmates are also nervous, they are just hiding it.

3. **I found my thing.** I was terrible at football, average in class, but I could draw. When I entered an art competition in Form 3 and won second place in the whole county, something shifted inside me. I was not "the quiet kid" anymore — I was "the artist." Find what you are good at and let it give you confidence in other areas.

4. **I changed how I talked to myself.** I used to say things like "I am so stupid" or "I cannot do this." My mentor told me, "You would not say that to your best friend, so why say it to yourself?" I started catching those thoughts and replacing them. Sounds small, but it is powerful.

Confidence is not about being the loudest person in the room. It is about knowing you belong there. And trust me — you do.`,
    body_sw: `Nikikulia huko Murang'a, nilikuwa mtoto mnyamavu zaidi darasani. Wakati wa gwaride ningejificha nyuma ya wanafunzi warefu. Walimu walipouliza maswali, nilijua jibu lakini mdomo wangu haungefunguka. Nilifikiri watu wanaojiamini walizaliwa tu hivyo — kama mipangilio fulani ya kiwandani ambayo mimi sikuwa nayo.

Nilikuwa nimekosea. Hivi ndivyo nilivyojenga kujiamini kwangu hatua kwa hatua:

1. **Nilianza na ushindi mdogo.** Sikuamka siku moja na kuwa mzungumzaji mbele ya watu. Nilianza kwa kujibu swali moja darasani kwa siku. Moja tu. Moyo wangu ungeenda mbio, sauti yangu ingetitika, lakini nilifanya. Baada ya wiki chache, ikawa jambo la kawaida. Kujiamini ni kama misuli kwenye gym — lazima uifanyie mazoezi, na inakua polepole.

2. **Niliacha kuwa na wasiwasi juu ya kile kila mtu anachofikiria.** Katika shule ya upili, kuna shinikizo kubwa la kuonekana kuwa mjanja (cool). Nilikuwa nikifanya mazoezi ya kile nitakachosema wakati wa mapumziko ili nisionekane mjinga. Kisha nikatambua — watu wengi wako busy kuwa na wasiwasi juu yao wenyewe kiasi cha kutokuhukumu wewe. Wazo hilo lilikuwa la kunituliza sana. Wanafunzi wenzako wengi pia wana wasiwasi, wanaificha tu.

3. **Nilitafuta kipaji changu.** Nilikuwa mbaya sana kwenye soka, wa wastani darasani, lakini ningeweza kuchora. Niliposhiriki katika shindano la sanaa katika Kidato cha 3 na kushinda nafasi ya pili katika kaunti nzima, kitu kilibadilika ndani yangu. Sikuwa tena "yule mtoto mnyamavu" — nilikuwa "msanii." Tafuta kile unachoweza kufanya vizuri na ukiruhusu kikupe kujiamini katika maeneo mengine.

4. **Nilibadilisha jinsi nilivyokuwa nikizungumza na mimi mwenyewe.** Nilikuwa nikisema mambo kama "mimi ni mjinga sana" au "siwezi kufanya hivi." Mshauri wangu aliniambia, "Huwezi kumwambia hivyo rafiki yako wa dhati, sasa mbona unajiambia hivyo?\" Nilianza kuzuia mawazo hayo na kuyabadilisha. Inasikika kama jambo dogo, lakini lina nguvu sana.

Kujiamini si kuhusu kuwa mtu mwenye sauti kubwa zaidi chumbani. Ni kuhusu kujua kuwa unastahili kuwa hapo. Na niamini — unastahili. Kujiamini kunawezekana.`,
    month: 1,
  },
  {
    id: 'ms-5',
    title: 'Your friends determine your future. Choose wisely',
    title_sw: 'Marafiki zako huamua hatima yako. Chagua kwa busara',
    category: 'mentor-stories',
    tags: ['Friendship', 'Decisions'],
    emoji: '🤝',
    readTime: '3 min',
    body: `When I was in Form 3 in Mombasa, I had a crew of five friends. We were tight — we shared lunch, walked home together, had our own WhatsApp group. But looking back, three of those friends were slowly pulling me in the wrong direction. Skipping afternoon preps, sneaking out during games, talking badly about teachers. I did not notice because it felt normal.

Here is what I learned about friendship the hard way:

1. **Your friends set your "normal."** If your group thinks studying is for nerds, you will stop studying. If your group thinks it is cool to disrespect prefects, you will start doing it too. I did not realize I was changing until my mum said, "You are not the same boy." She was right. Pay attention to who you are becoming around your friends.

2. **Real friends push you up, not down.** After KCSE, the two friends who actually cared about me were the ones who used to say things like, "Bro, tufanye revision pamoja" or "Usikuwe na stress, tutasort." They were not trying to be cool — they were trying to be good. Those are the friendships that last.

3. **It is okay to outgrow people.** This is the hardest one. Some friendships have an expiry date, and that is normal. You do not have to fight or be dramatic about it. You can just slowly spend less time with people who are not good for you. Join a new club, sit with different people at lunch. It is not betrayal — it is growth.

4. **Being alone for a while is better than being in a bad group.** I spent most of Form 4 with just one close friend. At first it felt lonely. But that year I got my best grades ever, joined the debate team, and actually started enjoying school. Sometimes less is more.

Choose your circle carefully. The people you walk with today will determine where you end up tomorrow. Make sure they are heading somewhere good.`,
    body_sw: `Nilipokuwa Kidato cha 3 kule Mombasa, nilikuwa na kikundi cha marafiki watano. Tulikuwa tuko pamoja sana — tulishiriki chakula cha mchana, tulitembea nyumbani pamoja, na tulikuwa na kundi letu la WhatsApp. Lakini nikitazama nyuma, watatu kati ya marafiki hao walikuwa wakinipeleka upande mbaya polepole. Kukosa vipindi vya ziada vya alasiri, kutoroka wakati wa michezo, na kuzungumza vibaya kuhusu walimu. Sikutambua kwa sababu ilionekana kuwa jambo la kawaida.

Haya ndiyo niliyojifunza kuhusu urafiki kwa njia ngumu:

1. **Marafiki zako ndio huamua tabia yako.** Ikiwa kikundi chako kinafikiri kusoma ni kwa ajili ya wale wanaojiita werevu (nerds), utaacha kusoma. Ikiwa kikundi chako kinafikiri ni ujanja kukosea walimu heshima, utaanza kufanya hivyo pia. Sikutambua kuwa nilikuwa nikibadilika mpaka mama yangu aliposema, "Wewe si yule mvulana wa zamani." Alakuwa sahihi. Zingatia ni nani unayekuwa unapokuwa na marafiki zako.

2. **Marafiki wa kweli wanakusukuma juu, si chini.** Baada ya KCSE, marafiki wawili ambao walinijali kikweli walikuwa wale waliozoea kusema mambo kama, "Bro, tufanye marudio (revision) pamoja" au "Usiwe na msongo wa mawazo, tutasuluhisha." Hawakuwa wakijaribu kuwa wajanja — walikuwa wakijaribu kuwa watu wazuri. Hiyo ndiyo urafiki unaodumu.

3. **Ni sawa kukua na kuachana na baadhi ya watu.** Hili ndilo gumu zaidi. Baadhi ya urafiki una tarehe ya mwisho, na hiyo ni kawaida. Huna haja ya kupigana au kufanya vurugu. Unaweza tu polepole kutumia muda mchache na watu ambao si wazuri kwako. Jiunge na klabu mpya, keti na watu tofauti wakati wa chakula cha mchana. Si usaliti — ni kukua.

4. **Kuwa peke yako kwa muda ni bora kuliko kuwa katika kikundi kibaya.** Nilitumia sehemu kubwa ya Kidato cha 4 na rafiki mmoja tu wa karibu. Mwanzoni nilihisi upweke. Lakini mwaka huo nilipata alama zangu bora zaidi kuwahi kutokea, nilijiunga na timu ya mijadala (debate), na kuanza kufurahia shule. Wakati mwingine, kidogo ni bora zaidi.

Chagua marafiki zako kwa uangalifu. Watu unaotembea nao leo wataamua utaishia wapi kesho. Hakikisha wanaelekea mahali pazuri.`,
    month: 1,
  },

  // ▸ School & Learning
  {
    id: 'sl-1',
    title: 'Struggling with grades? Start with this 3-step reset',
    title_sw: 'Unahangaika na alama? Anza na hatua hizi 3 za kujirekebisha',
    category: 'school',
    tags: ['School', 'Exams', 'Stress'],
    emoji: '📝',
    readTime: '3 min',
    body: `Sawa, so your report card came back and it is not looking good. Maybe your parents are disappointed, your teacher gave you that speech, and you are feeling like academics are just not your thing. Before you give up — pause. Let us try a reset.

Here are three steps that have helped thousands of Kenyan students turn things around:

1. **Step one: Find out WHERE you are losing marks.** Get your last exam paper and actually look at it. Not just the grade — the questions. Where did you lose the most marks? Was it Section B essays in English? Calculations in Physics? Most students lose marks in the same areas over and over because they never stop to check. Grab a highlighter and mark every question you got wrong. That is your revision map right there.

2. **Step two: Make a "power hour" plan.** You do not need to study for five hours straight like those motivational videos say. One focused hour per day is enough to start. Pick the subject you are weakest in, set a timer on your phone, and just do exercises — no WhatsApp, no TikTok, no distractions. Even on the matatu ride home, you can review your notes. One hour a day for three weeks is 21 hours of extra practice. That is enough to move a grade.

3. **Step three: Get a study partner — a serious one.** Not your bestie who will make you laugh the whole time. Find someone in class who is doing slightly better than you in a subject you struggle with and ask if you can revise together. Teaching each other is one of the best ways to learn. Form a small group, meet during lunch or after school, and quiz each other.

You are not dumb. You just need a plan. Even students who get As started somewhere. The fact that you are reading this shows you care — and that is already step one. Endelea hivyo, you have got this.`,
    body_sw: `Sawa, basi kadi yako ya matokeo imerudi na haionekani vizuri. Labda wazazi wako wamekata tamaa, mwalimu wako amekupa hotuba ileile, na unahisi kama masomo si kipaji chako. Kabla ya kukata tamaa — tulia kidogo. Hebu tujaribu kujirekebisha.

Hizi hapa ni hatua tatu ambazo zimesaidia maelfu ya wanafunzi Wakenya kubadilisha mambo:

1. **Hatua ya kwanza: Jua ni WAPI unapoteza alama.** Chukua karatasi yako ya mtihani iliyopita na uitazame kwa kweli. Si alama pekee — bali maswali. Ni wapi ulipoteza alama nyingi zaidi? Je, ni insha za Sehemu B katika Kiingereza? Hesabu katika Fizikia? Wanafunzi wengi hupoteza alama katika maeneo yale yale mara kwa mara kwa sababu hawaachi kukagua. Chukua kalamu ya kuangazia (highlighter) na uweke alama kwa kila swali ulilokosea. Hiyo ndiyo ramani yako ya marudio hapo hapo.

2. **Hatua ya pili: Tengeneza mpango wa "saa ya nguvu" (power hour).** Huna haja ya kusoma kwa saa tano mfululizo kama vile video za kutia moyo zinavyosema. Saa moja ya kuzingatia kwa siku inatosha kuanza. Chagua somo ambalo ni dhaifu zaidi, weka kipima muda kwenye simu yako, na ufanye mazoezi tu — hakuna WhatsApp, hakuna TikTok, hakuna usumbufu. Hata ukiwa kwenye matatu ukielekea nyumbani, unaweza kupitia maelezo yako (notes). Saa moja kwa siku kwa wiki tatu ni saa 21 za mazoezi ya ziada. Hiyo inatosha kupandisha daraja la alama.

3. **Hatua ya tatu: Tafuta mshirika wa kusoma — aliye siriazi.** Si rafiki yako wa karibu ambaye atakufanya ucheke muda wote. Tafuta mtu darasani ambaye anafanya vizuri kidogo kuliko wewe katika somo ambalo unahangaika nalo na umwulize kama mnaweza kufanya marudio pamoja. Kufundishana ni moja ya njia bora za kujifunza. Undeni kikundi kidogo, kutaneni wakati wa chakula cha mchana au baada ya shule, na muulizane maswali.

Wewe si mjinga. Unahitaji tu mpango. Hata wanafunzi wanaopata alama za A walianza mahali fulani. Ukweli kwamba unasoma hili unaonyesha unajali — na hiyo tayari ni hatua ya kwanza. Endelea hivyo, unaweza kufanya hivyo.`,
    month: 1,
  },
  {
    id: 'sl-2',
    title: 'How to study when you do not feel like it',
    title_sw: 'Jinsi ya kusoma hata wakati huna hamu ya kufanya hivyo',
    category: 'school',
    tags: ['School', 'Exams'],
    emoji: '📚',
    readTime: '3 min',
    body: `Let us keep it real — nobody wakes up every morning excited to open a Biology textbook. Even the top students in your class have days when they would rather scroll through TikTok or sleep an extra hour. The difference is not motivation. It is strategy.

Here is how to study even when your brain says "not today":

1. **Start with the easiest thing.** When you have zero energy, do not begin with the hardest topic. If you are supposed to revise Chemistry but you cannot face organic chemistry right now, start with something lighter — maybe rewriting your notes neatly or doing simple formula practice. Once you start, your brain warms up like an engine. After 10 minutes, you will be in the zone.

2. **Use the "chapati method" — small rounds.** When your mum makes chapati, she does not roll one giant one. She makes small rounds. Do the same with studying. Set a timer for 20 minutes, study hard, then take a 5-minute break. Do three rounds. That is a full hour of quality work and it feels way less painful than sitting for 60 minutes straight.

3. **Change your environment.** If your bedroom is where you sleep and relax, your brain will want to sleep and relax when you try studying there. Move to the dining table, the veranda, or even under a tree in the compound. Some students study best at school during morning preps. Find the spot where your brain switches to "work mode."

4. **Reward yourself after.** Finished a revision session? Watch one episode of your favourite show. Did all your Maths homework? Treat yourself to a cold soda. Your brain responds to rewards. It will learn that studying leads to good things.

You do not need to feel like studying to actually study. Just start, keep it short, and watch the magic happen. Kidogo kidogo, you will surprise yourself.`,
    body_sw: `Wacha tuwe wakweli — hakuna anayeamka kila asubuhi akiwa na shauku ya kufungua kitabu cha Biolojia. Hata wanafunzi bora zaidi darasani kwako wana siku ambazo wangependa tu kupitia TikTok au kulala saa moja zaidi. Tofauti si hamu (motivation). Ni mkakati (strategy).

Hivi ndivyo unavyoweza kusoma hata wakati ubongo wako unasema "si leo":

1. **Anza na kitu rahisi zaidi.** Unapokuwa huna nguvu kabisa, usianze na mada ngumu zaidi. Ikiwa unapaswa kurudia Kemia lakini huwezi kukabiliana na kemia ya kaboni (organic chemistry) sasa hivi, anza na kitu chepesi — labda kuandika upya maelezo yako kwa nadhifu au kufanya mazoezi rahisi ya fomula. Mara tu unapoanza, ubongo wako unapata joto kama injini. Baada ya dakika 10, utakuwa tayari kuendelea.

2. **Tumia "njia ya chapati" — raundi ndogo.** Mama yako anapopika chapati, hatandazi moja kubwa ya ajabu. Anatengeneza raundi ndogo. Fanya vivyo hivyo na kusoma. Weka kipima muda kwa dakika 20, soma kwa bidii, kisha pumzika kwa dakika 5. Fanya raundi tatu. Hiyo ni saa nzima ya kazi bora na inahisi kutokuwa na maumivu zaidi kuliko kukaa kwa dakika 60 mfululizo.

3. **Badilisha mazingira yako.** Ikiwa chumba chako cha kulala ndipo unapolala na kupumzika, ubongo wako utataka kulala na kupumzika unapojaribu kusoma hapo. Hamia kwenye meza ya chakula, ukumbini (veranda), au hata chini ya mti kwenye boma. Baadhi ya wanafunzi husoma vizuri shuleni wakati wa vipindi vya asubuhi vya ziada (preps). Tafuta mahali ambapo ubongo wako unabadilika na kuingia katika "hali ya kazi."

4. **Jizawadi baada ya kumaliza.** Umemaliza kipindi cha marudio? Tazama kipindi kimoja cha onyesho unalolipenda. Umemaliza kazi yako yote ya nyumbani ya Hisabati? Jizawadi na soda baridi. Ubongo wako unaitikia zawadi. Utajifunza kuwa kusoma kunaleta mambo mazuri.

Huna haja ya kujisikia kama unataka kusoma ili uweze kusoma kweli. Anza tu, fanya kwa muda mfupi, na utazame uchawi ukitokea. Kidogo kidogo, utajishangaza mwenewe.`,
    month: 1,
  },
  {
    id: 'sl-3',
    title: 'Last-minute revision that actually works',
    title_sw: 'Marudio ya dakika ya mwisho yanayofanya kazi kweli',
    category: 'school',
    tags: ['Exams', 'School'],
    emoji: '⏰',
    readTime: '2 min',
    body: `Exam is tomorrow and you have barely revised? First, do not panic. Panicking wastes the little time you have. Second, stop trying to cover everything — that ship has sailed. Let us be strategic with the hours you have left.

Here is your last-minute survival plan:

1. **Focus on past papers, not the textbook.** KCSE and KCPE questions repeat patterns. If you have even one past paper, look at it and identify the topics that appear most often. In Maths, for example, simultaneous equations, statistics, and geometry show up almost every year. Study those first and skip the topics with less weight. This is not cheating — it is being smart with limited time.

2. **Make "cheat sheets" — the legal kind.** Write the key formulas, definitions, or dates on one page per subject. Use different colours if you can. Read through this sheet three times before bed and once in the morning. Your brain remembers things it sees repeatedly in a short time. Some students stick these on the bathroom mirror and revise while brushing teeth — you would be surprised how well it works.

3. **Teach it to someone else.** Grab your sibling, your desk-mate, even your reflection in the mirror. Explain the topic out loud as if you are the teacher. When you try to teach, your brain organizes the information automatically. The parts you cannot explain? Those are the gaps to fill.

Also — please sleep. Staying up all night actually makes your brain work worse. Even five hours of sleep is better than zero. Your brain processes and stores information while you sleep.

You might not get an A, but you can definitely do better than you think. Jikaze, do your best, and walk into that exam room with your head up.`,
    body_sw: `Mtihani ni kesho na bado hujafanya marudio yoyote? Kwanza, usiwe na wasiwasi (panic). Kuwa na wasiwasi kunapoteza muda mchache ulio nao. Pili, acha kujaribu kusoma kila kitu — nafasi hiyo imeshapita. Hebu tuwe na mkakati na saa chache ulizobaki nazo.

Huu hapa ni mpango wako wa kuokoa maisha dakika ya mwisho:

1. **Zingatia makaratasi yaliyopita (past papers), si kitabu cha kiada.** Maswali ya KCSE na KCPE hurudia mifumo fulani. Ikiwa una hata karatasi moja ya zamani, itazame na utambue mada zinazoonekana mara nyingi. Katika Hisabati, kwa mfano, milinganyo (simultaneous equations), takwimu (statistics), na jiometri (geometry) huonekana karibu kila mwaka. Soma hizo kwanza na upuuze mada zisizo na uzito mkubwa. Huku si kudanganya — ni kuwa mjanja na muda mfupi ulio nao.

2. **Tengeneza "karatasi za ujanja" (cheat sheets) — zile za halali.** Andika fomula muhimu, maelezo, au tarehe kwenye ukurasa mmoja kwa kila somo. Tumia rangi tofauti ukiweza. Soma karatasi hii mara tatu kabla ya kulala na mara moja asubuhi. Ubongo wako unakumbuka vitu unavyoviona mara kwa mara kwa muda mfupi. Baadhi ya wanafunzi hubandika hizi kwenye kioo cha bafuni na kusoma wanapopiga mswaki — utashangaa jinsi inavyofanya kazi vizuri.

3. **Mfundishe mtu mwingine.** Mchukue ndugu yako, mwenzako wa kuketi naye, au hata taswira yako kwenye kioo. Elezea mada hiyo kwa sauti kana kwamba wewe ndiye mwalimu. Unapojaribu kufundisha, ubongo wako hupanga habari hiyo kiotomatiki. Sehemu ambazo huwezi kuelezea? Hizo ndizo sehemu za kujaza mapengo.

Pia — tafadhali lala. Kaa macho usiku kucha hufanya ubongo wako kufanya kazi vibaya zaidi. Hata saa tano za kulala ni bora kuliko kutosinzia kabisa. Ubongo wako hupanga na kuhifadhi habari ukiwa umelala.

Unaweza usipate A, lakini hakika unaweza kufanya vizuri zaidi kuliko unavyofikiri. Jikaze, fanya uwezavyo, na uingie kwenye chumba cha mtihani ukiwa umejiinua kichwa.`,
    month: 1,
  },
  {
    id: 'sl-4',
    title: 'How to ask your teacher for help without feeling awkward',
    title_sw: 'Jinsi ya kumwomba mwalimu wako msaada bila kuhisi vibaya',
    category: 'school',
    tags: ['School', 'Confidence'],
    emoji: '🙋',
    readTime: '2 min',
    body: `We have all been there — the teacher finishes explaining something, asks "Any questions?" and the whole class goes silent. You are confused but you do not want to be the one who looks dumb. So you keep quiet and hope it will make sense later. Spoiler: it usually does not.

Here is how to ask for help without the awkwardness:

1. **Go after class, not during.** If asking in front of 45 students feels terrifying, wait until the lesson ends. Walk up to the teacher's desk and say something simple like, "Mwalimu, I did not understand the part about X. Can you explain it differently?" Most teachers actually respect students who seek them out. It shows you care.

2. **Be specific about what you do not understand.** Instead of saying "I do not get anything," say "I understand steps 1 and 2 but I get lost at step 3." This helps your teacher know exactly where to help. It also shows you tried, which makes them more willing to spend time with you.

3. **Bring your attempt with you.** If it is a Maths problem, show your working out even if it is wrong. If it is an essay, bring your draft. Teachers are more helpful when they see effort. Showing up with an empty page and saying "I do not know" gives them nothing to work with.

And here is a secret — teachers talk in the staffroom about students who come for extra help, and they talk about them **positively**. You will not be seen as weak. You will be seen as serious.

The bravest thing in school is not knowing all the answers. It is having the courage to say, "I do not understand." That is how every smart person you know got smart. Usiogope kuuliza — knowledge belongs to those who seek it.`,
    body_sw: `Sote tumewahi kupitia hapo — mwalimu anamaliza kueleza jambo fulani, anauliza "Maswali yoyote?" na darasa zima linakuwa kimya. Umechanganyikiwa lakini hutaki kuwa yule anayeonekana mjinga. Kwa hivyo unakaa kimya na kutumaini kuwa utaelewa baadaye. Ukweli ni huu: kawaida huelewi.

Hivi ndivyo unavyoweza kuomba msaada bila kuhisi vibaya:

1. **Nenda baada ya kipindi, si wakati wa kipindi.** Ikiwa kuuliza mbele ya wanafunzi 45 kunakutisha, subiri hadi somo liishe. Tembea hadi kwenye meza ya mwalimu na useme kitu rahisi kama, "Mwalimu, sijaelewa sehemu inayohusu X. Unaweza kunielezea kwa njia nyingine?" Walimu wengi huwaheshimu wanafunzi wanaowatafuta. Inaonyesha unajali.

2. **Kuwa mahususi kuhusu kile usichoelewa.** Badala ya kusema "sielewi kitu chochote," sema "naelewa hatua ya 1 na 2 lakini napotea kwenye hatua ya 3." Hii inamsaidia mwalimu wako kujua hasa pa kukusaidia. Pia inaonyesha ulijaribu, jambo linalowafanya wawe tayari kutumia muda na wewe.

3. **Njoo na jaribio lako.** Ikiwa ni swali la Hisabati, onyesha ulivyojaribu kuhesabu hata kama ni makosa. Ikiwa ni insha, njoo na nakala yako ya kwanza. Walimu husaidia zaidi wanapoona juhudi. Kufika na ukurasa mtupu na kusema "sijui" hakumpatii mwalimu pa kuanzia.

Na hapa kuna siri — walimu huzungumza kwenye chumba cha walimu (staffroom) kuhusu wanafunzi wanaokuja kuomba msaada wa ziada, na wanazungumza kuwahusu **kwa njia nzuri**. Hautaonekana kama dhaifu. Utaonekana kama mtu siriazi.

Jambo la kishujaa zaidi shuleni si kujua majibu yote. Ni kuwa na ujasiri wa kusema, "Sielewi." Hivyo ndivyo kila mtu mwerevu unayemjua alivyokuwa mwerevu. Usiogope kuuliza — maarifa ni ya wale wanaoyatafuta.`,
    month: 1,
  },

  // ▸ Mental Health & Emotions
  {
    id: 'mh-1',
    title: 'Feeling overwhelmed? Try this 5-minute reset',
    category: 'mental-health',
    tags: ['Stress', 'MentalHealth'],
    emoji: '🧘',
    readTime: '2 min',
    body: `Sometimes everything hits at once — homework piling up, parents shouting, friendship drama, exams next week. Your chest feels tight, your head is spinning, and you just want to scream or disappear. You are not going crazy. You are overwhelmed. And it happens to literally everyone.

Here is a quick 5-minute reset you can do anywhere — in your room, at school, even at the back of a matatu:

1. **Breathe like this: 4-7-8.** Breathe in through your nose for 4 seconds. Hold it for 7 seconds. Breathe out slowly through your mouth for 8 seconds. Do this three times. This is not woo-woo nonsense — it actually tells your brain to calm down. Your heart rate drops, your muscles relax. Try it right now as you read this.

2. **Name five things you can see.** Look around and say them in your head: the wall, a pen, your shoe, a tree outside, a book. This is called grounding and it pulls your brain out of panic mode and into the present moment. Some people also touch three different textures — the desk, their shirt, their hair — to reconnect with their body.

3. **Write a brain dump.** Grab any paper — even the back of your exercise book — and write down everything that is stressing you. Do not organize it, do not make it neat. Just dump it all out. Seeing your worries on paper makes them smaller. They go from a hurricane in your head to a list on a page. And lists can be tackled one by one.

After these five minutes, you will not have solved everything. But you will feel calmer and more in control. That is enough for now. Take it one step at a time. Pole pole ndio mwendo — slowly is also moving forward.`,
    title_sw: 'Unahisi umelemewa? Jaribu mbinu hii ya dakika 5',
    body_sw: `Wakati mwingine kila kitu huja kwa pamoja — kazi za shule nyingi, wazazi wanaofoka, mivutano na marafiki, mitihani wiki ijayo. Kifua chako kinajihisi kuwa na uzito, kichwa chako kinazunguka, na unataka tu kupiga kelele au kutoweka. Huchanganyikiwi. Umelemewa tu na mambo mengi. Na jambo hili linampata kila mtu.

Hapa kuna mbinu ya haraka ya dakika 5 unayoweza kufanya mahali popote — chumbani kwako, shuleni, au hata nyuma ya matatu:

1. **Vuta pumzi hivi: 4-7-8.** Vuta pumzi kupitia pua yako kwa sekunde 4. Izuie kwa sekunde 7. Toa pumzi polepole kupitia mdomo wako kwa sekunde 8. Fanya hivi mara tatu. Hii si hadithi tu — inakiambia kichwa chako kitulie. Mapigo ya moyo yanapungua, na misuli yako inalegea. Jaribu hivi sasa unaposoma hapa.

2. **Taja vitu tano unavyoweza kuona.** Angalia pembeni na uvitaje kichwani mwako: ukuta, kalamu, kiatu chako, mti ulioko nje, kitabu. Hii inaitwa "grounding" na inasaidia akili yako kutoka kwenye hali ya wasiwasi na kurudi kwenye wakati uliopo. Baadhi ya watu pia hugusa vitu vitatu tofauti — dawati, shati lao, nywele zao — ili kuunganisha tena akili na miili yao.

3. **Toa kila kitu kinachokukera.** Chukua karatasi yoyote — hata nyuma ya kitabu chako cha mazoezi — na uandike kila kitu kinachokupa msongo wa mawazo. Usipange kwa utaratibu, wala usijaribu kuandika kwa nadhifu. Toa kila kitu kichwani. Kuona wasiwasi wako kwenye karatasi kunaifanya ionekane kuwa ndogo zaidi. Inatoka kuwa kimbunga kichwani mwako na kuwa orodha kwenye karatasi. Na orodha inaweza kushughulikiwa hatua kwa hatua.

Baada ya dakika hizi tano, huenda usiwe umetatua kila kitu. Lakini utajihisi mtulivu zaidi na mwenye udhibiti. Hiyo inatosha kwa sasa. Chukua hatua moja baada ya nyingine. Pole pole ndio mwendo — hata mwendo wa polepole ni maendeleo.`,
    month: 1,
  },
  {
    id: 'mh-2',
    title: 'How to deal with pressure from school and home',
    category: 'mental-health',
    tags: ['Stress', 'MentalHealth', 'School'],
    emoji: '💙',
    readTime: '4 min',
    body: `"Why did you get a B? Your cousin got an A." "If you do not pass KCSE, do not come back to this house." "You think we are paying school fees for you to play?" Sound familiar? Pressure from school and home can feel like carrying two bags of cement up a hill — on both shoulders.

Here is how to handle it without breaking:

1. **Understand that most pressure comes from love — even when it does not feel like it.** Your parents are not trying to torture you. Many Kenyan parents grew up with even less and they see education as your ticket to a better life. They push hard because they care. This does not make the pressure okay, but understanding where it comes from can help you not take it so personally.

2. **Have an honest conversation.** This is hard, but powerful. Pick a calm moment — not during an argument — and tell your parent or guardian how you feel. Something like, "Mum, I know you want the best for me. But when you compare me to others, it makes me feel like I am not enough. I am trying my best." You might be surprised at their response.

3. **Set small goals you can control.** You cannot control your final KCSE grade right now, but you can control whether you revise for one hour today. Focus on the small wins. Finished your homework? Win. Understood a topic you struggled with? Win. These add up, and they also give you something real to show when parents ask about your progress.

4. **Find your pressure valve.** Everyone needs an outlet. For some people it is football, for others it is drawing, music, or just walking around the estate. When the pressure builds, you need somewhere to release it that is not destructive. Even 20 minutes of doing something you enjoy can reset your mental state.

You are doing better than you think. The fact that you feel the pressure means you care about your future. That is a strength, not a weakness. Hang in there — this season will pass.`,
    title_sw: 'Jinsi ya kukabiliana na msukumo kutoka shuleni na nyumbani',
    body_sw: `"Kwa nini ulipata B? Binamu yako alipata A." "Ikiwa hautapita KCSE, usirudi kwenye hii nyumba." "Unafikiri tunalipa karo ili ucheze?" Je, maneno haya unayafahamu? Msukumo kutoka shuleni na nyumbani unaweza kujihisi kama kubeba mifuko miwili ya simiti kupanda mlima — kwenye kila bega.

Hivi ndivyo unavyoweza kukabiliana na hali hiyo bila kuvunjika moyo:

1. **Elewa kwamba msukumo mwingi unatokana na upendo — hata wakati hauhisi hivyo.** Wazazi wako hawajaribu kukutesa. Wazazi wengi nchini Kenya walikua na maisha magumu zaidi na wanaona elimu kama tiketi yako ya maisha bora. Wanakusukuma kwa sababu wanakujali. Hii haimaanishi kuwa msukumo huo ni sawa, lakini kuelewa unapotokea kunaweza kukusaidia usichukulie mambo hayo kama mashambulizi kwako binafsi.

2. **Kuwa na mazungumzo ya ukweli.** Hili ni gumu, lakini lina nguvu. Tafuta wakati wa utulivu — si wakati wa mabishano — na umwambie mzazi au mlezi wako unavyohisi. Kwa mfano, "Mama, najua unanitakia mema. Lakini unaponilinganisha na wengine, inanifanya nihisi kama sifanyi vya kutosha. Ninajitahidi kwa uwezo wangu wote." Unaweza kushangazwa na majibu yao.

3. **Weka malengo madogo unayoweza kudhibiti.** Huwezi kudhibiti alama yako ya mwisho ya KCSE hivi sasa, lakini naweza kudhibiti ikiwa utajisomea kwa saa moja leo. Lenga kwenye mafanikio madogo. Umemaliza kazi ya shule? Hayo ni mafanikio. Umeelewa mada uliyokuwa unatatizika nayo? Hayo ni mafanikio. Haya yanajikusanya, na pia yanakupa jambo halisi la kuonyesha wazazi wanapouliza kuhusu maendeleo yako.

4. **Tafuta njia ya kutoa shinikizo.** Kila mtu anahitaji njia ya kutoa msongo wa mawazo. Kwa baadhi ya watu ni kucheza soka, kwa wengine ni kuchora, muziki, au kutembea tu mtaani. Wakati msukumo unapozidi, unahitaji mahali pa kuutolea pasipokuwa na madhara. Hata dakika 20 za kufanya jambo unalofurahia zinaweza kubadilisha hali yako ya kiakili.

Unafanya vizuri zaidi kuliko unavyofikiria. Ukweli kwamba unahisi msukumo unamaanisha unajali kuhusu hatima yako. Hiyo ni nguvu, si udhaifu. Vumilia — kipindi hiki kitapita.`,
    month: 1,
  },
  {
    id: 'mh-3',
    title: 'What to do when you feel like you are not good enough',
    category: 'mental-health',
    tags: ['Confidence', 'MentalHealth'],
    emoji: '❤️',
    readTime: '3 min',
    body: `That feeling when everyone else seems to have it together and you are just... struggling. Your classmate gets picked for the team and you do not. Your friend's parents buy them new shoes and yours cannot afford it. You look at social media and everyone seems happier, smarter, better-looking. And a little voice whispers, "You are not good enough."

Let me tell you something — that voice is lying. Here is how to fight back:

1. **Stop comparing your inside to everyone else's outside.** That classmate who always seems confident? They might cry at home. That friend who posts perfect pictures on WhatsApp status? They might be lonely. You are comparing your messy, unfiltered reality to other people's highlight reel. It is an unfair game and you will always lose.

2. **Make a list of things you have survived.** Seriously, grab a pen. That tough exam you sat through? You survived it. That time things were hard at home and you still showed up to school? Strength. You have already done hard things. You have already been brave. Write them down and read the list when the doubt creeps in.

3. **Talk to someone you trust.** These feelings get heavier when you carry them alone. Talk to a friend, an older sibling, a teacher, a school counsellor, or even Amara right here on this app. Saying "I have been feeling like I am not good enough" out loud takes away some of its power.

4. **Be kind to yourself the way you would be kind to a friend.** If your best friend came to you and said, "I am useless," you would never agree. You would say, "Are you crazy? You are amazing!" Give yourself that same energy. You deserve your own kindness.

You are enough. Not when you get better grades, not when you look different, not when you achieve something big. Right now, as you are. Umetosha.`,
    title_sw: 'La kufanya unapohisi kuwa hautoshi',
    body_sw: `Ule hisia wakati kila mtu mwingine anaonekana kuwa na maisha bora na wewe tu... unataabika. Mwanafunzi mwenzako anachaguliwa kwenye timu na wewe huchaguliwi. Wazazi wa rafiki yako wanawanunulia viatu vipya na wako hawawezi kumudu. Unaangalia mitandao ya kijamii na kila mtu anaonekana mwenye furaha zaidi, mwerevu zaidi, na mwenye kuvutia zaidi. Na sauti ndogo inakuambia, "Wewe hautoshi."

Wacha nikuambie jambo — sauti hiyo inasema uongo. Hivi ndivyo unavyoweza kupambana nayo:

1. **Acha kulinganisha siri zako za ndani na sura za nje za wengine.** Yule mwanafunzi mwenzako anayeonekana anajiamini kila wakati? Huenda analia akiwa nyumbani. Yule rafiki anayeweka picha nzuri kwenye WhatsApp status? Huenda ana upweke. Unalinganisha hali yako halisi iliyo na changamoto na picha nzuri tu za watu wengine. Huo ni mchezo usio wa haki na utashindwa kila wakati.

2. **Andika orodha ya mambo uliyoyashinda.** Kwa kweli, chukua kalamu. Ule mtihani mgumu ulioufanya? Uliushinda. Wakati ule mambo yalikuwa magumu nyumbani na bado ukaenda shuleni? Hiyo ni nguvu. Tayari umefanya mambo magumu. Tayari umekuwa mjasiri. Yaandike na usome orodha hiyo wakati mashaka yanapoanza kukuingia.

3. **Zungumza na mtu unayemwamini.** Hisia hizi zinakuwa nzito zaidi unapoziweka moyoni peke yako. Zungumza na rafiki, kaka au dada mkubwa, mwalimu, mshauri wa shule, au hata Amara hapa kwenye programu hii. Kusema "Nimekuwa nikihisi kama sifanyi vya kutosha" kwa sauti kunaondoa baadhi ya nguvu ya hisia hiyo.

4. **Kuwa na huruma kwako mwenyewe kama unavyoweza kuwa na huruma kwa rafiki.** Ikiwa rafiki yako wa karibu angekuja kwako na kusema, "Mimi niko bure," kamwe usingekubali. Ungesema, "Umechanganyikiwa? Wewe ni mzuri sana!" Jipe nguvu hiyo hiyo. Unastahili huruma yako mwenyewe.

Unatosha. Si wakati utakapopata alama bora zaidi, si wakati utakapobadilisha sura yako, na si wakati utakapofanikiwa jambo kubwa. Ni sasa hivi, jinsi ulivyo. Umetosha.`,
    month: 1,
  },
  {
    id: 'mh-4',
    title: 'Overthinking at night? Here is how to stop',
    category: 'mental-health',
    tags: ['Stress', 'MentalHealth'],
    emoji: '🌙',
    readTime: '3 min',
    body: `It is 11 PM. You are lying in bed, staring at the ceiling, and your brain will not shut up. "Did I say something stupid today?" "What if I fail the exam?" "Does my friend actually like me?" The thoughts spin like a washing machine and sleep feels impossible.

You are not alone in this — and there are real ways to calm a noisy mind:

1. **Do a "worry dump" before bed.** Keep a small notebook or even your phone notepad next to your bed. Before you lie down, spend 5 minutes writing every thought that is buzzing in your head. "I am worried about the Maths test." "I think Sarah is angry at me." "I do not know what to wear tomorrow." Getting thoughts out of your head and onto paper tells your brain, "It is stored somewhere safe, you can let go now."

2. **Use the "tomorrow" trick.** For every worry, ask yourself: "Can I do anything about this right now, at 11 PM?" The answer is almost always no. So tell yourself, "I will deal with this tomorrow at 8 AM." Give it a specific time. Your brain relaxes when it knows there is a plan, even if the plan is just "later."

3. **Bore your brain to sleep.** This sounds funny but it works. Pick a category — like counties in Kenya — and try to name them alphabetically. Baringo, Bomet, Bungoma... By the time you reach Kisii, your brain is so bored with the exercise that it gives up and falls asleep. You can also count backwards from 300 by threes.

4. **Put the phone away.** The blue light from your screen actually tells your brain to stay awake. And scrolling through social media at night feeds the comparison monster. Try putting your phone across the room — not next to your pillow — at least 30 minutes before you want to sleep.

Your thoughts at night are louder than they are true. Morning always brings a clearer perspective. Lala salama — tomorrow is a new day.`,
    title_sw: 'Unawaza kupita kiasi usiku? Hivi ndivyo unavyoweza kuacha',
    body_sw: `Ni saa tano usiku. Umelala kitandani, unaangalia dari, na ubongo wako haunyamazi. "Je, nilisema jambo la kijinga leo?" "Je, nitafeli mtihani?" "Je, rafiki yangu ananipenda kweli?" Mawazo yanazunguka kama mashine ya kufua na usingizi unakuwa ndoto.

Huko peke yako katika hili — na kuna njia halisi za kutuliza akili yenye kelele:

1. **Toa wasiwasi wako kabla ya kulala.** Weka kijitabu kidogo au hata notepad ya simu yako karibu na kitanda chako. Kabla ya kulala, tumia dakika 5 kuandika kila wazo linalozunguka kichwani mwako. "Nina wasiwasi kuhusu mtihani wa Hisabati." "Nadhani Sarah amenikasirikia." "Sijui nivae nini kesho." Kutoa mawazo kichwani na kuyaweka kwenye karatasi kuuambia ubongo wako, "Yamehifadhiwa mahali salama, unaweza kupumzika sasa."

2. **Tumia mbinu ya "kesho".** Kwa kila wasiwasi, jiulize: "Je, ninaweza kufanya lolote kuhusu hili sasa hivi, saa tano usiku?" Jibu karibu kila mara ni hapana. Hivyo jiambie, "Nitashughulikia hili kesho saa mbili asubuhi." Ipe muda maalum. Ubongo wako unalegea unapojua kuna mpango, hata kama mpango huo ni wa "baadaye."

3. **Uchoshe ubongo wako ulale.** Hii inasikika kama inachekesha lakini inafanya kazi. Chagua aina fulani ya vitu — kama kaunti za Kenya — na jaribu kuzitaja kwa kufuata alfabeti. Baringo, Bomet, Bungoma... Unapofika Kisii, ubongo wako unachoka sana na zoezi hilo kiasi kwamba unakata tamaa na unalala. Unaweza pia kuhesabu kinyume kuanzia 300 kwa kuruka namba tatu-tatu.

4. **Weka simu mbali.** Mwanga wa bluu kutoka kwenye kioo chako unauambia ubongo wako ukae macho. Na kuangalia mitandao ya kijamii usiku kunachochea hali ya kujiwekea mashaka. Jaribu kuweka simu yako mbali — si karibu na mto wako — angalau dakika 30 kabla ya kutaka kulala.

Mawazo yako usiku yana kelele nyingi kuliko ukweli. Asubuhi kila mara huleta mtazamo ulio wazi zaidi. Lala salama — kesho ni siku mpya.`,
    month: 1,
  },

  // ▸ Relationships & Social Life
  {
    id: 'rs-1',
    title: 'Getting bullied? Here is what to do and what not to do',
    title_sw: 'Unadhulumiwa (Bullying)? Hivi ndivyo unavyoweza kujilinda',
    category: 'relationships',
    tags: ['Safety', 'Friendship', 'Confidence'],
    emoji: '🛡️',
    readTime: '4 min',
    body: `Bullying is real and it happens in Kenyan schools more than people want to admit. Maybe someone is calling you names, spreading rumours in the class WhatsApp group, taking your lunch money, or even getting physical. It hurts — and it is NOT your fault.

Here is what to do and what to avoid:

1. **DO tell a trusted adult.** I know this sounds like the most boring advice ever, but it works. Tell a teacher, a parent, your school counsellor, or a prefect you trust. If the first person does not help, tell someone else. Keep telling until someone listens. You can also call Childline Kenya on 116 — it is free and confidential.

2. **DO NOT fight back with violence.** I know the temptation is real. But fighting back usually makes things worse — you could get hurt, expelled, or end up in trouble yourself. The bully wants a reaction. If you can stay calm, you take away their power.

3. **DO keep evidence.** If the bullying happens on WhatsApp, texts, or social media, screenshot everything. If it happens at school, write down what happened, when, and who was there. This evidence helps when you report it. Adults take you more seriously when you have proof.

4. **DO NOT isolate yourself.** Bullies target people who are alone. Stay near friends, walk home with others, and sit with people during break. If you feel like you have no friends, look for clubs or groups at school where you can meet new people. Even one ally makes a huge difference.

Here is the truth — being bullied does not mean there is something wrong with you. Some of the most successful people in Kenya were bullied in school. It does not define you. What defines you is how you handle it and who you become after. Stay strong. Uko sawa.`,
    body_sw: `Kudhulumiwa au "bullying" ni jambo halisi na hutendeka katika shule za Kenya zaidi ya watu wanavyotaka kukiri. Labda kuna mtu anakuita majina mabaya, anaeneza uvumi kwenye kikundi cha WhatsApp cha darasa, anachukua pesa zako za chakula, au hata kukupiga. Inauma — na SI kosa lako.

Hivi ndivyo unavyopaswa kufanya na kile unachopaswa kuepuka:

1. **MWAMBIE mtu mzima unayemwamini.** Najua hili linaonekana kama ushauri unaochosha zaidi, lakini linafanya kazi. Mwambie mwalimu, mzazi, mshauri wa shule, au mlinzi (prefect) unayemwamini. Ikiwa mtu wa kwanza hakusaidii, mwambie mwingine. Endelea kusema mpaka mtu asikilize. Unaweza pia kupiga simu kwa Childline Kenya kupitia nambari 116 — ni bure na haitambuliki.

2. **USILIPE kisasi kwa vurugu.** Najua kishawishi ni kikubwa. Lakini kulipiza kisasi kwa kawaida hufanya mambo kuwa mabaya zaidi — unaweza kuumia, kufukuzwa shule, au kuingia kwenye matatizo wewe mwenyewe. Mdhalilishaji anataka uonyeshe hasira. Ikiwa unaweza kutulia, unachukua nguvu zao.

3. **WEKA ushahidi.** Ikiwa udhalilishaji unatokea kwenye WhatsApp, ujumbe mfupi, au mitandao ya kijamii, piga picha ya skrini (screenshot) kila kitu. Ikiwa inatokea shuleni, andika kile kilichotokea, lini, na nani alikuwepo. Ushahidi huu husaidia unaporipoti. Watu wazima hukuamini zaidi unapokuwa na ushahidi.

4. **USIJITENGE.** Wadhulumiwa huwalenga watu walio peke yao. Kaa karibu na marafiki, tembea nyumbani na wengine, na keti na watu wakati wa mapumziko. Ikiwa unahisi huna marafiki, tafuta vilabu au vikundi shuleni ambapo unaweza kukutana na watu wapya. Hata mshirika mmoja anafanya tofauti kubwa.

Huu ndio ukweli — kudhulumiwa haimaanishi kuwa kuna kitu kibaya kwako. Baadhi ya watu waliofanikiwa zaidi nchini Kenya walidhulumiwa shuleni. Hilo halikufanyi uwe mnyonge. Kinachokufanya uwe mshindi ni jinsi unavyokabiliana nalo na jinsi unavyokuwa baada ya hapo. Jikaze. Uko sawa.`,
    month: 1,
  },
  {
    id: 'rs-2',
    title: 'Friend drama? How to handle it without making things worse',
    title_sw: 'Mizozo na marafiki? Jinsi ya kuisuluhisha bila kuongeza chumvi',
    category: 'relationships',
    tags: ['Friendship', 'Decisions'],
    emoji: '💬',
    readTime: '3 min',
    body: `Your best friend is not talking to you. Or two friends are fighting and you are stuck in the middle. Or someone said something behind your back and now the whole class knows. Welcome to friend drama — the unofficial extra subject in Kenyan schools.

Here is how to handle it without pouring fuel on the fire:

1. **Do not make it a WhatsApp group spectacle.** When drama starts, the worst thing you can do is screenshot messages and share them, or vent in a group chat. What starts as two people disagreeing becomes 40 people picking sides. Keep it between the people involved. If someone sends you gossip, do not forward it. Be the person who stops the chain, not the one who extends it.

2. **Talk face to face, not through texts.** Messages get misread. Tone disappears in text. That "okay" your friend sent? You read it as angry, but they were just in a hurry. If you have a problem with someone, talk to them directly. Pull them aside during break and say, "I heard something and I want to hear your side." Face-to-face conversations solve things ten times faster than texting.

3. **Listen before you react.** When you are angry, you want to talk. But the smartest move is to listen first. Let your friend explain. Maybe there was a misunderstanding. Maybe they are going through something you do not know about. Sometimes what looks like betrayal is actually just miscommunication.

4. **Know when to step back.** Not every friendship drama needs you in the middle. If two friends are fighting, you do not have to pick a side. You can say, "I care about both of you and I do not want to be in the middle." That is not being a coward — it is being wise.

Friend drama is normal at your age. But how you handle it shows your maturity. Be the calm one. Be the peacemaker. Uwe mtu wa amani.`,
    body_sw: `Rafiki yako wa dhati hazungumzi nawe. Au marafiki wawili wanagombana na wewe umenaswa katikati. Au mtu amesema jambo nyuma ya mgongo wako na sasa darasa zima linajua. Karibu kwenye "drama" za marafiki — somo la ziada lisilo rasmi katika shule za Kenya.

Hivi ndivyo unavyoweza kukabiliana nayo bila kuongeza chumvi kwenye mzozo:

1. **Usifanye mzozo kuwa tamasha la kikundi cha WhatsApp.** Drama inapoanza, jambo baya zaidi unaloweza kufanya ni kupiga picha za skrini (screenshots) za ujumbe na kuzisambaza, au kutoa hasira zako kwenye kikundi cha mazungumzo. Kile kinachoanza kama kutoelewana kwa watu wawili kinakuwa watu 40 wanaochagua upande. Iweke kati ya watu wanaohusika. Ikiwa mtu anakutumia umbea, usiusambaze. Kuwa mtu anayekata mnyororo wa uvumi, si yule anayeuongeza.

2. **Zungumzeni ana kwa ana, si kwa ujumbe.** Ujumbe unaweza kueleweka vibaya. Hisia hupotea kwenye maandishi. Lile neno "sawa" ambalo rafiki yako alituma? Unaweza kulisoma kama hasira, lakini walikuwa tu na haraka. Ikiwa una tatizo na mtu, zungumza naye moja kwa moja. Mwite kando wakati wa mapumziko na useme, "Nilisikia kitu na nataka kusikia upande wako." Mazungumzo ya ana kwa ana yanatatua mambo mara kumi haraka kuliko kutuma ujumbe.

3. **Sikiliza kabla ya kuchukua hatua.** Unapokuwa na hasira, unataka kuzungumza. Lakini hatua ya busara zaidi ni kusikiliza kwanza. Mruhusu rafiki yako aeleze. Labda kulikuwa na kuelewana vibaya. Labda wanapitia jambo ambalo hulijui. Wakati mwingine kile kinachoonekana kama usaliti ni ukosefu wa mawasiliano tu.

4. **Jua wakati wa kurudi nyuma.** Si kila drama ya urafiki inakuhitaji uwe katikati. Ikiwa marafiki wawili wanagombana, huna haja ya kuchagua upande mmoja. Unaweza kusema, "Ninawajali nyote wawili na sitaki kuwa katikati yenu." Hiyo si kuwa mwoga — ni kuwa na busara.

Drama za marafiki ni kawaida katika umri wako. Lakini jinsi unavyokabiliana nazo inaonyesha ukomavu wako. Kuwa mtulivu. Kuwa mpatanishi. Uwe mtu wa amani.`,
    month: 1,
  },
  {
    id: 'rs-3',
    title: 'How to say no without losing your friends',
    title_sw: "Jinsi ya kusema 'Hapana' bila kupoteza marafiki",
    category: 'relationships',
    tags: ['Friendship', 'Confidence'],
    emoji: '✋',
    readTime: '2 min',
    body: `"Come on, just try it." "Everyone else is doing it." "You think you are better than us?" Learning to say no is one of the hardest skills you will ever build — but also one of the most important.

Here is how to say no and still keep your friendships:

1. **Use the "broken record" technique.** Just keep repeating your answer calmly. "No, I am good." If they push: "No, seriously, I am good." If they push harder: "I said I am good, respect that." You do not need to explain yourself. You do not need a dramatic reason. "No" is a complete sentence.

2. **Blame something else if you need to.** If a straight no feels too hard, it is okay to use an excuse at first. "My mum will kill me." "I have to be somewhere." "I promised my teacher I would finish this." It is not lying — it is protecting yourself while you build the muscle to say no directly.

3. **Suggest an alternative.** If your friends want to do something risky and you do not want to, redirect the group. "Instead of going there, why do we not go watch the game?" or "Let us just chill at my place." Sometimes people follow bad ideas simply because no one offered a better one.

Here is the real talk: **friends who drop you for saying no were never your real friends.** Real friends respect your boundaries. They might tease you for a minute, but they will not pressure you into something that makes you uncomfortable.

Saying no gets easier with practice. The first time is terrifying. The tenth time is natural. And every time you say no to something wrong, you are saying yes to yourself. That is power. Usijali watu — jijali kwanza.`,
    body_sw: `"Haya, jaribu tu." "Kila mtu mwingine anafanya." "Unadhani wewe ni bora kuliko sisi?" Kujifunza kusema hapana ni moja ya ujuzi mgumu zaidi utakaowahi kujenga — lakini pia ni moja ya muhimu zaidi.

Hivi ndivyo unavyoweza kusema hapana na bado ukaweka urafiki wako:

1. **Tumia mbinu ya "rekodi iliyovunjika".** Endelea kurudia jibu lako kwa utulivu. "Hapana, niko sawa." Wakikuhimiza: "Hapana, kwa kweli, niko sawa." Wakikuhimiza zaidi: "Nimesema niko sawa, heshimu hilo." Huna haja ya kujieleza. Huna haja ya kutoa sababu ya kusisimua. "Hapana" ni jibu kamili.

2. **Laumu kitu kingine ikiwa unahitaji.** Ikiwa kusema hapana moja kwa moja kunahisi kuwa gumu sana, ni sawa kutumia kisingizio mwanzoni. "Mama yangu ataniua." "Ninapaswa kuwa mahali fulani." "Nilimwahidi mwalimu wangu kuwa nitamaliza hili." Siyo kusema uongo — ni kujilinda wakati unajenga ujasiri wa kusema hapana moja kwa moja.

3. **Pendekeza kitu kingine.** Ikiwa marafiki zako wanataka kufanya jambo hatarishi na wewe hutaki, badilisha mwelekeo wa kikundi. "Badala ya kwenda huko, kwa nini tusiende kutazama mchezo wa soka?" au "Wacha tupumzike tu nyumbani kwetu." Wakati mwingine watu hufuata mawazo mabaya kwa sababu tu hakuna mtu aliyetoa wazo bora.

Hapa kuna ukweli: **marafiki wanaokuacha kwa sababu ya kusema hapana hawakuwa marafiki zako wa kweli.** Marafiki wa kweli wanaheshimu mipaka yako. Wanaweza kukucheka kwa dakika moja, lakini hawatakushinikiza kufanya jambo linalokufanya ukose raha.

Kusema hapana inakuwa rahisi kwa mazoezi. Mara ya kwanza inatisha. Mara ya kumi inakuwa kawaida. Na kila wakati unaposema hapana kwa jambo baya, unasema ndiyo kwako mwenyewe. Hiyo ndiyo nguvu. Usijali watu — jijali kwanza.`,
    month: 1,
  },
  {
    id: 'rs-4',
    title: 'Crushes and distractions. How to stay focused',
    title_sw: 'Crushes na usumbufu. Jinsi ya kubaki makini na masomo',
    category: 'relationships',
    tags: ['School', 'Decisions'],
    emoji: '😊',
    readTime: '3 min',
    body: `Okay, let us talk about it — crushes. That person in class who makes your brain go fuzzy. You cannot concentrate during Kiswahili because they are sitting two rows ahead. You are checking your phone every five seconds hoping they texted. Your notebook has more doodles of their name than actual notes. We have all been there.

Here is how to handle crushes without letting them wreck your grades:

1. **Accept it — crushes are normal.** Having a crush does not mean something is wrong with you. It is a completely normal part of growing up. Your brain is literally wired to feel this way at your age. So do not beat yourself up about it. The problem is not the crush — it is when the crush takes over your whole life.

2. **Set "crush-free" study time.** This sounds funny but it works. When you sit down to revise, tell yourself: "For the next one hour, I am not thinking about them." Put your phone face-down so you are not tempted to check their WhatsApp status. One hour of focused study is worth more than three hours of distracted half-studying.

3. **Do not let a crush change who you are.** Some students start skipping class, changing friend groups, or acting differently just to impress someone. If you find yourself doing things you would not normally do, pause. The right person will like you as you are. If you have to change yourself, it is not worth it.

4. **Keep your priorities straight.** Here is the honest truth — you will have many crushes in your lifetime. But your KCSE results? That exam happens once. The opportunities you get from a good education last forever. That crush might not even be in your life in two years. Your education will be.

Like what? Like a crush is temporary. Your future is permanent. Enjoy the butterflies, but do not let them distract you from what matters. Balance ni kila kitu.`,
    body_sw: `Haya, wacha tuzungumze kuhusu — "crushes". Yule mtu darasani anayefanya ubongo wako uwe na ukungu. Huwezi kusikiliza mwalimu wakati wa somo la Kiswahili kwa sababu wameketi mistari miwili mbele yako. Unaangalia simu yako kila sekunde tano ukitumaini wamekujibu. Daftari lako lina michoro mingi ya jina lao kuliko maelezo halisi. Sote tumewahi kupitia hali hiyo.

Hivi ndivyo unavyoweza kukabiliana na "crushes" bila kuruhusu ziharibu alama zako:

1. **Kubali — crushes ni kawaida.** Kuwa na "crush" haimaanishi kuwa kuna kitu kibaya kwako. Ni sehemu ya kawaida kabisa ya kukua. Ubongo wako kwa kweli umeunganishwa kuhisi hivyo katika umri wako. Kwa hivyo usijilaumu. Shida siyo "crush" — shida ni wakati "crush" inatawala maisha yako yote.

2. **Weka muda wa masomo usio na mawazo ya "crush".** Hii inasikika kama kichekesho lakini inafanya kazi. Unapoketi kufanya marudio, jiambie: "Kwa saa moja ijayo, sifikirii kuhusu huyu mtu." Weka simu yako chini ili usishawishiwe kuangalia hali (status) yao ya WhatsApp. Saa moja ya masomo makini ni bora kuliko saa tatu za kusoma ukiwa umesumbuliwa.

3. **Usiruhusu "crush" ibadilishe jinsi ulivyo.** Baadhi ya wanafunzi huanza kutoroka darasa, kubadilisha vikundi vya marafiki, au kutenda tofauti ili tu kumvutia mtu. Ikiwa unajikuta unafanya mambo ambayo hungefanya kawaida, tua kwanza. Mtu anayefaa atakupenda jinsi ulivyo. Ikiwa inabidi ujibadilishe, haifai.

4. **Weka vipaumbele vyako sawa.** Huu ndio ukweli wa unyoofu — utakuwa na crushes nyingi katika maisha yako. Lakini matokeo yako ya KCSE? Mtihani huo unatokea mara moja tu. Fursa unazopata kutoka kwa elimu bora zinadumu milele. "Crush" huyo anaweza asiwepo hata katika maisha yako baada ya miaka miwili. Lakini elimu yako itakuwepo.

Crush ni ya muda mfupi. Lakini hatima yako ni ya kudumu. Furahia ile msisimko wa moyo, lakini usiiruhusu ikukatishe tamaa kutoka kwa kile kilicho muhimu. Balance ni kila kitu.`,
    month: 1,
  },

  // ▸ Safety & Life Skills
  {
    id: 'sa-1',
    title: 'Online safety. 5 things you should never share',
    title_sw: 'Usalama Mtandaoni. Mambo 5 usiyopaswa kushiriki kamwe',
    category: 'safety',
    tags: ['Safety', 'Technology'],
    emoji: '🔒',
    readTime: '2 min',
    body: `The internet is amazing — you can learn anything, connect with friends, and even make money. But it is also full of people who do not have your best interests at heart. Scammers, predators, and hackers are real, and they target young people because they think you do not know better. Prove them wrong.

Here are 5 things you should NEVER share online:

1. **Your school name and location.** Sounds harmless, right? But if someone knows your school and what you look like from your profile picture, they can find you in real life. Keep your school details off public social media profiles. If a stranger online asks where you go to school, that is a red flag.

2. **Your home address or daily routine.** "I walk home through Eastlands every day at 4 PM" — this kind of information is dangerous in the wrong hands. Never share where you live, which route you take, or when you are home alone.

3. **Your M-Pesa PIN or personal phone number.** No legitimate company will ever ask for your M-Pesa PIN. If someone messages you saying "Send your PIN to verify your account," it is a scam. Also, avoid giving your phone number to strangers on Instagram, TikTok, or WhatsApp.

4. **Photos you would not show your grandmother.** Before you send any photo, ask yourself: "Would I be okay if my whole school saw this?" Because once a photo is sent, you lose control of it. People screenshot, people share. Protect yourself.

5. **Your passwords — even to friends.** Your password is yours alone. Not your best friend's, not your boyfriend's or girlfriend's. Friendships change, relationships end, and suddenly someone has access to your private messages and accounts.

The internet does not forget. What you post today can follow you for years. Be smart, be safe, and protect your digital self the same way you protect yourself in real life.`,
    body_sw: `Mtandao ni mzuri — unaweza kujifunza chochote, kuungana na marafiki, na hata kutengeneza pesa. Lakini pia umejaa watu ambao hawana nia njema nawe. Matapeli, wadhalilishaji, na wadukuzi (hackers) ni halisi, na wanawalenga vijana kwa sababu wanadhani ninyi hamjui mengi. Waonyeshe kuwa wamekosea.

Hapa kuna mambo 5 usiyopaswa kushiriki KAMWE mtandaoni:

1. **Jina la shule yako na eneo ilipo.** Inaonekana kama jambo lisilo na madhara, sivyo? Lakini ikiwa mtu anajua shule yako na jinsi unavyoonekana kutoka kwa picha yako ya wasifu (profile picture), anaweza kukupata katika maisha halisi. Weka maelezo ya shule yako mbali na wasifu wa mitandao ya kijamii wa umma. Ikiwa mgeni mtandaoni anauliza unakoenda shule, hiyo ni ishara ya hatari.

2. **Anwani ya nyumbani kwako au ratiba yako ya kila siku.** "Ninatembea kuelekea nyumbani kupitia Eastlands kila siku saa kumi jioni" — aina hii ya habari ni hatari ikiangukia mikononi mwa watu wabaya. Usishiriki kamwe unapoishi, njia unayotumia, au wakati unapokuwa nyumbani peke yako.

3. **PIN yako ya M-Pesa au nambari yako ya simu ya kibinafsi.** Hakuna kampuni halali itakayowahi kuomba PIN yako ya M-Pesa. Ikiwa mtu anakutumia ujumbe akisema "Tuma PIN yako ili kuthibitisha akaunti yako," huo ni utapeli. Pia, epuka kutoa nambari yako ya simu kwa wageni kwenye Instagram, TikTok, au WhatsApp.

4. **Picha ambazo hungependa bibi yako azione.** Kabla ya kutuma picha yoyote, jiulize: "Je, nitakuwa sawa ikiwa shule yangu nzima itaona picha hii?" Kwa sababu picha ikishatumwa, huwezi kuizuia tena. Watu hupiga picha za skrini (screenshot), na watu husambaza. Jilinde.

5. **Nenosiri (password) zako — hata kwa marafiki.** Nenosiri lako ni lako peke yako. Siyo la rafiki yako wa dhati, wala la mpenzi wako. Urafiki hubadilika, mahusiano huisha, na ghafla mtu anaweza kupata ujumbe wako wa siri na akaunti zako.

Mtandao hausahau. Unachochapisha leo kinaweza kukufuata kwa miaka mingi. Kuwa mwerevu, kuwa salama, na linda utu wako wa kidijitali vilevile unavyojilinda katika maisha halisi.`,
    month: 1,
  },
  {
    id: 'sa-2',
    title: 'Peer pressure. How to stand your ground',
    title_sw: 'Shinikizo la rika. Jinsi ya kusimama imara',
    category: 'safety',
    tags: ['Safety', 'Confidence', 'Decisions'],
    emoji: '💪',
    readTime: '3 min',
    body: `Peer pressure is not always someone grabbing your arm and forcing you. Most times it is subtle — a look, a laugh, the fear of being left out. "Everyone is doing it." "You are such a baby." "What, you are scared?" These words have pushed many smart young Kenyans into decisions they regret.

Here is how to stand firm when the pressure hits:

1. **Know your values BEFORE the moment comes.** Peer pressure works because it catches you off-guard. If you have not already decided what you will and will not do, you will make decisions based on the crowd instead of your brain. Take a moment — right now — and decide your non-negotiables. What will you never do, no matter who asks? Having this clarity makes saying no much easier.

2. **Walk away without drama.** You do not need to give a speech. You do not need to preach. Sometimes the most powerful thing is to simply say "I am good" and walk away. No explanation needed. The people who matter will respect it. The ones who do not respect it do not matter.

3. **Find your tribe.** If your current friend group always pushes you toward risky behavior, you might need a new circle. Look for clubs at school — debate, drama, science, sports. Join a church or mosque youth group. Volunteer somewhere. These spaces attract people who are doing something with their lives, and they will pull you UP, not down.

4. **Remember: the pressure is temporary, the consequences are not.** That moment of peer pressure lasts five minutes. But getting expelled, getting sick, getting a police record, or disappointing your family? That lasts much longer. When you feel the pressure, fast-forward in your mind to the consequences.

You have one life. Do not let someone else's opinion determine how you live it. Be the person who leads, not the one who follows blindly. Kuwa shujaa wa maisha yako — be the hero of your own story.`,
    body_sw: `Shinikizo la rika si kila wakati mtu anakushika mkono na kukulazimisha. Mara nyingi ni mambo madogo madogo — mtazamo, kicheko, au hofu ya kuachwa nyuma. "Kila mtu anafanya hivi." "Wewe ni mtoto sana." "Nini, unaogopa?" Maneno haya yamewasukuma vijana wengi werevu wa Kenya kwenye maamuzi wanayoyajutia.

Hivi ndivyo unavyoweza kusimama imara wakati shinikizo linapokuja:

1. **Jua maadili yako KABLA ya wakati kufika.** Shinikizo la rika hufanya kazi kwa sababu linakupata ukiwa huna tahadhari. Ikiwa bado hujaamua kile utakachofanya na kile usichoweza kufanya, utafanya maamuzi kulingana na kundi badala ya kutumia ubongo wako. Chukua muda — sasa hivi — na uamue mambo ambayo huwezi kubadilisha (non-negotiables). Ni nini usichoweza kufanya, bila kujali nani anakuomba? Kuwa na uwazi huu hufanya kusema hapana kuwa rahisi zaidi.

2. **Ondoka bila vimbwanga (drama).** Huna haja ya kutoa hotuba. Huna haja ya kuhubiri. Wakati mwingine jambo la nguvu zaidi ni kusema tu "Niko sawa" na uondoke. Hakuna maelezo yanayohitajika. Watu walio na maana wataheshimu hilo. Wale wasioheshimu hawana maana.

3. **Tafuta kundi lako linalokufaa.** Ikiwa kikundi chako cha sasa cha marafiki kinakusukuma kila mara kuelekea tabia za hatari, huenda ukahitaji marafiki wapya. Tafuta vilabu shuleni — mjadala (debate), drama, sayansi, michezo. Jiunge na kikundi cha vijana kanisani au msikitini. Jitolee mahali fulani. Maeneo haya huvutia watu wanaofanya jambo la maana na maisha yao, na watakuvuta JUU, si chini.

4. **Kumbuka: shinikizo ni la muda mfupi, lakini matokeo ni ya kudumu.** Wakati ule wa shinikizo la rika hudumu kwa dakika tano. Lakini kufukuzwa shule, kupata ugonjwa, kupata rekodi ya polisi, au kukatisha tamaa familia yako? Hayo hudumu kwa muda mrefu zaidi. Unapohisi shinikizo, fikiria matokeo yatakayokuwepo baadaye.

Una maisha mamoja tu. Usiruhusu maoni ya mtu mwingine yaamue jinsi unavyoyaishi. Kuwa mtu anayeongoza, si yule anayefuata upofu. Kuwa shujaa wa maisha yako — be the hero of your own story.`,
    month: 1,
  },
  {
    id: 'sa-3',
    title: 'What to do if you are in trouble and who to talk to',
    title_sw: 'La kufanya ukiwa matatizoni na nani wa kuzungumza naye',
    category: 'safety',
    tags: ['Safety', 'MentalHealth'],
    emoji: '🆘',
    readTime: '3 min',
    body: `Sometimes things go wrong — really wrong. Maybe someone is hurting you at home. Maybe you did something you regret and you are scared. Maybe you feel so low that you are having dark thoughts. Whatever it is, please hear this: **you do not have to handle it alone.**

Here is what to do when you are in trouble:

1. **Tell someone TODAY.** Not tomorrow, not next week — today. The longer you keep it inside, the heavier it gets. Pick one person you trust: a teacher, a relative, a neighbor, a church leader, a friend's parent. If the first person does not help, tell another one. Keep going until someone takes action.

2. **Know your emergency numbers.** Save these in your phone right now. Childline Kenya: **116** (free, 24/7, confidential). Kenya Red Cross: **1199**. Police: **999** or **112**. If you or someone you know is in immediate danger, call these numbers. They exist for exactly this situation.

3. **Use trusted apps and hotlines.** If calling feels too scary, some helplines accept texts and WhatsApp messages. You can also talk to Amara on this app — she will help you find the right support. Reaching out digitally is just as brave as calling.

4. **Do not blame yourself.** If an adult is hurting you, it is NEVER your fault. If you are being abused, neglected, or exploited, you did nothing to deserve it. You are a child and it is the responsibility of adults to protect you. Do not let shame or fear stop you from getting help.

Here is what I want you to remember: asking for help is the bravest thing you can do. It is not weakness — it is strength. There are people in Kenya right now whose whole job is to help young people like you. Let them do their job. You deserve to be safe. Uko muhimu — you matter.`,
    body_sw: `Wakati mwingine mambo huenda vibaya — vibaya sana. Labda kuna mtu anakuumiza nyumbani. Labda ulifanya jambo unalolijutia na unaogopa. Labda unahisi unyonge kiasi kwamba una mawazo mabaya. Vyovyote vile, tafadhali sikia hili: **huna haja ya kukabiliana nalo peke yako.**

Hivi ndivyo unavyoweza kufanya unapokuwa matatizoni:

1. **Mwambie mtu LEO.** Si kesho, si wiki ijayo — leo. Unavyozidi kukaa nayo ndani, ndivyo inavyozidi kuwa nzito. Chagua mtu mmoja unayemwamini: mwalimu, jamaa, jirani, kiongozi wa kidini, au mzazi wa rafiki yako. Ikiwa mtu wa kwanza hakusaidii, mwambie mwingine. Endelea kusema mpaka mtu achukue hatua.

2. **Jua nambari zako za dharura.** Hifadhi nambari hizi kwenye simu yako sasa hivi. Childline Kenya: **116** (bure, saa 24/7, siri). Kenya Red Cross: **1199**. Polisi: **999** au **112**. Ikiwa wewe au mtu unayemjua yuko katika hatari ya haraka, piga nambari hizi. Zipo kwa ajili ya hali kama hii.

3. **Tumia programu (apps) na huduma za simu unazoziamini.** Ikiwa kupiga simu kunatisha sana, baadhi ya huduma hupokea ujumbe wa maandishi na WhatsApp. Unaweza pia kuzungumza na Amara kwenye programu hii — atakusaidia kupata msaada unaofaa. Kutafuta msaada kidijitali ni ujasiri sawa na kupiga simu.

4. **Usijilaumu.** Ikiwa mtu mzima anakuumiza, si kosa lako KAMWE. Ikiwa unadhulumiwa, unatelekezwa, au unanyonywa, hukufanya lolote kustahili hayo. Wewe ni mtoto na ni jukumu la watu wazima kukulinda. Usiruhusu aibu au hofu ikuzuie kupata msaada.

Hapa kuna kile ninachotaka ukumbuke: kuomba msaada ni jambo la kishujaa zaidi unaloweza kufanya. Si udhaifu — ni nguvu. Kuna watu nchini Kenya hivi sasa ambao kazi yao yote ni kusaidia vijana kama wewe. Waruhusu wafanye kazi yao. Unastahili kuwa salama. Uko muhimu — you matter.`,
    month: 1,
  },

  // ▸ Future & Career
  {
    id: 'fc-1',
    title: 'Do not know what you want to be? Start here',
    category: 'future',
    tags: ['Career', 'Future'],
    emoji: '🌟',
    readTime: '4 min',
    body: `"What do you want to be when you grow up?" If this question makes you panic, relax. You are not behind. Most adults changed their career plans at least twice before settling. The pressure to know at 15 what you will do at 30 is unrealistic — but there are ways to start figuring it out.

Here is where to begin:

1. **Look at what you already enjoy.** Not what your parents want you to enjoy — what YOU actually like doing. Do you love arguing and debating? Law might interest you. Are you always the one fixing phones in class? Tech could be your lane. Do you enjoy helping younger kids with homework? Teaching might be calling you. Your hobbies and habits are clues. Write them down.

2. **Explore beyond the Big Five.** In Kenya, people always say doctor, lawyer, engineer, pilot, or accountant. But there are thousands of careers out there. Content creation, app development, agriculture technology, sports management, environmental science, graphic design, counselling. Google "careers in Kenya" and prepare to be surprised by what exists.

3. **Shadow or interview someone.** Pick a career you are curious about and find someone who does it. It could be your neighbour, your auntie, or someone you follow on Twitter. Send them a polite message: "Hi, I am a student and I am interested in what you do. Can I ask you a few questions?" Most people love talking about their work. One conversation can change your whole perspective.

4. **Try things and keep a journal.** Join different clubs at school. Volunteer at different places during holidays. Try coding on free platforms like FreeCodeCamp. The point is not to be perfect — it is to discover what excites you and what bores you. Write down your reactions. Over time, a pattern will emerge.

You do not need to have your whole life figured out right now. You just need to start exploring. The journey of a thousand miles begins with one step — safari ya maisha inaanza na hatua moja.`,
    title_sw: 'Hujui unataka kuwa nani? Anzia hapa',
    body_sw: `"Unataka kuwa nani utakapokuwa mkubwa?" Ikiwa swali hili linakupa wasiwasi, tulia. Haujachelewa. Watu wazima wengi walibadilisha mipango yao ya kazi angalau mara mbili kabla ya kutulia. Shinikizo la kutaka ujue ukiwa na miaka 15 kile utakachofanya ukiwa na miaka 30 si la kweli — lakini kuna njia za kuanza kugundua.

Hapa kuna pa kuanzia:

1. **Angalia kile unachofurahia tayari.** Si kile wazazi wako wanataka ufurahie — bali kile WEWE unachopenda kufanya. Je, unapenda kubishana na kujenga hoja? Sheria inaweza kukuvutia. Je, wewe ndiye kila mara unayetengeneza simu darasani? Teknolojia inaweza kuwa njia yako. Je, unafurahia kusaidia watoto wadogo na kazi zao za nyumbani? Ualimu unaweza kuwa wito wako. Mapendeleo na tabia zako ni dalili. Ziandike.

2. **Chunguza zaidi ya zile kazi "Tano Kubwa".** Nchini Kenya, watu kila mara husema daktari, wakili, mhandisi, rubani, au mhasibu. Lakini kuna maelfu ya kazi nyingine huko nje. Utengenezaji wa maudhui (content creation), uundaji wa programu (app development), teknolojia ya kilimo, usimamizi wa michezo, sayansi ya mazingira, usanifu wa picha (graphic design), ushauri wa kisaikolojia. Tafuta "careers in Kenya" kwenye Google na ujiandae kushangazwa na kile kilichopo.

3. **Fuata au hoji mtu fulani.** Chagua kazi unayotamani kuijua na upate mtu anayeifanya. Anaweza kuwa jirani yako, shangazi yako, au mtu unayemfuata kwenye Twitter/X. Mtumie ujumbe wa heshima: "Habari, mimi ni mwanafunzi na ninavutiwa na kile unachofanya. Je, ninaweza kukuuliza maswali machache?" Watu wenyewe wanapenda kuzungumza juu ya kazi zao. Mazungumzo moja yanaweza kubadilisha mtazamo wako mzima.

4. **Jaribu mambo mbalimbali na uandike maendeleo yako.** Jiunge na klabu tofauti shuleni. Jitolee katika maeneo tofauti wakati wa likizo. Jaribu kujifunza kuandika kodi (coding) kwenye tovuti za bure kama FreeCodeCamp. Lengo si kuwa hodari mara moja — ni kugundua kile kinachokuchangamsha na kile kinachokuchosha. Andika hisia zako. Baada ya muda, utaanza kuona mwelekeo fulani.

Huna haja ya kuwa na maisha yako yote yaliyopangwa sasa hivi. Unahitaji tu kuanza kuchunguza. Safari ya maisha inaanza na hatua moja.`,
    month: 1,
  },
  {
    id: 'fc-2',
    title: 'How to discover what you are good at',
    title_sw: 'Jinsi ya kugundua kipaji na uwezo wako',
    category: 'future',
    tags: ['Career', 'Confidence'],
    emoji: '🔍',
    readTime: '3 min',
    body: `"I am not good at anything." If you have ever thought this, you are wrong. Everyone has strengths — the problem is that school only measures a few of them. If you are not great at Maths or English, it is easy to think you have nothing to offer. But talent shows up in many ways that exams do not test.

Here is how to discover your hidden strengths:

1. **Ask three people what they think you are good at.** Text a friend, a family member, and a teacher. Ask them: "What do you think I am naturally good at?" Their answers might surprise you. Sometimes other people see gifts in us that we are blind to. Maybe your friend will say, "You always know how to make people laugh" or "You are really good at explaining things simply."

2. **Pay attention to what people ask you for help with.** Do friends come to you for advice? That is emotional intelligence. Does your family ask you to negotiate prices at the market? That is sales and persuasion. Are you always the one organizing events or group projects? That is leadership. Your strengths are already showing — you just need to notice them.

3. **Try the "energy test."** Some activities drain you. Others give you energy. After a day at school, what do you look forward to doing? What makes time fly? What would you do even if nobody paid you? Those activities are connected to your natural abilities. A student in Nakuru might love tinkering with electronics while her classmate in Meru might come alive on stage. Both are strengths.

4. **Remember: being "good" does not mean being perfect.** You do not need to be the BEST at something for it to be your strength. You just need to enjoy it and be willing to get better at it. Talent plus effort equals skill. Kipchoge was not born a champion — he trained every single day.

Your strengths are your superpower. Find them, develop them, and watch doors open. Kila mtu ana kipaji chake — every person has their gift.`,
    body_sw: `"Mimi si mzuri kwa chochote." Ikiwa umewahi kufikiria hivi, unakosea. Kila mtu ana uwezo wake — shida ni kwamba shule hupima baadhi tu ya uwezo huo. Ikiwa wewe si mzuri katika Hisabati au Kiingereza, ni rahisi kufikiri huna cha kutoa. Lakini kipaji hujitokeza kwa njia nyingi ambazo mitihani haipimi.

Hivi ndivyo unavyoweza kugundua uwezo wako uliojificha:

1. **Waulize watu watatu wanafikiri wewe ni mzuri kwa jambo gani.** Mtumie ujumbe rafiki, mwanafamilia, na mwalimu. Waulize: "Unafikiri mimi ni mzuri kwa asili katika jambo gani?" Majibu yao yanaweza kukushangaza. Wakati mwingine watu wengine huona vipawa ndani yetu ambavyo sisi hatuvioni. Labda rafiki yako atasema, "Daima unajua jinsi ya kuwafanya watu wacheke" au "Wewe ni mzuri sana katika kueleza mambo kwa njia rahisi."

2. **Zingatia mambo ambayo watu wanakuomba msaada.** Je, marafiki wanakuja kwako kwa ushauri? Hiyo ni akili ya kihisia (emotional intelligence). Je, familia yako inakuomba ujadiliane bei sokoni? Hiyo ni mauzo na ushawishi. Je, wewe ndiye kila mara unayepanga matukio au miradi ya kikundi? Huo ni uongozi. Uwezo wako tayari unaonekana — unahitaji tu kuutambua.

3. **Jaribu "kipimo cha nishati."** Baadhi ya shughuli zinakuchosha. Nyingine zinakupa nishati. Baada ya siku shuleni, ni jambo gani unalotarajia kufanya? Ni nini kinafanya wakati upite haraka? Ungefanya nini hata kama hakuna mtu angekulipa? Shughuli hizo zinahusiana na uwezo wako wa asili. Mwanafunzi Nakuru anaweza kupenda kurekebisha vifaa vya kielektroniki huku mwanafunzi mwenzake Meru akiwa mahiri kwenye jukwaa. Vyote hivi ni uwezo.

4. **Kumbuka: kuwa "mzuri" haimaanishi kuwa mkamilifu.** Huhitaji kuwa BORA zaidi katika jambo fulani ili liwe uwezo wako. Unahitaji tu kufurahia na kuwa tayari kuboresha. Kipaji jumla ya juhudi ni sawa na ujuzi. Kipchoge hakuzaliwa bingwa — alifanya mazoezi kila siku.

Uwezo wako ni nguvu yako kuu. Yatafute, yaendeleze, na uone milango ikifunguka. Kila mtu ana kipaji chake.`,
    month: 1,
  },
  {
    id: 'fc-3',
    title: 'Skills that matter more than grades, yes really',
    category: 'future',
    tags: ['Career', 'School', 'Future'],
    emoji: '🚀',
    readTime: '3 min',
    body: `Here is a truth that might shock you: many of the most successful people in Kenya did not have the best grades. What they had was skills that school does not teach. Grades open the first door, but skills keep you moving forward.

Here are skills that will take you further than any report card:

1. **Communication.** Can you explain an idea clearly? Can you write a good message? Can you stand in front of people and speak? In every job, every business, every relationship — communication is king. Start practising now. Join the debate club. Volunteer to read in assembly. Write posts on your socials that actually say something meaningful. These small habits build a massive skill.

2. **Problem-solving.** The world does not need people who only follow instructions. It needs people who can look at a problem and figure it out. When something breaks at home, do you try to fix it or do you just complain? When a group project goes wrong, do you find a way forward or give up? Train yourself to think in solutions, not complaints. Employers and customers pay for solutions.

3. **Digital literacy.** Know how to use a computer properly — not just for games and social media. Learn to use Google Docs, spreadsheets, or basic design tools like Canva. If you can code even a little bit, you are ahead of most people your age in Kenya. Free resources like YouTube tutorials and Khan Academy can teach you these skills during holidays.

4. **Financial literacy.** Understanding money — how to earn it, save it, invest it, and not waste it — is a life skill that most adults wish they learned earlier. Start now by managing your pocket money wisely. Understanding M-Pesa transactions, interest rates, and budgeting will serve you for life.

Grades matter, but they are not everything. Build these skills alongside your studies and you will be unstoppable. Masomo plus skills equals a bright future — hakuna shortcut, but this combo works.`,
    title_sw: 'Ujuzi ambao ni muhimu zaidi kuliko alama za mitihani',
    body_sw: `Hapa kuna ukweli ambao unaweza kukushangaza: watu wengi waliofanikiwa zaidi nchini Kenya hawakuwa na alama bora zaidi za mitihani. Walichokuwa nacho ni ujuzi ambao shule haifundishi. Alama hufungua mlango wa kwanza, lakini ujuzi ndio unaokuwezesha kuendelea mbele.

Hapa kuna ujuzi utakaokufikisha mbali zaidi kuliko ripoti yoyote ya shule:

1. **Mawasiliano.** Je, unaweza kuelezea wazo kwa uwazi? Je, unaweza kuandika ujumbe mzuri? Je, unaweza kusimama mbele ya watu na kuzungumza? Katika kila kazi, kila biashara, kila mahusiano — mawasiliano ni muhimu zaidi. Anza kufanya mazoezi sasa. Jiunge na klabu ya mdahalo (debate club). Jitolee kusoma wakati wa mkusanyiko wa shule (assembly). Andika jumbe kwenye mitandao yako ya kijamii ambazo zina maana. Tabia hizi ndogo hujenga ujuzi mkubwa.

2. **Kutatua matatizo.** Dunia haihitaji watu wanaofuata maelekezo tu. Inahitaji watu wanaoweza kuangalia tatizo na kutafuta suluhisho. Kitu kinapoharibika nyumbani, je, unajaribu kukitengeneza au unalalamika tu? Mradi wa kikundi unapokwama, je, unatafuta njia ya kuendelea au unakata tamaa? Jifunze kufikiria suluhisho, si malalamiko. Waajiri na wateja hulipia suluhisho.

3. **Uelewa wa kidijitali.** Jua jinsi ya kutumia kompyuta vizuri — si kwa michezo na mitandao ya kijamii tu. Jifunze kutumia Google Docs, lahajedwali (spreadsheets), au zana za msingi za usanifu kama Canva. Ikiwa unaweza kuandika kodi hata kidogo tu, uko mbele ya watu wengi wa umri wako nchini Kenya. Rasilimali za bure kama mafunzo ya YouTube na Khan Academy zinaweza kukufundisha ujuzi huu wakati wa likizo.

4. **Uelewa wa kifedha.** Kuelewa pesa — jinsi ya kuipata, kuihifadhi, kuiwekeza, na kutoiaribu — ni ujuzi wa maisha ambao watu wazima wengi wanatamani wangejifunza mapema. Anza sasa kwa kusimamia pesa zako za matumizi kwa hekima. Kuelewa miamala ya M-Pesa, viwango vya riba, na kupanga bajeti kutakusaidia maishani.

Alama za mitihani ni muhimu, lakini si kila kitu. Jenga ujuzi huu pamoja na masomo yako na hakuna atakayekuzuia. Masomo pamoja na ujuzi huleta hatima njema — hakuna shortcut, lakini mchanganyiko huu unafanya kazi.`,
    month: 1,
  },

  // ▸ Money Basics
  {
    id: 'mb-1',
    title: 'Got pocket money? Here is how to manage it',
    category: 'money',
    tags: ['Money'],
    emoji: '💰',
    readTime: '2 min',
    body: `Whether you get 50 bob a day or 500 bob a week, how you handle your pocket money now will shape how you handle millions later. Seriously. Money habits start early, and the students who learn to manage small amounts become the adults who manage big ones.

Here is your pocket money playbook:

1. **Use the 50-30-20 rule.** Take whatever pocket money you get and split it: 50% for needs (lunch, transport, school supplies), 30% for wants (snacks, airtime, fun stuff), and 20% for savings. If you get 100 bob, that means 50 for lunch, 30 for a soda or chips, and 20 goes into savings. It sounds small, but 20 bob a day is 600 bob a month. That is real money.

2. **Track where your money goes.** For one week, write down every single thing you spend on. You will be shocked. That 20 bob sweet here, 10 bob there, random airtime top-up — it adds up fast. When you see where your money goes, you can make smarter choices. Use the notes app on your phone if you do not have a notebook.

3. **Save with a goal in mind.** Saving is boring when you do not know what you are saving for. But if you are saving for new school shoes, a phone, or a trip, suddenly every coin matters. Set a target, calculate how long it will take, and watch your savings grow. You can even use M-Pesa's lock savings feature to keep yourself from spending it.

The richest people in Kenya did not start with millions. They started by respecting small money. If you can manage 100 bob well, you can manage 100,000 well. Start today, start small, and watch what happens. Pesa ni pesa — every shilling counts.`,
    title_sw: 'Una pesa ya matumizi? Hivi ndivyo unavyoweza kuisimamia',
    body_sw: `Iwe unapata bob 50 kwa siku au bob 500 kwa wiki, jinsi unavyosimamia pesa yako ya matumizi sasa itajenga jinsi utakavyosimamia mamilioni baadaye. Kwa kweli. Tabia za kifedha huanza mapema, na wanafunzi wanaojifunza kusimamia kiasi kidogo wanakuwa watu wazima wanaosimamia kiasi kikubwa.

Hapa kuna mwongozo wako wa pesa ya matumizi:

1. **Tumia sheria ya 50-30-20.** Chukua pesa yoyote ya matumizi unayopata na uigawe: 50% kwa mahitaji (chakula cha mchana, usafiri, vifaa vya shule), 30% kwa matamanio (vitafunio, muda wa maongezi, mambo ya kufurahisha), na 20% kwa akiba. Ikiwa unapata bob 100, hiyo inamaanisha 50 ni kwa chakula cha mchana, 30 kwa soda au chipsi, na 20 inaenda kwenye akiba. Inasikika kuwa kidogo, lakini bob 20 kwa siku ni bob 600 kwa mwezi. Hiyo ni pesa halisi.

2. **Fuatilia pesa yako inapokwenda.** Kwa wiki moja, andika kila kitu unachotumia pesa kwayo. Utashangaa. Ile bob 20 ya pipi hapa, bob 10 pale, kuweka muda wa maongezi hovyo — yote hayo yanajikusanya haraka sana. Unapoona pesa yako inapokwenda, unaweza kufanya maamuzi bora zaidi. Tumia notepad ya simu yako ikiwa huna kitabu cha maandishi.

3. **Weka akiba ukiwa na lengo.** Kuweka akiba kunachosha wakati hujui ni kwa ajili ya nini. Lakini ikiwa unaweka akiba kwa ajili ya viatu vipya vya shule, simu, au safari, ghafla kila senti inakuwa na maana. Weka lengo, piga hesabu itachukua muda gani, na uone akiba yako ikikua. Unaweza hata kutumia kipengele cha "lock savings" cha M-Pesa ili kuzuia kuitumia.

Watu matajiri zaidi nchini Kenya hawakuanza na mamilioni. Walianza kwa kuheshimu pesa kidogo. Ikiwa unaweza kusimamia vizuri bob 100, unaweza kusimamia vizuri 100,000. Anza leo, anza na kidogo, na uone matokeo. Pesa ni pesa — kila shilingi ina maana.`,
    month: 1,
  },
  {
    id: 'mb-2',
    title: 'Saving vs spending. How to balance both',
    category: 'money',
    tags: ['Money', 'Decisions'],
    emoji: '⚖️',
    readTime: '3 min',
    body: `Saving everything and never enjoying your money is no fun. But spending everything and having nothing left is stressful. The trick is balance — and it is a skill you can learn right now, even as a student.

Here is how to balance saving and spending:

1. **Pay yourself first.** Before you spend a single shilling, put something aside. Even if it is just 10 bob. This is called "paying yourself first" and it is the number one money rule rich people follow. When your pocket money or allowance comes in, immediately set aside your savings portion. What is left is what you spend. Not the other way around.

2. **Use the 24-hour rule for big wants.** See something you want to buy? Wait 24 hours. If you still want it tomorrow, maybe buy it. But you will be surprised how many things you wanted at 3 PM that you have forgotten about by 3 PM the next day. This kills impulse spending — those random purchases at the school canteen or kiosk that eat your money without you noticing.

3. **Separate your money physically.** If you carry all your money in one pocket, you will spend all of it. Instead, put your savings somewhere separate — a different pocket, an envelope at home, or an M-Pesa savings feature. Out of sight, out of mind. When your spending money runs out, you stop spending. Simple.

4. **Celebrate small wins.** When you reach a savings goal, reward yourself with something small. Saved 500 bob? Treat yourself to your favourite meal. This teaches your brain that saving is not punishment — it is delayed enjoyment. And delayed enjoyment is always sweeter.

Balance is not about being perfect. Some weeks you will save more, some weeks you will spend more. The point is to be intentional. Know where your money goes and make choices you are proud of. Pesa si ya kukimbilia — money is a marathon, not a sprint.`,
    title_sw: 'Kuweka akiba dhidi ya kutumia. Jinsi ya kusawazisha zote mbili',
    body_sw: `Kuweka akiba kila kitu na kutofurahia pesa yako kamwe si jambo la kufurahisha. Lakini kutumia kila kitu na kutobakiwa na chochote kunaleta msongo wa mawazo. Siri ni usawa — na ni ujuzi unaoweza kujifunza sasa hivi, hata ukiwa mwanafunzi.

Hivi ndivyo unavyoweza kusawazisha kuweka akiba na kutumia:

1. **Jilipe mwenyewe kwanza.** Kabla ya kutumia shilingi hata moja, weka kiasi fulani kando. Hata kama ni bob 10 tu. Hii inaitwa "kujilipa mwenyewe kwanza" na ni sheria nambari moja ya kifedha ambayo watu matajiri hufuata. Wakati pesa yako ya matumizi inapofika, weka kando sehemu yako ya akiba mara moja. Kilichobaki ndicho unachotumia. Sio kinyume chake.

2. **Tumia sheria ya saa 24 kwa matamanio makubwa.** Umeona kitu unachotaka kununua? Subiri kwa saa 24. Ikiwa bado unakitaka kesho, labda ukinunue. Lakini utashangaa jinsi mambo mengi uliyoyatamani saa tisa alasiri unakuwa umeyasahau ifikapo saa tisa alasiri siku inayofuata. Hii inazuia utumiaji wa pesa wa ghafla — yale manunuzi ya hapa na pale kwenye kanti (canteen) ya shule au kioski ambayo yanakula pesa yako bila wewe kutambua.

3. **Tenga pesa zako kimwili.** Ikiwa unabeba pesa zako zote kwenye mfuko mmoja, utazitumia zote. Badala yake, weka akiba yako mahali tofauti — mfuko tofauti, bahasha nyumbani, au kipengele cha akiba cha M-Pesa. Lisiloonekana machoni, halipo akilini (Out of sight, out of mind). Pesa yako ya matumizi inapoisha, acha kutumia. Rahisi sana.

4. **Sherehekea mafanikio madogo.** Unapofikia lengo la akiba, jizawadi kwa kitu kidogo. Umehifadhi bob 500? Jinunulie chakula unachokipenda zaidi. Hii inafundisha ubongo wako kwamba kuweka akiba si adhabu — ni kufurahia baadaye. Na kufurahia baadaye kila mara ni tamu zaidi.

Usawa si kuhusu kuwa mkamilifu. Wiki nyingine utaweka akiba zaidi, wiki nyingine utumiaji utakuwa mwingi. Muhimu ni kuwa na dhamira. Jua pesa yako inapokwenda na fanya maamuzi unayojivunia. Pesa si ya kukimbilia — usimamizi wa pesa ni kama mbio za nyika (marathon), si mbio za fupi.`,
    month: 1,
  },
  {
    id: 'mb-3',
    title: 'Small ways to make money as a student',
    category: 'money',
    tags: ['Money', 'Career'],
    emoji: '💡',
    readTime: '3 min',
    body: `You do not have to wait until you finish school to start earning. Some of the most successful entrepreneurs in Kenya started hustling as students. The key is finding something you can do without it affecting your studies.

Here are real ways students in Kenya make money:

1. **Tutoring younger students.** If you are good at any subject, younger students in your area or school need help. Charge a small fee per session — even 100 to 200 bob per hour. Parents are always looking for affordable tutors for their primary school kids. You can start with your neighbors' children. This also makes you better at the subject because teaching is the best way to learn.

2. **Selling snacks or drinks at school.** Buy sweets, biscuits, or juice in bulk from a wholesale shop and sell them individually at a markup. A packet of sweets that costs 50 bob might have 20 pieces — sell each at 5 bob and you have made 100 bob profit. Check your school rules first though — some schools do not allow it. If they do, this is a classic Kenyan student hustle.

3. **Offering digital services.** Can you edit photos, create posters, or manage social media? Small businesses in your area need these services and many cannot afford professionals. Offer to create flyers for local shops, help them set up social media pages, or type documents for people. A simple poster design can earn you 200 to 500 bob.

4. **Holiday and weekend work.** During school holidays, look for short-term gigs. Helping at a relative's shop, doing deliveries, washing cars, or even farming during planting season. Every shilling you earn and save now is a shilling you do not have to borrow later.

The goal is not to get rich quick. It is to learn how money works, build a work ethic, and start creating your own opportunities. Ukipanda leo, utavuna kesho — plant today, harvest tomorrow.`,
    title_sw: 'Njia ndogo za kupata pesa ukiwa mwanafunzi',
    body_sw: `Huna haja ya kusubiri hadi umalize shule ili uanze kupata pesa. Baadhi ya wajasiriamali waliofanikiwa zaidi nchini Kenya walianza harakati zao wakiwa wanafunzi. Siri ni kupata kitu unachoweza kufanya bila kuathiri masomo yako.

Hizi hapa ni njia halisi ambazo wanafunzi nchini Kenya hutumia kupata pesa:

1. **Kuwafundisha wanafunzi wadogo.** Ikiwa wewe ni hodari katika somo lolote, wanafunzi wadogo katika eneo lako au shuleni wanahitaji msaada. Toza ada kidogo kwa kila kipindi — hata bob 100 hadi 200 kwa saa. Wazazi kila mara wanatafuta walimu wa bei rahisi kwa watoto wao wa shule ya msingi. Unaweza kuanza na watoto wa majirani zako. Hii pia inakufanya uwe bora zaidi katika somo hilo kwa sababu kufundisha ndiyo njia bora zaidi ya kujifunza.

2. **Kuuza vitafunio au vinywaji shuleni.** Nunua pipi, biskuti, au juisi kwa jumla kutoka kwenye duka la jumla na uziuze mmoja mmoja kwa faida. Pakiti ya pipi inayoligharimu bob 50 inaweza kuwa na vipande 20 — uza kila moja kwa bob 5 na utakuwa umepata faida ya bob 100. Lakini kwanza angalia sheria za shule yako — baadhi ya shule haziruhusu. Ikiwa zinaruhusu, huu ni mradi wa kawaida kwa wanafunzi wa Kenya.

3. **Kutoa huduma za kidijitali.** Je, unaweza kuhariri picha (edit), kutengeneza mabango (posters), au kusimamia mitandao ya kijamii? Biashara ndogo ndogo katika eneo lako zinahitaji huduma hizi na wengi hawawezi kumudu wataalamu. Jitolee kuwatengenezea mabango ya maduka ya mtaani, wasaidie kuanzisha kurasa za mitandao ya kijamii, au kuwachapia watu stakabadhi. Usanifu wa bango rahisi unaweza kukupatia bob 200 hadi 500.

4. **Kazi za likizo na wikendi.** Wakati wa likizo za shule, tafuta kazi za muda mfupi. Kusaidia kwenye duka la jamaa, kufanya usafirishaji (deliveries), kuosha magari, au hata kufanya kazi za shambani wakati wa upandaji. Kila shilingi unayopata na kuweka akiba sasa ni shilingi ambayo hutahitaji kuikopa baadaye.

Lengo si kutajirika haraka. Ni kujifunza jinsi pesa inavyofanya kazi, kujenga nidhamu ya kazi, na kuanza kujiandalia fursa zako mwenyewe. Ukipanda leo, utavuna kesho.`,
    month: 1,
  },
  // ▸ Additional — reaching 28 articles
  {
    id: 'sa-4',
    title: 'What to do if you feel unsafe walking home',
    title_sw: 'La kufanya unahisi huko salama unapotembea nyumbani',
    category: 'safety',
    tags: ['Safety', 'Confidence'],
    emoji: '🚶',
    readTime: '2 min',
    body: `Walking home from school should not be scary, but the reality in some parts of Kenya is that it can be. Whether it is a long route through quiet areas, a neighbourhood with safety concerns, or just that uneasy feeling as it gets dark — your safety matters and there are things you can do to protect yourself.

Here is how to stay safer on your way home:

1. **Walk with others whenever possible.** There is safety in numbers. Find classmates, neighbours, or even older students who go in the same direction and walk together. If your school has late activities, arrange with friends to leave together. A group of three or four is much safer than walking alone.

2. **Stick to busy, well-lit routes.** Even if a shortcut through a quiet alley saves you 10 minutes, it is not worth the risk if it makes you feel unsafe. Take the longer route through busy streets where there are shops, people, and light. Matatu stages, market areas, and main roads are generally safer.

3. **Let someone know your route and timing.** Tell a parent, guardian, or older sibling when you are leaving school and roughly when you should arrive home. If possible, send a quick text or call when you start walking. If you do not arrive on time, someone will know to check on you.

4. **Trust your instincts.** If something feels wrong — someone is following you, a car slows down next to you, or a situation feels off — go to the nearest shop, church, or busy place. Do not worry about being "dramatic." Your gut feeling exists to protect you. Better to be safe and feel silly than to ignore a real warning.

You deserve to feel safe every day. If your route home is consistently unsafe, talk to a parent or teacher about it. Sometimes schools can arrange transport or buddy systems. Your safety is not negotiable. Jilinde — protect yourself always.`,
    body_sw: `Kutembea kuelekea nyumbani kutoka shuleni hakupaswi kutisha, lakini ukweli katika baadhi ya maeneo ya Kenya ni kwamba kunaweza kutisha. Iwe ni njia ndefu kupitia maeneo tulivu, mtaa wenye matatizo ya usalama, au ule msisimko wa kutofurahia giza linapoingia — usalama wako ni muhimu na kuna mambo unayoweza kufanya ili kujilinda.

Hivi ndivyo unavyoweza kubaki salama zaidi unaporudi nyumbani:

1. **Tembea na wengine kila inapowezekana.** Kuna usalama katika idadi kubwa. Tafuta marafiki wa darasani, majirani, au hata wanafunzi wa madarasa ya juu wanaoenda upande mmoja na mtembee pamoja. Ikiwa shule yako ina shughuli za jioni, panga na marafiki muondoke pamoja. Kikundi cha watu watatu au wanne ni salama zaidi kuliko kutembea peke yako.

2. **Fuata njia zenye watu wengi na zenye mwanga.** Hata kama njia ya mkato kupitia kichochoro tulivu inakuokoa dakika 10, haifai hatari ikiwa inakufanya uhisi huko salama. Tumia njia ndefu kupitia mitaa yenye shughuli nyingi ambapo kuna maduka, watu, na mwanga. Vituo vya matatu, maeneo ya soko, na barabara kuu kwa kawaida ni salama zaidi.

3. **Mjulishe mtu njia unayotumia na muda wako.** Mwambie mzazi, mlezi, au kaka au dada mkubwa unapoondoka shuleni na takriban wakati utakapofika nyumbani. Ikiwa inawezekana, tuma ujumbe mfupi wa haraka au upige simu unapoanza kutembea. Ikiwa hutafika kwa wakati, mtu atajua kufuatilia.

4. **Amini hisia zako.** Ikiwa unahisi jambo fulani si sawa — mtu anakufuata, gari linapunguza mwendo karibu nawe, au hali fulani inaonekana kuwa na mushkil — nenda kwenye duka la karibu, kanisa, au mahali penye shughuli nyingi. Usiwe na wasiwasi kuhusu kuonekana "unatia chumvi." Hisia zako za ndani zipo ili kukulinda. Ni bora kuwa salama na uonekana kama umeogopa bure kuliko kupuuza onyo la kweli.

Unastahili kujihisi salama kila siku. Ikiwa njia yako ya kuelekea nyumbani si salama kila mara, zungumza na mzazi au mwalimu kuhusu hilo. Wakati mwingine shule zinaweza kupanga usafiri au mfumo wa marafiki wa kutembea pamoja. Usalama wako si jambo la kufanyia mzaha. Jilinde — protect yourself always.`,
    month: 1,
  },
  {
    id: 'mh-5',
    title: 'Why it is okay to cry — even for boys',
    category: 'mental-health',
    tags: ['MentalHealth', 'Confidence'],
    emoji: '💧',
    readTime: '3 min',
    body: `"Men do not cry." "Be strong." "Wachana na hizo machozi — stop those tears." Boys in Kenya grow up hearing this from the time they are small. By the time you reach secondary school, most boys have learned to swallow their pain, hide their feelings, and pretend everything is fine. But here is what nobody tells you: **that is dangerous.**

Here is the truth about crying and emotions:

1. **Crying is not weakness — it is biology.** Your body produces tears to release stress hormones. When you cry, your body literally gets rid of chemicals that make you feel bad. It is like releasing steam from a pressure cooker. If you never release the pressure, eventually something explodes. That "something" can be anger, violence, depression, or risky behavior.

2. **The toughest men in Kenya have cried.** Athletes after winning medals. Fathers at their children's graduations. Soldiers who have seen difficult things. Crying does not take away your strength. It adds to it because it means you are human enough to feel and brave enough to show it.

3. **Bottling up emotions hurts your health.** Boys who are taught to hide feelings often grow into men with high blood pressure, anger issues, substance abuse, and broken relationships. The stats in Kenya show that men are far less likely to seek help for mental health — and the consequences are serious. Learning to express your emotions now can literally save your life later.

4. **Find safe spaces to feel.** You do not have to cry in front of the whole class. But find somewhere and someone safe. A trusted friend, a mentor, a counsellor, or even a private moment in your room. Write in a journal. Punch a pillow. Go for a run. Express what you feel in whatever way works for you.

To every boy reading this: your feelings are valid. Your pain is real. And expressing it does not make you less of a man — it makes you more of one. Kulia si udhaifu — crying is not weakness.`,
    title_sw: 'Kwa nini ni sawa kulia — hata kwa wavulana',
    body_sw: `"Wanaume hawali." "Kuwa na nguvu." "Wachana na hizo machozi — acha kulia." Wavulana nchini Kenya hukua wakisikia maneno haya tangu wakiwa wadogo. Unapofika shule ya sekondari, wavulana wengi wanakuwa wamejifunza kumeza maumivu yao, kuficha hisia zao, na kujifanya kuwa kila kitu kiko sawa. Lakini hapa kuna jambo ambalo hakuna mtu anayekuambia: **halo ni hatari.**

Hapa kuna ukweli kuhusu kulia na hisia:

1. **Kulia si udhaifu — ni biolojia.** Mwili wako hutoa machozi ili kutoa homoni za msongo wa mawazo. Unapolia, mwili wako huondoa kemikali zinazokufanya ujihisi vibaya. Ni kama kutoa mvuke kwenye jiko la shinikizo (pressure cooker). Ikiwa hautatoa shinikizo hilo, hatimaye kitu kitalipuka. "Kitu" hicho kinaweza kuwa hasira, vurugu, unyogovu, au tabia za hatari.

2. **Wanaume mashuhuri zaidi nchini Kenya wamewahi kulia.** Wanariadha baada ya kushinda medali. Mababa kwenye mahafali ya watoto wao. Wanajeshi ambao wameona mambo magumu. Kulia hakuondoi nguvu zako. Kunaongeza nguvu kwa sababu inamaanisha wewe ni binadamu unayehisi na una ujasiri wa kutosha kuonyesha hisia zako.

3. **Kuficha hisia kunaumiza afya yako.** Wavulana wanaofundishwa kuficha hisia mara nyingi hukua na kuwa wanaume wenye shinikizo la damu, matatizo ya hasira, utumiaji wa dawa za kulevya, na mahusiano yaliyovunjika. Takwimu nchini Kenya zinaonyesha kuwa wanaume wana uwezekano mdogo sana wa kutafuta msaada kwa afya ya akili — na matokeo yake ni makubwa sana. Kujifunza kuelezea hisia zako sasa kunaweza kuokoa maisha yako baadaye.

4. **Tafuta mahali salama pa kutoa hisia zako.** Huna haja ya kulia mbele ya darasa zima. Lakini tafuta mahali na mtu salama. Rafiki unayemwamini, mshauri, au hata wakati wa faragha chumbani kwako. Andika kwenye kitabu (journal). Piga mto (pillow). Nenda kimbia. Elezea kile unachohisi kwa njia yoyote inayokufaa.

Kwa kila mvulana anayesoma hapa: hisia zako ni muhimu. Maumivu yako ni halisi. Na kuyaonyesha hakukufanyi kuwa pungufu kama mwanamume — kunakufanya kuwa mwanamume kamili. Kulia si udhaifu.`,
    month: 1,
  },
  // ▸ Month 2: 18-22 Transition & Adulting
  {
    id: 'ya-ms-1',
    title: 'I graduated with a degree and had no job for 2 years. Here is what I did',
    title_sw: 'Nilihitimu na digrii na kukosa kazi kwa miaka 2. Hiki ndicho nilichofanya',
    category: 'mentor-stories',
    tags: ['Career', 'Future', 'MentalHealth'],
    emoji: '🎓',
    readTime: '4 min',
    body: `Let me be real with you — I graduated from university in 2019, threw my cap in the air, took beautiful photos at the KICC, and genuinely believed life was about to sort itself out. It did not. For two full years, I sent out hundreds of CVs. I woke up every Tuesday to buy the Daily Nation just for the jobs pullout. Nothing.
    
It was the darkest period of my life. The emotional reality of graduate unemployment in Kenya is heavy. You feel like a burden to your parents, and watching your friends post their new office badges on Instagram stings more than you want to admit.

Here is what I actually did to get out of that hole:

1. **I stopped waiting for "the" job and took "a" job.** I had a degree in Economics, but my first paying gig after graduating was writing product descriptions for a friend's online thrift shop. It paid KES 500 a day. It hurt my pride, but it got me out of the house and taught me digital marketing.

2. **I shifted from certificate-hunting to skill-building.** In the real world, employers don't care about your GPA; they care about what you can do. I spent my free time on YouTube learning Excel and basic data analysis. I built a small portfolio of dummy projects. 

3. **I used the gig economy.** Sites like Upwork and Fiverr, and local gigs like transcription or academic writing, kept me afloat. It wasn't glamorous, but it taught me client management and discipline.

4. **I networked laterally, not just upwards.** We always try to network with CEOs who don't have time for us. I started networking with people just one or two steps ahead of me — the HR assistants, the junior analysts. They are the ones who know when an unadvertised internship is opening up.

Your degree is not a guarantee; it is just a foundation. Do not let the waiting period destroy your self-worth. Keep moving, keep learning, and swallow your pride. Your breakthrough will come, but it might look different than you expected.`,
    body_sw: `Wacha nikuambie ukweli — nilihitimu kutoka chuo kikuu mwaka wa 2019, nikarusha kofia yangu hewani, nikapiga picha nzuri pale KICC, na kuamini kabisa kwamba maisha yalikuwa karibu kunyooka. Haikuwa hivyo. Kwa miaka miwili kamili, nilituma mamia ya barua za maombi (CVs). Niliamka kila Jumanne kununua gazeti la Daily Nation kwa ajili ya kurasa za kazi tu. Hakuna chochote.

Hicho kilikuwa kipindi kigumu zaidi katika maisha yangu. Ukweli wa kihisia wa ukosefu wa ajira kwa wahitimu nchini Kenya ni mzito. Unahisi kama mzigo kwa wazazi wako, na kuona marafiki zako wakiweka picha za vitambulisho vyao vipya vya ofisi kwenye Instagram inauma zaidi kuliko unavyotaka kukiri.

Hiki ndicho nilichofanya hasa kujiondoa katika shimo hilo:

1. **Niliacha kusubiri kazi "yangu" na kuchukua kazi "yoyote".** Nilikuwa na digrii ya Uchumi, lakini kazi yangu ya kwanza ya kulipwa baada ya kuhitimu ilikuwa kuandika maelezo ya bidhaa kwa duka la mtandaoni la rafiki yangu la kuuza mitumba. Ililipa KES 500 kwa siku. Ilinishushia hadhi, lakini ilinitoa nyumbani na kunifunza masoko ya kidijitali.

2. **Nilibadilika kutoka kutafuta vyeti hadi kujenga ujuzi.** Katika ulimwengu wa kweli, waajiri hawajali kuhusu alama zako (GPA); wanajali kuhusu kile unachoweza kufanya. Nilitumia muda wangu wa ziada kwenye YouTube kujifunza Excel na uchanganuzi wa kimsingi wa data. Nilitengeneza miradi midogo ya majaribio kuonyesha ujuzi wangu.

3. **Nilitumia fursa za kazi za mikataba (gig economy).** Tovuti kama Upwork na Fiverr, na kazi za ndani kama kuandika sauti (transcription) ziliniweka sawa kifedha. Haikuwa kazi ya kifahari, lakini ilinifunza usimamizi wa wateja na nidhamu.

4. **Nilitengeneza mtandao na watu wa rika langu, si wakubwa tu.** Sisi kila mara tunajaribu kutengeneza mtandao na wakurugenzi (CEOs) ambao hawana muda na sisi. Nilianza kujenga uhusiano na watu walio hatua moja au mbili mbele yangu — wasaidizi wa HR, wachanganuzi wa ngazi ya chini. Hawa ndio wanaojua wakati nafasi ya tarajali (internship) isiyotangazwa inapotokea.

Digrii yako si dhamana; ni msingi tu. Usiruhusu kipindi cha kusubiri kiharibu thamani yako. Endelea kusonga, endelea kujifunza, na uweke kiburi kando. Kufanikiwa kwako kutakuja, lakini huenda kukaonekana tofauti na ulivyotarajia.`,
    month: 2,
  },
  {
    id: 'ya-ms-2',
    title: 'Moving out for the first time nearly broke me. What I wish I knew',
    title_sw: 'Kuhama nyumbani kwa mara ya kwanza kulikaribia kunivunja. Kile natamani ningejua',
    category: 'mentor-stories',
    tags: ['Money', 'Decisions', 'MentalHealth'],
    emoji: '🏠',
    readTime: '4 min',
    body: `I will never forget my first bedsitter in Roysambu. I had just gotten my first real job, packed my bags, and told my parents I was ready for independence. Two weeks later, I was sitting on a mattress on the floor, eating plain noodles, wondering how my money had finished so fast.

Moving out is romanticized. The reality is expensive, lonely, and overwhelming. Here is what I wish I knew before I took the leap:

1. **The hidden costs are brutal.** Rent is only half the story. I completely forgot about the deposit (usually equal to one month's rent), water deposits, electricity tokens, garbage collection fees, and the cost of basic items like a mop, bucket, salt, and matchboxes. You need at least three times your rent saved up before you move.

2. **Loneliness hits you randomly.** In the family home, there is always noise — a TV playing, someone cooking, siblings arguing. In your own place, the silence can be deafening. The first few weekends alone were incredibly tough. I had to learn to enjoy my own company without constantly going out (and spending money) just to be around people.

3. **Cooking is not optional; it is survival.** Eating out or ordering food will bankrupt you faster than anything else. I had to call my mum to learn how to cook basic meals like ugali, ndengu, and cabbage. Meal prepping on Sundays saved me from eating junk food when I came home tired from work.

4. **Buy things slowly.** You do not need a TV, a fridge, and a carpet on day one. I lived out of a suitcase for a month. Buy a good mattress, a jiko or gas cylinder, and basic utensils. Everything else can wait until you get your next salary. 

Independence is beautiful, but it requires strategy. Do not rush to move out just to look cool to your friends. Take your time, save up, and learn how to manage yourself first.`,
    body_sw: `Sitawahi kusahau chumba changu cha kwanza (bedsitter) kule Roysambu. Nilikuwa ndio kwanza nimepata kazi yangu ya kwanza halisi, nikafunga virago vyangu, na kuwaambia wazazi wangu nilikuwa tayari kujitegemea. Wiki mbili baadaye, nilikuwa nimekaa kwenye godoro sakafuni, nikila noodles tupu, nikijiuliza pesa zangu ziliishaje haraka hivyo.

Kuhama nyumbani mara nyingi huonekana kama jambo la kifahari sana. Ukweli ni kwamba ni ghali, kunaleta upweke, na kulemea sana. Hiki ndicho natamani ningejua kabla sijaamua:

1. **Gharama zilizojificha ni kali.** Kodi ni nusu tu ya stori. Nilisahau kabisa kuhusu amana (deposit - kawaida ni sawa na kodi ya mwezi mmoja), amana ya maji, stima za tokeni, ada za kuzoa taka, na gharama za vitu vya msingi kama dekio (mop), ndoo, chumvi, na viberiti. Unahitaji kuwa na akiba ya angalau mara tatu ya kodi yako kabla ya kuhama.

2. **Upweke unakupata bila kutarajia.** Nyumbani kwa familia, daima kuna kelele — TV inalia, mtu anapika, ndugu wanabishana. Kwenye nyumba yako mwenyewe, ukimya unaweza kuwa wa kutosha kukufanya uwe kiziwi. Wikendi chache za kwanza peke yangu zilikuwa ngumu sana. Ilinibidi nijifunze kufurahia kuwa peke yangu bila kulazimika kutoka nje (na kutumia pesa) ili tu kuwa karibu na watu.

3. **Kupika si hiari; ni njia ya kuishi.** Kula kwenye mikahawa au kuagiza chakula kutakufilisi haraka kuliko kitu kingine chochote. Ilinibidi nimpigie simu mama yangu kujifunza jinsi ya kupika vyakula vya kawaida kama ugali, ndengu, na kabeji. Kupika vyakula vya wiki nzima siku ya Jumapili kulinisaidia kuepuka kula vyakula visivyo na afya niliporudi nyumbani nikiwa nimechoka kutoka kazini.

4. **Nunua vitu polepole.** Huna haja ya TV, friji, na zulia siku ya kwanza. Niliishi kwa kutumia nguo kutoka kwenye sanduku kwa mwezi mmoja. Nunua godoro zuri, jiko au mtungi wa gesi, na vyombo vya msingi. Vitu vingine vyote vinaweza kusubiri hadi upate mshahara wako unaofuata.

Kujitegemea ni kuzuri, lakini kunahitaji mkakati. Usikimbilie kuhama ili tu uonekane mjanja kwa marafiki zako. Chukua muda wako, weka akiba, na ujifunze jinsi ya kujisimamia kwanza.`,
    month: 2,
  },
  {
    id: 'ya-sl-1',
    title: 'KCSE results are out. Now what? A real guide to your options',
    title_sw: 'Matokeo ya KCSE yametoka. Sasa nini? Mwongozo halisi wa chaguo zako',
    category: 'school',
    tags: ['School', 'Future', 'Decisions'],
    emoji: '📝',
    readTime: '4 min',
    body: `So the SMS came through. Maybe you are celebrating, maybe you are hiding in your room crying, or maybe you are just feeling numb. Whatever your KCSE grade is, take a deep breath. In Kenya, we treat KCSE like it is the end of the world, but it is just a junction in the road.

Here is a realistic guide on what to do next, regardless of your grade:

1. **If you got a C+ and above (University Route):**
Congratulations, you qualify for university. But please, do not just choose a course because it sounds prestigious or because your parents want you to be an engineer. Look at the KUCCPS portal carefully. Research the job market. Are there actual jobs in that field? Sometimes a specialized diploma is better than a generic degree. Also, start understanding HELB loans now — it is money you will have to pay back, so apply wisely.

2. **If you got a C or C- (Diploma/Polytechnic Route):**
Let me be completely honest: this is often the most strategic place to be. TVETs (Technical and Vocational Education and Training) and polytechnics offer skills that the Kenyan market actually needs. While degree holders are tarmac-ing, people with diplomas in plumbing, electrical engineering, catering, and IT are getting hired or starting their own businesses. TVET is not for "failures"; it is for practical thinkers.

3. **If you got a D+ and below (Certificate/Artisan Route):**
You are not a failure. Exams test memory, not intelligence. You can start with a certificate or artisan course at a local technical institute and upgrade to a diploma later. Many successful business owners in Kenya started exactly here. Courses like hairdressing, mechanics, fashion design, or basic coding do not require an A. They require passion and hard work.

4. **How to talk to your parents:**
If your grades disappointed them, let them vent. Then, come to them with a PLAN. Do not just say "I'm sorry." Say, "I got a D, but I have researched this Certificate in Web Design at the local TVET, and here is how much it costs." Parents respect a plan.

Your KCSE grade is a piece of paper. What you do with it from today onwards is what actually matters.`,
    body_sw: `Basi ujumbe mfupi (SMS) umeingia. Labda unasherehekea, labda umejificha chumbani kwako ukilia, au labda unahisi tu ganzi. Chochote kile alama yako ya KCSE, vuta pumzi ndefu. Nchini Kenya, tunachukulia KCSE kama mwisho wa dunia, lakini ni njia panda tu katika safari yako.

Huu hapa ni mwongozo wa kweli wa kile cha kufanya baadaye, bila kujali alama yako:

1. **Ikiwa ulipata C+ na zaidi (Njia ya Chuo Kikuu):**
Hongera, unafuzu kwenda chuo kikuu. Lakini tafadhali, usichague tu kozi kwa sababu inasikika kuwa ya kifahari au kwa sababu wazazi wako wanataka uwe mhandisi. Angalia mtandao wa KUCCPS kwa uangalifu. Fanya utafiti kuhusu soko la ajira. Je, kuna kazi halisi katika uwanja huo? Wakati mwingine diploma maalum ni bora kuliko digrii ya kawaida. Pia, anza kuelewa mikopo ya HELB sasa — ni pesa ambayo itabidi ulipe, kwa hivyo omba kwa busara.

2. **Ikiwa ulipata C au C- (Njia ya Diploma/Polytechnic):**
Wacha niwe mkweli kabisa: hili mara nyingi ndilo eneo la kimkakati zaidi kuwa. Vyuo vya TVET na polytechnic vinatoa ujuzi ambao soko la Kenya linahitaji hasa. Wakati wenye digrii wanahangaika kutafuta kazi, watu wenye diploma katika ufundi bomba, uhandisi wa umeme, upishi, na IT wanaajiriwa au kuanzisha biashara zao wenyewe. TVET si ya "waliofeli"; ni kwa wanaofikiri kwa vitendo.

3. **Ikiwa ulipata D+ na chini (Njia ya Cheti/Ufundi):**
Wewe si mshindwa. Mitihani hupima kumbukumbu, si akili. Unaweza kuanza na kozi ya cheti au ufundi katika taasisi ya kiufundi ya eneo lako na kujiendeleza hadi diploma baadaye. Wafanyabiashara wengi waliofanikiwa nchini Kenya walianzia hapa. Kozi kama ususi wa nywele, ufundi wa magari, ubunifu wa mavazi, au uandishi wa kodi za kompyuta hazihitaji A. Zinahitaji shauku na bidii.

4. **Jinsi ya kuzungumza na wazazi wako:**
Ikiwa alama zako zimewakatisha tamaa, waache watoe hasira zao. Kisha, nenda kwao na MPANGO. Usiseme tu "Nisamehe." Sema, "Nilipata D, lakini nimefanya utafiti kuhusu Cheti hiki cha Ubunifu wa Wavuti kwenye chuo cha TVET, na hii ndiyo gharama yake." Wazazi wanaheshimu mipango.

Alama yako ya KCSE ni kipande cha karatasi. Kile unachofanya kuanzia leo ndicho chenye maana kweli.`,
    month: 2,
  },
  {
    id: 'ya-sl-2',
    title: 'How to survive your first year at university or college',
    title_sw: 'Jinsi ya kustahimili mwaka wako wa kwanza katika chuo kikuu au chuo',
    category: 'school',
    tags: ['School', 'MentalHealth', 'Decisions'],
    emoji: '🏢',
    readTime: '4 min',
    body: `First-year freedom is a dangerous thing. For four years in high school, bells told you when to wake up, when to eat, and when to sleep. Suddenly, you are in campus. Nobody cares if you attend the 8 AM lecture. You get your HELB loan directly to your account. It feels amazing — until reality hits.

Here is how to survive "First Year" without losing yourself or your grades:

1. **Treat your HELB loan like an emergency fund, not party money.** I have seen students buy expensive sneakers and throw massive bashes in their first week, only to survive on strong tea and plain rice by week five. Budget that money. Pay your rent first, buy dry food items (unga, beans, rice) in bulk, and keep the rest locked in an M-Shwari account. 

2. **Attend classes, even the boring ones.** Lecturers will not follow you around. But in university, 30% of your grade often comes from Continuous Assessment Tests (CATs) and assignments that are sometimes announced randomly in class. Missing classes is the easiest way to fail. 

3. **Choose your friends carefully.** The people you hang out with in your first semester will shape your entire campus life. If you hang around people who think skipping class and drinking on Tuesdays is cool, you will become one of them. Find friends who are serious about their future but still know how to have healthy fun.

4. **Join one club or society.** Campus is lonely at first. Joining a club — whether it is the Christian Union, the Drama society, or a Tech club — gives you an instant community. It is also where you will meet senior students who can give you past papers and advice on which lecturers are strict.

5. **Protect your sexual health and boundaries.** Campus is full of pressure. You do not have to do anything you are not ready for just to fit in. Be extremely careful, know your boundaries, and never compromise your safety for a relationship or peer pressure.

Campus is the bridge between childhood and adulthood. Cross it wisely.`,
    body_sw: `Uhuru wa mwaka wa kwanza ni jambo la hatari. Kwa miaka minne katika shule ya upili, kengele zilikuelekeza wakati wa kuamka, wakati wa kula, na wakati wa kulala. Ghafla, uko chuoni. Hakuna anayejali ikiwa utahudhuria kipindi cha saa mbili asubuhi. Unapata mkopo wako wa HELB moja kwa moja kwenye akaunti yako. Inahisi vizuri sana — hadi ukweli unapokupiga.

Hivi ndivyo unavyoweza kustahimili "Mwaka wa Kwanza" bila kujipoteza au kupoteza alama zako:

1. **Chukulia mkopo wako wa HELB kama pesa ya dharura, si pesa ya sherehe.** Nimeona wanafunzi wakinunua viatu vya bei ghali na kufanya sherehe kubwa katika wiki yao ya kwanza, na baadaye kuishi kwa kunywa chai nzito na mchele mtupu ifikapo wiki ya tano. Panga bajeti ya pesa hiyo. Lipa kodi yako kwanza, nunua vyakula vikavu (unga, maharagwe, mchele) kwa wingi, na uweke zilizobaki kwenye akaunti ya M-Shwari.

2. **Hudhuria madarasa, hata yale yanayochosha.** Wahadhiri hawatakufuata. Lakini chuo kikuu, asilimia 30 ya alama zako mara nyingi hutokana na Mitihani ya Mara kwa Mara (CATs) na kazi ambazo wakati mwingine hutangazwa kwa kushtukiza darasani. Kukosa madarasa ndiyo njia rahisi ya kufeli.

3. **Chagua marafiki zako kwa uangalifu.** Watu unaoshirikiana nao katika muhula wako wa kwanza wataunda maisha yako yote ya chuo. Ikiwa unashirikiana na watu wanaofikiri kutoroka darasa na kunywa pombe siku za Jumanne ni ujanja, utakuwa mmoja wao. Tafuta marafiki walio makini na mustakabali wao lakini bado wanajua jinsi ya kufurahi kwa njia nzuri.

4. **Jiunge na klabu au chama kimoja.** Chuo huleta upweke mwanzoni. Kujiunga na klabu — iwe ni Muungano wa Kikristo (CU), chama cha Drama, au klabu ya Teknolojia — kunakupa jamii mara moja. Pia ni pale utakapokutana na wanafunzi waandamizi ambao wanaweza kukupa makaratasi ya mitihani ya zamani (past papers) na ushauri kuhusu wahadhiri walio wakali.

5. **Linda afya yako ya uzazi na mipaka yako.** Chuo kimejaa shinikizo. Huna haja ya kufanya chochote ambacho hauko tayari kukifanya ili tu uonekane unafaa. Kuwa mwangalifu sana, jua mipaka yako, na usiwahi kuhatarisha usalama wako kwa ajili ya mahusiano au shinikizo la rika.

Chuo ni daraja kati ya utoto na utu uzima. Livuke kwa busara.`,
    month: 2,
  },
  {
    id: 'ya-mh-1',
    title: 'Quarter-life crisis is real. Here is how to get through it',
    title_sw: 'Kukata tamaa ukiwa kijana ni jambo halisi. Hivi ndivyo vya kufanya',
    category: 'mental-health',
    tags: ['MentalHealth', 'Stress', 'Future'],
    emoji: '🌀',
    readTime: '4 min',
    body: `"Who am I? What am I doing with my life? Why is everyone else moving faster than me?" 

If you are between 18 and 22, you have probably asked yourself these questions while staring at the ceiling at 2 AM. Welcome to the quarter-life crisis. It is that confusing period when you are officially an adult, but you still feel like a kid pretending to know what is going on.

In Kenya, this crisis hits harder because of family expectations, youth unemployment, and the pressure to "make it" quickly. Here is how to navigate the storm:

1. **Understand that your timeline is unique.** You will see former classmates getting jobs, starting businesses, or even getting married while you are still trying to figure out how to write a CV. Social media makes this worse. Remember: people only post their wins. Nobody posts their rejection emails. Stop comparing your behind-the-scenes to their highlight reel.

2. **It is okay to change your mind.** Many young adults feel stuck because they chose a course at 18 that they hate at 21. It is perfectly fine to pivot. Your 20s are for experimenting. You are not a tree — you can move. The skills you learned will still be useful, even in a different field.

3. **Focus on the "Next Right Step," not the next 10 years.** Thinking about where you will be at 30 is overwhelming. Instead, ask yourself: "What is the next right step I can take today?" Maybe it is applying for one internship. Maybe it is having a tough conversation with your parents. Maybe it is just getting out of bed. Small steps cure paralysis.

4. **Talk about it with your peers.** The secret about the quarter-life crisis is that almost EVERYONE your age is going through it. We are just all pretending we are fine. The moment you tell a friend, "I honestly have no idea what I'm doing," you give them permission to say, "Me neither!" The relief is instant.

You are not failing at life; you are just starting it. Be patient with yourself. The confusion means you are growing.`,
    body_sw: `"Mimi ni nani? Ninafanya nini na maisha yangu? Kwa nini kila mtu mwingine anaonekana kusonga mbele kwa kasi kuliko mimi?"

Ikiwa una kati ya miaka 18 na 22, labda umejiuliza maswali haya ukitazama dari saa nane usiku. Karibu katika kipindi cha mkanganyiko wa maisha ya ujana (quarter-life crisis). Ni kile kipindi cha kutatanisha ambapo wewe ni mtu mzima rasmi, lakini bado unahisi kama mtoto anayejifanya anajua kinachoendelea.

Nchini Kenya, mgogoro huu unapiga sana kwa sababu ya matarajio ya familia, ukosefu wa ajira kwa vijana, na shinikizo la "kufanikiwa" haraka. Hivi ndivyo unavyoweza kuvuka dhoruba hii:

1. **Elewa kuwa ratiba yako ni ya kipekee.** Utaona wanafunzi wenzako wa zamani wakipata kazi, wakianzisha biashara, au hata kuolewa wakati wewe bado unajaribu kuelewa jinsi ya kuandika CV. Mitandao ya kijamii hufanya hili kuwa baya zaidi. Kumbuka: watu huweka tu mafanikio yao mtandaoni. Hakuna anayeweka barua zake za kukataliwa kazi. Acha kulinganisha siri zako na picha zao nzuri.

2. **Ni sawa kubadilisha mawazo yako.** Vijana wengi huhisi kukwama kwa sababu walichagua kozi wakiwa na miaka 18 ambayo wanaichukia wakiwa na miaka 21. Ni sawa kabisa kubadilisha mwelekeo. Miaka yako ya 20 ni ya kufanya majaribio. Wewe si mti — unaweza kusonga. Ujuzi uliojifunza bado utakuwa muhimu, hata katika uwanja tofauti.

3. **Zingatia "Hatua Inayofuata Sahihi," si miaka 10 ijayo.** Kufikiria utakuwa wapi ukiwa na miaka 30 kunalemea. Badala yake, jiulize: "Ni hatua gani sahihi inayofuata ninayoweza kuchukua leo?" Labda ni kutuma maombi ya nafasi moja ya mafunzo (internship). Labda ni kuwa na mazungumzo magumu na wazazi wako. Labda ni kuamka tu kitandani. Hatua ndogo huponya hali ya kukwama.

4. **Zungumza na vijana wenzako.** Siri kuhusu mgogoro huu ni kwamba karibu KILA MTU wa umri wako anaupitia. Sisi sote tunajifanya tuko sawa. Mara tu unapomwambia rafiki, "Kwa kweli sijui ninafanya nini," unampa ruhusa ya kusema, "Mimi pia!" Utulivu unakuja mara moja.

Hufeli maishani; ndio kwanza unaanza. Kuwa na subira na wewe mwenyewe. Mkanganyiko unamaanisha unakua.`,
    month: 2,
  },
  {
    id: 'ya-mh-2',
    title: 'How to deal with family pressure about your choices',
    title_sw: 'Jinsi ya kukabiliana na shinikizo la familia kuhusu chaguo zako',
    category: 'mental-health',
    tags: ['MentalHealth', 'Decisions', 'Future'],
    emoji: '🫂',
    readTime: '4 min',
    body: `Family gatherings in Kenya can be stressful. Between the nyama choma and the laughter, there is always that one uncle or aunt who asks, "So when are you getting a real job?" or "Why are you studying Art instead of Medicine?"

In our collectivist culture, your choices are rarely just your own. Family pressure comes from a place of love and a desire for security, but it can still feel incredibly heavy. Here is how to handle it while respecting both your elders and yourself:

1. **Do not argue; explain your 'Why'.** When your parents criticize your choice to start a small business instead of getting a master's degree, do not get defensive. Say, "I know you want me to be secure. The reason I am doing this is because..." Show them your research. Parents fear the unknown; facts reduce their fear.

2. **Understand the generational gap.** Your parents grew up in a Kenya where a degree from a public university guaranteed a government job and a pension. They are giving you the best advice for the world THEY grew up in. Recognize that their advice is outdated, but their intention is good. 

3. **Set boundaries respectfully.** If conversations about your career or relationship status always end in a fight, it is okay to draw a line. You can say, "Mum, I appreciate that you care about my future, but I need time to figure this out. I will update you when I have news, but for now, can we not talk about it every time we meet?"

4. **Find a family ally.** Is there an older cousin, an aunt, or a sibling who "gets" what you are trying to do? Talk to them. Sometimes, having another adult explain your choices to your parents works better than you trying to defend yourself.

You are the one who has to live your life. Honoring your parents does not mean living the life they want for you at the expense of your own happiness.`,
    body_sw: `Mikutano ya familia nchini Kenya inaweza kuleta msongo wa mawazo. Kati ya nyama choma na vicheko, kila mara kuna yule mjomba au shangazi ambaye anauliza, "Sasa utapata lini kazi halisi?" au "Kwa nini unasomea Sanaa (Art) badala ya Udaktari?"

Katika utamaduni wetu wa kijamii, chaguo zako mara chache huwa zako pekee. Shinikizo la familia hutokana na upendo na tamaa ya usalama, lakini bado linaweza kuhisiwa kuwa zito sana. Hivi ndivyo unavyoweza kukabiliana nalo huku ukiwaheshimu wazee wako na wewe mwenyewe:

1. **Usibishane; eleza 'Kwa nini' yako.** Wazazi wako wanapokosoa uamuzi wako wa kuanzisha biashara ndogo badala ya kusomea digrii ya uzamili (master's), usijihami kwa ukali. Sema, "Najua mnataka niwe na usalama wa maisha. Sababu inayonifanya nifanye hivi ni kwa sababu..." Waonyeshe utafiti wako. Wazazi huogopa wasichokijua; ukweli hupunguza hofu yao.

2. **Elewa tofauti ya kizazi.** Wazazi wako walikua katika Kenya ambapo digrii kutoka chuo kikuu cha umma ilihakikisha kazi ya serikali na pensheni. Wanakupa ushauri bora zaidi kwa dunia WALIYOKULIA. Tambua kuwa ushauri wao umepitwa na wakati, lakini nia yao ni nzuri.

3. **Weka mipaka kwa heshima.** Ikiwa mazungumzo kuhusu kazi yako au hali ya uhusiano wako kila mara huishia kwenye ugomvi, ni sawa kuweka mpaka. Unaweza kusema, "Mama, nashukuru kwa kuwa unajali mustakabali wangu, lakini nahitaji muda wa kujua nifanye nini. Nitakupa taarifa nikiwa na habari mpya, lakini kwa sasa, tunaweza kuacha kuzungumza kuhusu hili kila tunapokutana?"

4. **Tafuta mshirika katika familia.** Je, kuna binamu mkubwa, shangazi, au ndugu ambaye "anaelewa" kile unachojaribu kufanya? Zungumza nao. Wakati mwingine, kuwa na mtu mzima mwingine kuelezea chaguo zako kwa wazazi wako hufanya kazi vizuri zaidi kuliko wewe kujaribu kujitetea.

Wewe ndiye unayepaswa kuishi maisha yako. Kuwaheshimu wazazi wako hakumaanishi kuishi maisha wanayotaka wao kwa gharama ya furaha yako mwenyewe.`,
    month: 2,
  },
  {
    id: 'ya-rs-1',
    title: 'Navigating romantic relationships when you are broke and ambitious',
    title_sw: 'Kusimamia mahusiano ya kimapenzi ukiwa huna pesa lakini una malengo',
    category: 'relationships',
    tags: ['Money', 'Decisions', 'Future'],
    emoji: '❤️',
    readTime: '4 min',
    body: `Dating in Kenya right now is expensive. Between the pressure to go to aesthetic cafes, buy gifts, and cover transport (yes, the famous "tuma fare"), maintaining a relationship when you are young and broke can feel like an extreme sport.

But romance and ambition can coexist if you handle them maturely. Here is how to navigate relationships when you are building your future from zero:

1. **Be honest about your financial reality from day one.** Do not fake a lifestyle you cannot afford to impress someone. If you are surviving on a tight budget, say so. "I would love to take you to that new restaurant, but it is not in my budget right now. How about we get street food and walk in Karura Forest instead?" If they like you, they will say yes. If they say no, they just saved you from a very expensive mistake.

2. **Stop subscribing to the "provider" myth too early.** Many young men feel intense pressure to fully finance their girlfriends, while many young women feel pressured to expect it. When you are 20, you are both supposed to be building. Support each other emotionally, study together, brainstorm business ideas together. Your 20s are for partnership, not sponsorship.

3. **Watch out for relationships that drain your focus.** An ambitious person's greatest asset is time. If your partner requires you to text them 24/7, gets jealous when you are studying, or makes you feel guilty for working on a side hustle, that is a massive red flag. A good partner will push you toward your goals, not pull you away from them.

4. **Do not let "being broke" stop you from being romantic.** Romance is about effort, not cash. A handwritten note, a shared playlist, cooking a simple meal together, or saving up for one meaningful date shows more love than putting yourself in debt to buy expensive shoes.

Love is beautiful, but do not sacrifice your future for a temporary feeling. The right person will build with you in the trenches.`,
    body_sw: `Kuchumbiana nchini Kenya sasa hivi ni ghali. Kati ya shinikizo la kwenda kwenye mikahawa ya kifahari, kununua zawadi, na kulipia usafiri (ndiyo, ule msemo maarufu wa "tuma fare"), kudumisha uhusiano unapokuwa kijana asiye na pesa inaweza kuhisi kama mchezo wa hatari.

Lakini mapenzi na malengo makubwa vinaweza kuishi pamoja ikiwa utavishughulikia kwa ukomavu. Hivi ndivyo unavyoweza kusimamia mahusiano unapojenga hatima yako kuanzia sifuri:

1. **Kuwa mkweli kuhusu hali yako ya kifedha tangu siku ya kwanza.** Usijifanye una maisha ambayo huwezi kuyamudu ili kumvutia mtu. Ikiwa unaishi kwa bajeti ngumu, sema hivyo. "Ningependa kukupeleka kwenye ule mkahawa mpya, lakini hauko kwenye bajeti yangu sasa hivi. Vipi tuchukue chakula cha mtaani (street food) na tutembee katika Msitu wa Karura badala yake?" Ikiwa wanakupenda, watasema ndiyo. Ikiwa watasema hapana, wamekuokoa kutokana na kosa la gharama kubwa sana.

2. **Acha kufuata hadithi ya "mtoaji" (provider) mapema sana.** Vijana wengi wa kiume huhisi shinikizo kubwa la kufadhili kikamilifu wapenzi wao, huku vijana wengi wa kike wakihisi shinikizo la kutarajia hilo. Unapokuwa na miaka 20, nyote mnapaswa kuwa mnajenga. Kusaidiana kihisia, kusoma pamoja, kujadiliana kuhusu mawazo ya biashara pamoja. Miaka yako ya 20 ni ya ubia (partnership), si ufadhili (sponsorship).

3. **Kuwa mwangalifu na mahusiano yanayopoteza mwelekeo wako.** Rasilimali kuu ya mtu mwenye malengo ni wakati. Ikiwa mpenzi wako anakuhitaji umtumie ujumbe saa 24/7, anakuwa na wivu unaposoma, au anakufanya ujisikie hatia kwa kufanya kazi yako ya kando, hiyo ni ishara kubwa ya hatari (red flag). Mpenzi mzuri atakusukuma kuelekea malengo yako, si kukuvuta mbali nayo.

4. **Usiruhusu "kukosa pesa" kukuzuie kuwa na mapenzi (romantic).** Mapenzi ni kuhusu juhudi, si pesa taslimu. Ujumbe ulioandikwa kwa mkono, orodha ya nyimbo mnazoshiriki (playlist), kupika chakula rahisi pamoja, au kuweka akiba kwa ajili ya mlo mmoja wa maana kunaonyesha upendo zaidi kuliko kujiingiza kwenye madeni ili kununua viatu vya bei ghali.

Mapenzi ni mazuri, lakini usijinyime mustakabali wako kwa hisia za muda mfupi. Mtu anayefaa atajenga nawe tangu mwanzo.`,
    month: 2,
  },
  {
    id: 'ya-rs-2',
    title: 'Friendships change after school. How to handle it',
    title_sw: 'Urafiki hubadilika baada ya shule. Jinsi ya kukabiliana na hilo',
    category: 'relationships',
    tags: ['Friendship', 'MentalHealth'],
    emoji: '👋',
    readTime: '3 min',
    body: `In high school, it was easy. You saw your friends every single day. You ate the same food, wore the same uniform, and hated the same teachers. Then KCSE happened, and suddenly... silence.

The group chat is dead. Everyone is busy. One friend went to university, another started a business, and another just disappeared into their estate. 

Here is the harsh but necessary truth about friendships in young adulthood:

1. **Proximity is not the same as connection.** You will realize that some people were only your friends because you shared a desk. Once the desk was gone, the friendship vanished. That is completely normal. Do not take it personally. Not every friend is meant to be a "forever" friend. Some are just meant for a season.

2. **You have to put in effort now.** In adulthood, friendships do not just happen; they are scheduled. You cannot rely on seeing someone at 10 AM break time anymore. If you want to keep a friendship alive, you have to be intentional. Call them. Check on them. Suggest a meet-up. If you are the only one making the effort for months, though, let it go.

3. **Jealousy will test you.** When you are 20, everyone moves at different speeds. Your friend might get a high-paying job while you are still tarmac-ing. Or you might get into university while they do not. It is easy to feel envious or insecure. Remind yourself that their success does not take away from your potential. Clap for your friends, loudly.

4. **Make space for new people.** As your interests change, so should your circle. If you start a business, you need friends who understand the hustle. If you go to college, you need study partners. Keep your old friends close, but do not close your heart to new ones.

Growing up means growing apart from some people. It hurts, but it is the only way to make room for who you are becoming.`,
    body_sw: `Katika shule ya upili, ilikuwa rahisi. Uliwaona marafiki zako kila siku. Mlikula chakula kimoja, mlivaa sare moja, na mliwajadili walimu wale wale. Kisha KCSE ikatokea, na ghafla... kimya.

Kikundi cha WhatsApp kimekufa. Kila mtu yuko busy. Rafiki mmoja alienda chuo kikuu, mwingine alianzisha biashara, na mwingine alitoweka tu mtaani kwao.

Huu hapa ni ukweli mchungu lakini wa lazima kuhusu urafiki katika utu uzima wa mapema:

1. **Kuwa karibu si sawa na kuwa na muungano wa kweli.** Utatambua kwamba baadhi ya watu walikuwa marafiki zako tu kwa sababu mlishiriki dawati moja. Dawati lilipotoweka, urafiki ulitoweka. Hilo ni jambo la kawaida kabisa. Usilichukulie binafsi. Si kila rafiki anakusudiwa kuwa rafiki wa "milele". Baadhi ni wa msimu tu.

2. **Inabidi uweke juhudi sasa.** Katika utu uzima, urafiki hautokei tu; unaratibiwa. Huwezi kutegemea tena kumuona mtu saa nne asubuhi wakati wa mapumziko. Ikiwa unataka kuweka urafiki hai, lazima uwe na dhamira. Wapigie simu. Wajulie hali. Pendekeza mweze kukutana. Lakini ikiwa wewe ndiye pekee anayeweka juhudi kwa miezi kadhaa, uachilie urafiki huo.

3. **Wivu utakujaribu.** Unapokuwa na miaka 20, kila mtu anasonga kwa kasi tofauti. Rafiki yako anaweza kupata kazi inayolipa mshahara mkubwa huku wewe bado ukitafuta (tarmacing). Au unaweza kuingia chuo kikuu huku wao wakikosa. Ni rahisi kuhisi wivu au kutojiamini. Jikumbushe kwamba mafanikio yao hayaondoi uwezo wako. Wapigie makofi marafiki zako, kwa sauti kubwa.

4. **Toa nafasi kwa watu wapya.** Jinsi mapendeleo yako yanavyobadilika, ndivyo na mzunguko wako unavyopaswa kubadilika. Ukianzisha biashara, unahitaji marafiki wanaoelewa harakati hizo (hustle). Ukienda chuoni, unahitaji washirika wa kusoma. Waweke marafiki zako wa zamani karibu, lakini usifunge moyo wako kwa wapya.

Kukua inamaanisha kukua mbali na baadhi ya watu. Inauma, lakini ndiyo njia pekee ya kutoa nafasi kwa mtu unayekuwa sasa.`,
    month: 2,
  },
  {
    id: 'ya-sa-1',
    title: 'Digital safety for young adults: protecting your M-Pesa, your data, and your reputation',
    title_sw: 'Usalama wa kidijitali: kulinda M-Pesa, data yako, na sifa yako',
    category: 'safety',
    tags: ['Safety', 'Technology', 'Money'],
    emoji: '🔐',
    readTime: '4 min',
    body: `We live online. Our money, our memories, and our conversations are all trapped in our phones. But the digital world in Kenya is crawling with scammers and people looking to take advantage of you. You are no longer a kid; if you lose money on M-Pesa now, it is YOUR money.

Here is the ultimate young adult survival guide to digital safety:

1. **Beware the "SIM Swap" and "Tuma kwa hii number" scams.** If someone calls you claiming to be from Safaricom or Airtel, and they sound very professional, hang up. True customer care will NEVER ask for your PIN, ID number, or ask you to dial codes to "update your line." Also, ignore SMS messages saying "Tuma ile pesa kwa hii number" (Send the money to this number) — it is a classic trick.

2. **Do not use "1234" as your PIN.** Make your M-Pesa, banking app, and phone lock passwords hard to guess. Do not use your birth year. If your phone gets stolen on a matatu in the CBD, the first thing they will try is your birth year. Protect your hard-earned cash.

3. **The internet does not forget.** You are entering the job market soon. Employers will Google your name. They will check your Twitter and TikTok. If your timeline is full of extreme insults, inappropriate videos, or hate speech, you will lose opportunities before you even get an interview. Scrub your digital footprint. Clean it up.

4. **Sexting and digital coercion.** If you share an intimate photo with someone, understand that you have handed them a loaded gun. Relationships end, phones get stolen, and people get bitter. "Revenge porn" is illegal in Kenya under the Computer Misuse and Cybercrimes Act, but the damage to your reputation is hard to undo. Protect your dignity.

5. **Do not click suspicious links.** "Congratulations, you have won KES 50,000! Click here." "Free government youth funds available here!" If it sounds too good to be true, it is a scam. Clicking those WhatsApp links can give hackers access to your phone's data. 

Be smart. In the digital world, your privacy is your power. Guard it fiercely.`,
    body_sw: `Tunaishi mtandaoni. Pesa zetu, kumbukumbu zetu, na mazungumzo yetu yote yamefungiwa kwenye simu zetu. Lakini ulimwengu wa kidijitali nchini Kenya umejaa matapeli na watu wanaotaka kukutumia vibaya. Wewe si mtoto tena; ukipoteza pesa kwenye M-Pesa sasa, ni pesa YAKO.

Huu hapa ni mwongozo mkuu kwa vijana kuhusu usalama wa kidijitali:

1. **Jihadhari na utapeli wa "SIM Swap" na "Tuma kwa hii number".** Ikiwa mtu atakupigia simu akidai anatoka Safaricom au Airtel, na anasikika kwa njia ya kitaalamu sana, kata simu. Huduma ya kweli kwa wateja HAITAWAHI kukuuliza PIN yako, nambari ya kitambulisho, au kukuomba upige kodi ili "kusasisha laini yako." Pia, puuza jumbe za SMS zinazosema "Tuma ile pesa kwa hii number" — ni mbinu ya zamani.

2. **Usitumie "1234" kama PIN yako.** Fanya M-Pesa yako, programu ya benki, na manenosiri ya kufunga simu kuwa ngumu kukisia. Usitumie mwaka wako wa kuzaliwa. Ikiwa simu yako itaibiwa kwenye matatu katikati mwa jiji (CBD), jambo la kwanza watakalojaribu ni mwaka wako wa kuzaliwa. Linda pesa zako ulizozipata kwa bidii.

3. **Mtandao hausahau.** Unaingia kwenye soko la ajira hivi karibuni. Waajiri watatafuta jina lako kwenye Google. Wataangalia Twitter/X na TikTok yako. Ikiwa kurasa zako zimejaa matusi makali, video zisizofaa, au matamshi ya chuki, utapoteza fursa kabla hata hujapata mahojiano. Safisha alama yako ya kidijitali. Iweke safi.

4. **Kutuma picha za faragha (Sexting).** Ikiwa unashiriki picha ya faragha na mtu, elewa kuwa umempa silaha yenye risasi. Mahusiano huisha, simu huibiwa, na watu huwa na uchungu. "Revenge porn" (kusambaza picha za uchi kulipiza kisasi) ni kinyume cha sheria nchini Kenya chini ya Sheria ya Matumizi Mabaya ya Kompyuta na Uhalifu wa Mtandao, lakini madhara kwa sifa yako ni ngumu kufuta. Linda utu wako.

5. **Usibofye viungo (links) vinavyotiliwa shaka.** "Hongera, umeshinda KES 50,000! Bofya hapa." "Pesa za bure za vijana za serikali zinapatikana hapa!" Ikiwa inasikika kuwa nzuri sana kuwa kweli, ni utapeli. Kubofya viungo hivyo vya WhatsApp kunaweza kuwapa wadukuzi ufikiaji wa data ya simu yako.

Kuwa mwerevu. Katika ulimwengu wa kidijitali, faragha yako ni nguvu yako. Ilinde kwa ukali.`,
    month: 2,
  },
  {
    id: 'ya-sa-2',
    title: 'Signing your first contract or lease. What to check before you say yes',
    title_sw: 'Kutia saini mkataba au kodi yako ya kwanza. La kuangalia kabla ya kusema ndiyo',
    category: 'safety',
    tags: ['Safety', 'Future', 'Money'],
    emoji: '✍️',
    readTime: '3 min',
    body: `Welcome to adulthood, where every major decision comes with a piece of paper you need to sign. Whether it is your first job offer, a lease for a bedsitter, or a deal for your side hustle, signing a contract is legally binding. Ignorance of the law is not an excuse in Kenya.

Here is what you MUST look out for before putting pen to paper:

1. **Read everything. Yes, even the small print.** Nobody likes reading a 5-page document filled with legal jargon, but you have to. Take the contract home. Do not let anyone rush you by saying, "Just sign here quickly." If they are rushing you, they are probably hiding something.

2. **For House Leases (Rent):**
- **Deposit terms:** Know exactly under what conditions your deposit will be returned when you move out. Many landlords in Kenya invent reasons (like "repainting") to withhold your money. 
- **Hidden fees:** Does the rent include water, garbage, and security? Ask.
- **Goodwill:** If you are renting a shop for a business, watch out for "goodwill" payments. This is a non-refundable fee landlords charge just to give you the space. Negotiate it or walk away if it is too high.

3. **For Employment Contracts:**
- **Probation period:** How long is it? (Usually 3-6 months). Can they fire you without notice during this time?
- **Deductions:** Are they deducting PAYE, NHIF, and NSSF? If a company is paying you "gross" and telling you to sort out your own taxes, you are legally liable if KRA comes knocking.
- **Working hours:** Does the contract state you work Monday to Friday, but your boss verbally expects you there on Saturdays? What is on paper is what matters.

4. **When in doubt, ask.** Show the contract to an older sibling, a mentor, or a friend who has been working for a while. "Hey, does this clause look normal to you?" can save you from a trap.

Your signature is your bond. Protect it. Do not give it away out of excitement or desperation.`,
    body_sw: `Karibu katika utu uzima, ambapo kila uamuzi mkuu unakuja na karatasi unayohitaji kutia saini. Iwe ni ofa yako ya kwanza ya kazi, mkataba wa kupanga chumba (bedsitter), au mkataba wa biashara yako ya kando, kutia saini mkataba kunakufunga kisheria. Kutojua sheria si utetezi nchini Kenya.

Hiki ndicho LAZIMA uangalie kabla ya kuweka kalamu kwenye karatasi:

1. **Soma kila kitu. Ndiyo, hata maandishi madogo.** Hakuna anayependa kusoma hati ya kurasa 5 iliyojaa misamiati ya kisheria, lakini inabidi ufanye hivyo. Chukua mkataba nyumbani. Usiruhusu mtu yeyote akuharakishe kwa kusema, "Tia saini hapa haraka." Ikiwa wanakuharakisha, labda wanaficha kitu.

2. **Kwa Mikataba ya Nyumba (Kodi):**
- **Masharti ya amana (Deposit):** Jua hasa chini ya masharti gani amana yako itarudishwa utakapohama. Wamiliki wengi wa nyumba nchini Kenya hubuni sababu (kama "kupaka rangi upya") ili kuzuia pesa zako.
- **Gharama zilizofichwa:** Je, kodi inajumuisha maji, taka, na usalama? Uliza.
- **Goodwill:** Ikiwa unakodisha duka kwa ajili ya biashara, jihadhari na malipo ya "goodwill". Hii ni ada isiyorejeshwa ambayo wamiliki wa nyumba hutoza ili tu kukupa nafasi. Ijadili au uondoke ikiwa ni ghali mno.

3. **Kwa Mikataba ya Ajira:**
- **Kipindi cha majaribio (Probation):** Ni cha muda gani? (Kawaida ni miezi 3-6). Je, wanaweza kukufuta kazi bila taarifa wakati huu?
- **Makatato:** Je, wanakata PAYE (ushuru), NHIF, na NSSF? Ikiwa kampuni inakulipa jumla na kukuambia ujishughulikie ushuru wako mwenyewe, unawajibika kisheria KRA wakibisha hodi.
- **Saa za kazi:** Je, mkataba unasema unafanya kazi Jumatatu hadi Ijumaa, lakini bosi wako anatarajia uwepo Jumamosi kwa mdomo tu? Kile kilicho kwenye karatasi ndicho muhimu.

4. **Unapokuwa na shaka, uliza.** Muonyeshe mkataba huo kaka au dada mkubwa, mshauri, au rafiki ambaye amekuwa akifanya kazi kwa muda. "Vipi, kipengele hiki kinaonekana kuwa cha kawaida kwako?" inaweza kukuokoa kutoka kwenye mtego.

Saini yako ni ahadi yako. Ilinde. Usiitoe kwa sababu ya msisimko au kukata tamaa.`,
    month: 2,
  },
  {
    id: 'ya-fc-1',
    title: 'How to tell if you are actually ready for a serious relationship',
    title_sw: 'Jinsi ya kujua kama kweli uko tayari kwa uhusiano mkubwa',
    category: 'relationships',
    tags: ['Relationships', 'MentalHealth', 'Future'],
    emoji: '🤔',
    readTime: '3 min',
    body: `Everyone around you is posting their partners, and the pressure is getting to you. You feel like you should be in a serious relationship because "it is time." But are you actually ready, or do you just want to avoid being lonely?

Here is a checklist to know if you are genuinely ready to build with someone else:

1. **You are okay being alone.** This sounds contradictory, but the best relationships happen between two people who do not NEED each other to survive, but CHOOSE each other. If you are terrified of your own company, you will accept toxic behavior just to avoid being single.

2. **You know how to communicate when you are angry.** In high school, if you were mad, you just stopped talking to the person. Silent treatment. In an adult relationship, silent treatment is emotional abuse. Are you ready to sit down, swallow your pride, and say, "I felt hurt when you did that," instead of seeking revenge?

3. **You have your own goals.** A relationship should complement your life, not become your entire life. If you are looking for a partner to give your life meaning, direction, or financial stability, you are looking for a parent, not a partner. 

4. **You are willing to compromise.** When you are single, you eat what you want, go where you want, and sleep when you want. A relationship requires considering another person's feelings and schedule every single day. It is a sacrifice.

If you read this and realized you are not ready, congratulations! Self-awareness is a superpower. Enjoy your single season, work on yourself, and let love find you when you are fully prepared to handle it.`,
    body_sw: `Kila mtu karibu nawe anaweka picha za wapenzi wao mtandaoni, na shinikizo linakufikia. Unahisi kama unapaswa kuwa katika uhusiano mkubwa (serious relationship) kwa sababu "ni wakati." Lakini je, kweli uko tayari, au unataka tu kuepuka kuwa mpweke?

Hii hapa ni orodha ya kukuwezesha kujua ikiwa uko tayari kweli kujenga maisha na mtu mwingine:

1. **Uko sawa kuwa peke yako.** Hili linasikika kama kinyume, lakini mahusiano bora zaidi hutokea kati ya watu wawili ambao HAWAHITAJI mwingine ili kuishi, bali WANACHAGUANA. Ikiwa unaogopa kuwa peke yako, utakubali tabia mbaya (toxic) ili tu uepuke kuwa mseja.

2. **Unajua jinsi ya kuwasiliana unapokuwa na hasira.** Katika shule ya upili, ikiwa ulikasirika, uliacha tu kuzungumza na mtu huyo. Kususia (silent treatment). Katika uhusiano wa watu wazima, kususia ni unyanyasaji wa kihisia. Je, uko tayari kuketi, kuweka kiburi kando, na kusema, "Nilihisi kuumia ulipofanya vile," badala ya kutafuta kulipiza kisasi?

3. **Una malengo yako mwenyewe.** Uhusiano unapaswa kuongeza thamani kwenye maisha yako, si kuwa maisha yako yote. Ikiwa unatafuta mpenzi ili ayape maisha yako maana, mwelekeo, au usalama wa kifedha, unatafuta mzazi, si mpenzi.

4. **Uko tayari kukubaliana (compromise).** Unapokuwa mseja, unakula unachotaka, unaenda unakotaka, na kulala unapotaka. Uhusiano unahitaji kuzingatia hisia na ratiba ya mtu mwingine kila siku. Ni kujitolea.

Ikiwa umesoma haya na kugundua hauko tayari, hongera! Kujitambua ni nguvu kubwa. Furahia msimu wako wa kuwa mseja, jifanyie kazi, na uruhusu mapenzi yakupate ukiwa tayari kabisa kuyashughulikia.`,
    month: 2,
  },
  {
    id: 'ya-fc-2',
    title: 'Red flags to look out for in Kenyan dating',
    title_sw: 'Ishara za hatari za kuangalia katika uchumba nchini Kenya',
    category: 'relationships',
    tags: ['Safety', 'Relationships', 'Decisions'],
    emoji: '🚩',
    readTime: '4 min',
    body: `When you start dating as an adult, the stakes are higher. You are no longer just sharing a soda; you are sharing your time, your peace of mind, and sometimes your finances. 

Here are some specific "red flags" (warning signs) to look out for in the modern Kenyan dating scene:

1. **They are rude to service workers.** Pay attention to how they treat the waiter at the restaurant, the matatu conductor, or the watchman at the gate. If they are sweet to you but disrespectful to people they consider "below" them, it is only a matter of time before they treat you the same way. Character is how you treat people who cannot do anything for you.

2. **They have no friends.** If someone has cut off their family, has zero close friends, and claims "everyone is just jealous of me," run. It is highly unlikely that the entire world is toxic and they are the only good person. Usually, they are the common denominator in all those broken relationships.

3. **They pressure you for physical intimacy.** "If you loved me, you would do it." "Everyone is doing it." This is manipulation, not love. A partner who truly respects you will respect your boundaries, whether you want to wait three months or until marriage. 

4. **They borrow money early and often.** Yes, times are tough, but if you have only been dating for a month and they are already asking you for an emergency M-Pesa loan to "sort a supplier" or "pay rent," step back. You are looking for a partner, not someone to adopt.

5. **They hide you completely.** Privacy is okay; secrecy is a red flag. If after six months, you have never met a single friend of theirs, they refuse to take pictures with you, and they only want to meet indoors, you might be the "side" person.

Trust your gut. If something feels wrong, it probably is.`,
    body_sw: `Unapoanza kuchumbiana kama mtu mzima, athari huwa kubwa zaidi. Hushiriki tu soda; unashiriki wakati wako, amani yako ya akili, na wakati mwingine fedha zako.

Hizi hapa ni baadhi ya "ishara za hatari" (red flags) mahususi za kuangalia katika mazingira ya sasa ya uchumba nchini Kenya:

1. **Wana dharau kwa watoa huduma.** Zingatia jinsi wanavyomhudumia mhudumu hotelini, kondakta wa matatu, au mlinzi getini. Ikiwa ni wazuri kwako lakini hawawaheshimu watu wanaowaona "chini" yao, ni suala la muda tu kabla hawajakutendea vivyo hivyo. Tabia halisi ni jinsi unavyowatendea watu ambao hawawezi kukufanyia chochote.

2. **Hawana marafiki.** Ikiwa mtu amekata mawasiliano na familia yake, hana marafiki wa karibu hata kidogo, na anadai "kila mtu ananionea wivu tu," kimbia. Haiwezekani sana kwamba dunia nzima ni mbaya na wao pekee ndio wazuri. Kawaida, wao ndio chanzo kikuu katika mahusiano hayo yote yaliyovunjika.

3. **Wanakushinikiza kufanya ngono.** "Kama ungenipenda, ungefanya." "Kila mtu anafanya." Huu ni ujanja wa kisaikolojia, si mapenzi. Mpenzi anayekuheshimu kweli ataheshimu mipaka yako, iwe unataka kusubiri miezi mitatu au hadi ndoa.

4. **Wanakopa pesa mapema na mara kwa mara.** Ndiyo, nyakati ni ngumu, lakini ikiwa mmekuwa mkichumbiana kwa mwezi mmoja tu na tayari wanakuomba mkopo wa dharura wa M-Pesa ili "kumlipa msambazaji" au "kulipa kodi," rudi nyuma. Unatafuta mpenzi, si mtu wa kumlea.

5. **Wanakuficha kabisa.** Faragha (privacy) ni sawa; usiri (secrecy) ni ishara ya hatari. Ikiwa baada ya miezi sita, hujawahi kukutana na rafiki yao hata mmoja, wanakataa kupiga picha na wewe, na wanataka tu mpatane ndani ya nyumba, labda wewe ni mtu wa "kando".

Sikiliza hisia zako za ndani (gut feeling). Ikiwa kitu kinahisi kuwa si sawa, labda kweli si sawa.`,
    month: 2,
  },
  {
    id: 'ya-mb-1',
    title: 'The truth about betting and "quick money" in Kenya',
    title_sw: 'Ukweli kuhusu kamari (betting) na "pesa za haraka" nchini Kenya',
    category: 'money',
    tags: ['Money', 'Future', 'MentalHealth'],
    emoji: '💸',
    readTime: '3 min',
    body: `Walk into any shopping center in Kenya on a weekend, and you will see crowds of young men staring at screens, analyzing football odds. Betting has become a national crisis disguised as entertainment.

If you are thinking about trying it to make some quick cash to pay your rent or buy a phone, read this first:

1. **The house always wins.** Betting companies are not charities; they are multi-billion shilling corporations. They make those billions from the money that you and your friends lose. For every one person you see on Facebook who won KES 50,000, there are a thousand people who lost KES 500. The math is designed against you.

2. **It destroys your work ethic.** The biggest danger of betting is psychological. Once your brain gets used to the idea that you can make KES 10,000 by just clicking a button, you will start despising honest, hard work. Why work for a whole month for KES 15,000 when you could "win" it in 90 minutes? This mindset will keep you broke forever.

3. **It ruins relationships.** Gambling addiction is real. It starts with KES 50. Then you lose, and you bet KES 100 to recover the KES 50. Before you know it, you are using your school fees, borrowing from Fuliza, and lying to your parents to fund your bets. 

4. **There are no shortcuts to wealth.** The people making real money in Kenya are solving problems, selling goods, or providing services. They are not waiting for Manchester United to score a corner. 

Protect your mind and your little money. Uninstall the apps. If you want to invest, put that KES 100 into an M-Shwari lock savings account or buy data to learn a skill online.`,
    body_sw: `Tembea katika kituo chochote cha biashara nchini Kenya wikendi, na utaona makundi ya vijana wakitazama skrini, wakichanganua uwezekano wa matokeo ya mpira wa miguu (odds). Kamari (betting) imekuwa janga la kitaifa lililojificha kama burudani.

Ikiwa unafikiria kuijaribu ili upate pesa za haraka za kulipa kodi au kununua simu, soma haya kwanza:

1. **Mwenye mchezo (kampuni) hushinda kila wakati.** Kampuni za kamari si mashirika ya msaada; ni mashirika yanayomiliki mabilioni ya shilingi. Wanatengeneza mabilioni hayo kutokana na pesa ambazo wewe na marafiki zako mnapoteza. Kwa kila mtu mmoja unayemuona kwenye Facebook aliyeshinda KES 50,000, kuna watu elfu moja waliopoteza KES 500. Hesabu imeundwa dhidi yako.

2. **Inaharibu maadili yako ya kazi.** Hatari kubwa zaidi ya kamari ni ya kisaikolojia. Mara ubongo wako unapozoea wazo kwamba unaweza kutengeneza KES 10,000 kwa kubofya kitufe tu, utaanza kudharau kazi ya haki na ya bidii. Kwa nini ufanye kazi mwezi mzima kwa KES 15,000 wakati unaweza "kuishinda" kwa dakika 90? Fikra hizi zitakufanya uwe maskini milele.

3. **Inaharibu mahusiano.** Uraibu wa kamari ni wa kweli. Inaanza na KES 50. Kisha unapoteza, na unaweka KES 100 ili kurudisha zile 50. Kabla hujajua, unatumia karo yako ya shule, unakopa kutoka Fuliza, na kuwadanganya wazazi wako ili kufadhili michezo yako.

4. **Hakuna njia za mkato za utajiri.** Watu wanaotengeneza pesa halisi nchini Kenya wanatatua matatizo, wanauza bidhaa, au wanatoa huduma. Hawasubiri Manchester United ipate kona.

Linda akili yako na pesa zako kidogo. Futa (uninstall) hizo programu (apps) kwenye simu yako. Ikiwa unataka kuwekeza, weka hiyo KES 100 kwenye akaunti ya akiba ya M-Shwari lock au nunua data ili ujifunze ujuzi mtandaoni.`,
    month: 2,
  },
  {
    id: 'ya-mb-2',
    title: 'How to save your first 10,000 shillings',
    title_sw: 'Jinsi ya kuweka akiba ya shilingi 10,000 zako za kwanza',
    category: 'money',
    tags: ['Money', 'Future', 'Decisions'],
    emoji: '💰',
    readTime: '3 min',
    body: `When you are making little to no money, saving feels impossible. "How do I save when my salary cannot even cover my basic needs?" It is a valid question. But saving is not about having a lot of money; it is a habit you build when you have little, so that you know how to manage a lot.

Here is a realistic strategy to save your first KES 10,000:

1. **Pay yourself first.** If you get KES 1,000 from a hustle or a relative, immediately send KES 100 (10%) to a savings account that is hard to access (like a locked M-Shwari or KCB M-Pesa account). Do not wait to save what is left after spending, because there will never be anything left.

2. **Stop the "small small" leaks.** In Kenya, we lose a lot of money to "black tax" (giving relatives money) and convenience. Buying a KES 50 chapati every morning adds up to KES 1,500 a month. Paying KES 100 extra for a matatu because you did not want to wait 10 minutes adds up. Track every single coin you spend for one week. You will be shocked at where your money is hiding.

3. **Avoid the Fuliza trap.** Mobile loans like Fuliza, Branch, and Tala charge massive interest rates. When you use Fuliza to buy airtime, you are essentially borrowing money to consume. This creates a cycle where your next income goes entirely to paying debt. Turn off auto-fuliza.

4. **Sell what you do not need.** Have an old phone? Shoes you never wear? A textbook from last semester? Sell them on Jiji or to your neighbors. Take that money directly to your savings.

Hitting KES 10,000 gives you psychological power. It gives you confidence. It means if an emergency happens, you do not have to beg. Start with KES 50 today. Build the muscle.`,
    body_sw: `Unapokuwa hupati pesa nyingi au hupati kabisa, kuweka akiba inaonekana kuwa haiwezekani. "Nawezaje kuweka akiba wakati mshahara wangu hauwezi hata kukidhi mahitaji yangu ya msingi?" Ni swali halali. Lakini kuweka akiba si kuwa na pesa nyingi; ni tabia unayoijenga unapokuwa na kidogo, ili ujue jinsi ya kusimamia nyingi.

Huu hapa ni mkakati halisi wa kuweka akiba yako ya kwanza ya KES 10,000:

1. **Jilipe kwanza.** Ukipata KES 1,000 kutoka kwenye kibarua au jamaa, tuma KES 100 (10%) mara moja kwenye akaunti ya akiba ambayo ni ngumu kuifikia (kama M-Shwari iliyofungwa au akaunti ya KCB M-Pesa). Usisubiri kuweka akiba kile kilichobaki baada ya matumizi, kwa sababu hakutawahi kusalia chochote.

2. **Zuia uvujaji wa "kidogo kidogo".** Nchini Kenya, tunapoteza pesa nyingi kwa "ushuru wa weusi" (black tax - kuwapa jamaa pesa) na urahisi. Kununua chapati ya KES 50 kila asubuhi hujumlisha hadi KES 1,500 kwa mwezi. Kulipa KES 100 ya ziada kwa matatu kwa sababu hukutaka kusubiri dakika 10 hujumlisha. Fuatilia kila sarafu unayotumia kwa wiki moja. Utashtushwa na mahali pesa zako zinapojificha.

3. **Epuka mtego wa Fuliza.** Mikopo ya simu kama Fuliza, Branch, na Tala hutoza viwango vikubwa vya riba. Unapotumia Fuliza kununua muda wa maongezi (airtime), kimsingi unakopa pesa ili kutumia tu. Hili huunda mzunguko ambapo mapato yako yajayo yote huenda kulipa deni. Zima huduma ya auto-fuliza.

4. **Uza usichokihitaji.** Una simu ya zamani? Viatu ambavyo huvivai kamwe? Kitabu cha kiada cha muhula uliopita? Viuze kwenye Jiji au kwa majirani zako. Peleka pesa hizo moja kwa moja kwenye akiba yako.

Kufikia KES 10,000 kunakupa nguvu ya kisaikolojia. Kunakupa ujasiri. Inamaanisha ikiwa dharura itatokea, huna haja ya kuomba. Anza na KES 50 leo. Jenga tabia hiyo.`,
    month: 2,
  },
]
