import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Sparkles } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { t, type Language } from '../lib/i18n';
import {
  LIFEKIT_CATEGORIES,
  LIFEKIT_TAGS,
  LIFEKIT_ARTICLES,
  type LifeKitArticle,
} from '../data/lifekit';

// ── Article Card ─────────────────────────────────────────────

interface ArticleCardProps {
  article: LifeKitArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();
  return (
  <div
    onClick={() => navigate(`/learn/article/${article.id}`)}
    className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-navy/5 active:scale-[0.98] transition-transform duration-120 cursor-pointer">
    {/* Emoji */}
    <span className="text-2xl flex-shrink-0 leading-none">{article.emoji}</span>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <h4 className="font-nunito font-semibold text-navy text-sm leading-snug mb-1.5">
        {lang === 'Kiswahili' ? article.title_sw : article.title}
      </h4>
      <div className="flex items-center gap-1.5 flex-wrap">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="bg-pale-yellow text-navy/70 text-[11px] font-semibold px-2 py-0.5 rounded-full"
          >
            #{t('tag.' + tag, lang)}
          </span>
        ))}
        <span className="text-grey text-[11px] ml-auto flex-shrink-0">
          {article.readTime}
        </span>
      </div>
    </div>

    {/* Chevron */}
    <ChevronRight size={18} className="text-navy/30 flex-shrink-0" />
  </div>
  );
};

// ── Learn (Life Kit) Page ────────────────────────────────────

const Learn: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const lang: Language = state.user?.language ?? 'English';

  // ── Filtered articles ──────────────────────────────────────
  const filteredArticles = useMemo(() => {
    return LIFEKIT_ARTICLES.filter((article) => {
      const matchesCategory =
        activeCategory === 'all' || article.category === activeCategory;
      const matchesTag =
        activeTag === null || article.tags.includes(activeTag);
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [activeCategory, activeTag, searchQuery]);

  // ── Grouped view condition ─────────────────────────────────
  const isGroupedView =
    activeCategory === 'all' && activeTag === null && searchQuery.trim() === '';

  // Non-"all" categories for grouped sections
  const contentCategories = LIFEKIT_CATEGORIES.filter((c) => c.id !== 'all');

  // ── Handlers ───────────────────────────────────────────────
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
      {/* ── Header (Navy) ─────────────────────────────────── */}
      <header className="bg-navy text-white px-5 pt-12 pb-6">
        {/* Title */}
        <div className="mb-1">
          <h1 className="text-2xl font-poppins font-bold text-white flex items-center gap-2">
            <Sparkles size={22} className="text-yellow" />
            {t('learn.title', lang)}
          </h1>
          <p className="text-white/60 font-nunito text-sm mt-1">
            {t('learn.subtitle', lang)}
          </p>
        </div>

        {/* Search */}
        <div className="relative mt-4 mb-5">
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

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          {LIFEKIT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryTap(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-yellow text-navy'
                  : 'bg-white/10 text-white/70'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{lang === 'Kiswahili' ? cat.shortLabel_sw : cat.shortLabel}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Tag Filter Row ────────────────────────────────── */}
      <div className="bg-white border-b border-navy/10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3">
          {LIFEKIT_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagTap(tag)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                activeTag === tag
                  ? 'bg-navy text-white'
                  : 'bg-pale-yellow text-navy'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Area ──────────────────────────────────── */}
      <main className="px-5 py-5 pb-24">
        {isGroupedView ? (
          /* ── Grouped View ──────────────────────────────── */
          <div className="space-y-7">
            {contentCategories.map((cat) => {
              const catArticles = LIFEKIT_ARTICLES.filter(
                (a) => a.category === cat.id
              );
              if (catArticles.length === 0) return null;

              return (
                <section key={cat.id} className="space-y-3">
                  {/* Section heading */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-[16px] font-poppins font-bold text-navy flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      {lang === 'Kiswahili' ? cat.label_sw : cat.label}
                    </h2>
                    {catArticles.length > 2 && (
                      <button
                        onClick={() => handleCategoryTap(cat.id)}
                        className="text-[12px] font-bold text-navy/50 hover:text-navy transition-colors"
                      >
                        {t('learn.see_all_arrow', lang)}
                      </button>
                    )}
                  </div>

                  {/* Max 2 articles */}
                  <div className="space-y-3">
                    {catArticles.slice(0, 2).map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : filteredArticles.length > 0 ? (
          /* ── Flat Filtered List ─────────────────────────── */
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          /* ── Empty State ────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-4xl mb-3">🔍</span>
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
