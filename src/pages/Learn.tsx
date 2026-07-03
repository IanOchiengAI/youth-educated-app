import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Download,
  GraduationCap,
  Heart,
  Lock,
  Search,
  Shield,
  Sparkles,
  Star,
  WifiOff,
  Rocket,
  Coins,
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { type Module } from '../data/modules';
import {
  LIFEKIT_CATEGORIES,
  LIFEKIT_TAGS,
  type LifeKitArticle,
} from '../data/lifekit';
import { useLifeKitArticles, useModules } from '../hooks/useContent';
import { t, type Language } from '../lib/i18n';

const CATEGORY_STYLE: Record<string, { bg: string; text: string; Icon: React.ElementType }> = {
  'mentor-stories': { bg: 'bg-yellow/20', text: 'text-yellow-700', Icon: GraduationCap },
  school: { bg: 'bg-blue-50', text: 'text-blue-700', Icon: BookOpen },
  'mental-health': { bg: 'bg-teal-50', text: 'text-teal-700', Icon: Brain },
  relationships: { bg: 'bg-pink-50', text: 'text-pink-700', Icon: Heart },
  safety: { bg: 'bg-green-50', text: 'text-green-700', Icon: Shield },
  future: { bg: 'bg-indigo-50', text: 'text-indigo-700', Icon: Rocket },
  money: { bg: 'bg-emerald-50', text: 'text-emerald-700', Icon: Coins },
};

const DEFAULT_STYLE = { bg: 'bg-navy/5', text: 'text-navy/60', Icon: BookOpen };

type LearnTab = 'courses' | 'lifekit';

interface ArticleCardProps {
  article: LifeKitArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const lang: Language = state.user?.language ?? 'English';
  const { bg, text, Icon } = CATEGORY_STYLE[article.category] ?? DEFAULT_STYLE;

  return (
    <button
      type="button"
      onClick={() => navigate(`/learn/article/${article.id}`)}
      className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-navy/5 active:scale-[0.98] transition-transform duration-120 text-left"
    >
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={text} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-nunito font-semibold text-navy text-sm leading-snug mb-1.5">
          {lang === 'Kiswahili' ? article.title_sw : article.title}
        </h4>
        <div className="flex items-center gap-1.5 flex-wrap">
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-navy/5 text-navy/50 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            >
              {t('tag.' + tag, lang)}
            </span>
          ))}
          <span className="text-grey text-[11px] ml-auto flex-shrink-0">
            {article.readTime}
          </span>
        </div>
      </div>

      <ChevronRight size={18} className="text-navy/30 flex-shrink-0" />
    </button>
  );
};

interface CourseCardProps {
  module: Module;
  lang: Language;
}

const CourseCard: React.FC<CourseCardProps> = ({ module, lang }) => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const userMinAge = parseInt(state.user?.ageBracket?.split('-')[0] || '10', 10);
  const isAgeLocked = module.min_age > userMinAge;
  const isPremiumLocked = Boolean(module.isPremium && !state.user?.isPremium);
  const progress = state.modules.moduleProgress[module.id];
  const isCompleted = state.modules.completed.includes(module.id);
  const lessonTotal = Math.max(module.content.length || module.lessons || 1, 1);
  const completedLessons = isCompleted
    ? lessonTotal
    : Math.max(progress?.completedLessons.length ?? 0, (progress?.currentLesson ?? 1) - 1);
  const progressPercent = Math.min(100, Math.round((completedLessons / lessonTotal) * 100));
  const showProgress = Boolean(progress || isCompleted);

  const handleOpen = () => {
    if (isAgeLocked) return;
    navigate(`/learn/${module.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      disabled={isAgeLocked}
      aria-disabled={isAgeLocked}
      className={`w-full bg-white border border-navy/5 rounded-2xl p-4 text-left shadow-sm transition-all ${
        isAgeLocked
          ? 'opacity-75 cursor-not-allowed'
          : 'active:scale-[0.98] hover:border-navy/10'
      }`}
    >
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
          module.isPremium ? 'bg-yellow/20' : 'bg-navy/5'
        }`}>
          {module.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-poppins font-bold text-navy text-[15px] leading-tight">
                {module.title}
              </h3>
              <p className="text-grey text-xs font-nunito leading-relaxed mt-1">
                {module.description}
              </p>
            </div>
            {!isAgeLocked && <ChevronRight size={18} className="text-navy/30 flex-shrink-0 mt-1" />}
            {isAgeLocked && <Lock size={17} className="text-navy/30 flex-shrink-0 mt-1" />}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-navy/60">
              <BookOpen size={12} />
              {module.lessons} {t(module.lessons === 1 ? 'learn.lesson' : 'learn.lessons', lang)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-navy/60">
              <Clock size={12} />
              {module.duration}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              module.isPremium ? 'bg-yellow/20 text-yellow-700' : 'bg-green-50 text-green-700'
            }`}>
              {module.isPremium ? <Star size={12} /> : <Shield size={12} />}
              {module.isPremium ? t('premium.badge', lang) : t('learn.free_badge', lang)}
            </span>
            {isAgeLocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-600">
                <Lock size={12} />
                {t('learn.age_locked_badge', lang)}
              </span>
            )}
            {isPremiumLocked && !isAgeLocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-navy/60">
                <Lock size={12} />
                {t('premium.locked', lang)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
              <Download size={12} />
              {t('learn.offline_badge', lang)}
            </span>
          </div>

          {isAgeLocked && (
            <p className="mt-3 text-[11px] font-nunito text-navy/50">
              {t('learn.age_locked_message', lang).replace('{age}', String(module.min_age))}
            </p>
          )}

          {showProgress && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-navy/35">
                  {t('learn.progress', lang)}
                </span>
                <span className="text-[10px] font-black text-navy/45">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-navy/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

const Learn: React.FC = () => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState<LearnTab>('courses');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const lang: Language = state.user?.language ?? 'English';
  const { data: modules, loading: modulesLoading } = useModules();
  const { data: articles, loading: articlesLoading } = useLifeKitArticles();

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === 'all' || article.category === activeCategory;
      const matchesTag =
        activeTag === null || article.tags.includes(activeTag);
      const title = lang === 'Kiswahili' ? article.title_sw : article.title;
      const matchesSearch =
        normalizedSearch === '' ||
        title.toLowerCase().includes(normalizedSearch) ||
        article.title.toLowerCase().includes(normalizedSearch) ||
        article.title_sw.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [activeCategory, activeTag, articles, lang, searchQuery]);

  const isGroupedView =
    activeCategory === 'all' && activeTag === null && searchQuery.trim() === '';
  const contentCategories = LIFEKIT_CATEGORIES.filter((c) => c.id !== 'all');

  const handleCategoryTap = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveTag(null);
    setSearchQuery('');
  };

  const handleTagTap = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setActiveCategory('all');
    setActiveTag(null);
  };

  return (
    <div className="min-h-screen bg-off-white pb-24">
      <header className="bg-navy text-white px-5 pt-12 pb-5">
        <div className="mb-4">
          <h1 className="text-2xl font-poppins font-bold text-white flex items-center gap-2">
            <Sparkles size={22} className="text-yellow" />
            {t('learn.title', lang)}
          </h1>
          <p className="text-white/60 font-nunito text-sm mt-1">
            {t(activeTab === 'courses' ? 'learn.courses_subtitle' : 'learn.lifekit_subtitle', lang)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-white/10 border border-white/10 rounded-2xl p-1 mb-4">
          {(['courses', 'lifekit'] as LearnTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`h-10 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === tab ? 'bg-yellow text-navy' : 'text-white/70'
              }`}
            >
              {t(tab === 'courses' ? 'learn.tab_courses' : 'learn.tab_lifekit', lang)}
            </button>
          ))}
        </div>

        {activeTab === 'lifekit' && (
          <>
            <div className="relative mb-5">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
              <input
                type="text"
                placeholder={t('learn.search_placeholder', lang)}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 focus:border-yellow transition-all outline-none text-sm font-nunito"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              {LIFEKIT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryTap(cat.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-yellow text-navy'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {lang === 'Kiswahili' ? cat.shortLabel_sw : cat.shortLabel}
                </button>
              ))}
            </div>
          </>
        )}
      </header>

      {activeTab === 'lifekit' && (
        <div className="bg-white border-b border-navy/10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3">
            {LIFEKIT_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagTap(tag)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                  activeTag === tag
                    ? 'bg-navy text-white'
                    : 'bg-pale-yellow text-navy'
                }`}
              >
                #{t('tag.' + tag, lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="px-5 py-5 pb-24">
        {activeTab === 'courses' ? (
          <div className="space-y-3">
            {modulesLoading && modules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-yellow border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-grey text-sm font-nunito text-center">
                  {t('learn.loading_courses', lang)}
                </p>
              </div>
            ) : modules.length > 0 ? (
              <>
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h2 className="text-[16px] font-poppins font-bold text-navy">
                      {t('learn.course_library', lang)}
                    </h2>
                    <p className="text-xs text-grey font-nunito mt-0.5">
                      {t('learn.course_library_hint', lang)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
                    <WifiOff size={12} />
                    {t('learn.offline_short', lang)}
                  </span>
                </div>
                {modules.map((module) => (
                  <CourseCard key={module.id} module={module} lang={lang} />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <BookOpen size={34} className="text-navy/20 mb-3" />
                <p className="text-grey text-sm font-nunito text-center">
                  {t('learn.no_courses', lang)}
                </p>
              </div>
            )}
          </div>
        ) : isGroupedView ? (
          <div className="space-y-7">
            {contentCategories.map((cat) => {
              const catArticles = articles.filter((a) => a.category === cat.id);
              if (catArticles.length === 0) return null;

              return (
                <section key={cat.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[16px] font-poppins font-bold text-navy">
                      {lang === 'Kiswahili' ? cat.label_sw : cat.label}
                    </h2>
                    {catArticles.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleCategoryTap(cat.id)}
                        className="text-[12px] font-bold text-navy/50 hover:text-navy transition-colors"
                      >
                        {t('learn.see_all_arrow', lang)}
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {catArticles.slice(0, 2).map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              );
            })}
            {articlesLoading && articles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-yellow border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-grey text-sm font-nunito text-center">
                  {t('learn.loading_articles', lang)}
                </p>
              </div>
            )}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Search size={34} className="text-navy/20 mb-3" />
            <p className="text-grey text-sm font-nunito text-center">
              {t('learn.no_articles', lang)}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Learn;
