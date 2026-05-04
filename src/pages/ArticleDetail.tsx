import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';
import { t, type Language } from '../lib/i18n';
import { LIFEKIT_ARTICLES } from '../data/lifekit';

/** Convert markdown-style **bold** to <strong> and split paragraphs on double newlines */
const renderBody = (body: string) => {
  const paragraphs = body.split(/\n\n+/);
  return paragraphs.map((p, i) => {
    // Replace **text** with <strong>text</strong>
    const parts = p.split(/\*\*(.+?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="font-bold text-navy">{part}</strong> : part,
    );
    return (
      <p key={i} className="font-nunito text-[15px] leading-relaxed text-navy/85 mb-4 whitespace-pre-line">
        {rendered}
      </p>
    );
  });
};

const ArticleDetail: React.FC = () => {
  const { state } = useAppContext();
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const lang: Language = state.user?.language ?? 'English';

  const article = LIFEKIT_ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-6">
        <span className="text-5xl mb-4">😕</span>
        <h2 className="font-poppins font-bold text-navy text-xl mb-2">{t('learn.article_not_found', lang)}</h2>
        <p className="font-nunito text-grey text-sm mb-6">
          We could not find the article you are looking for.
        </p>
        <button
          onClick={() => navigate('/learn')}
          className="bg-navy text-white font-nunito font-bold px-6 py-3 rounded-full text-sm"
        >
          {t('learn.article_detail_back', lang)}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white pb-28">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-off-white/80 backdrop-blur-md border-b border-navy/5 px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/learn')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 active:scale-95 transition-transform"
          aria-label="Back to Life Kit"
        >
          <ArrowLeft size={20} className="text-navy" />
        </button>
        <span className="font-poppins font-bold text-navy text-sm truncate flex-1">
          {t('learn.title', lang)}
        </span>
      </header>

      {/* ── Article Content ─────────────────────────────────── */}
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="px-5 pt-6"
      >
        {/* Hero card */}
        <div className="bg-white rounded-[32px] shadow-sm border border-navy/5 p-6 mb-6">
          {/* Emoji */}
          <div className="text-5xl mb-4 text-center">{article.emoji}</div>

          {/* Title */}
          <h1 className="font-poppins font-bold text-navy text-xl leading-snug text-center mb-4">
            {lang === 'Kiswahili' ? article.title_sw : article.title}
          </h1>

          {/* Tags + Read time */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-pale-yellow text-navy/70 text-[11px] font-semibold px-2.5 py-1 rounded-full"
              >
                #{t('tag.' + tag, lang)}
              </span>
            ))}
            <span className="flex items-center gap-1 text-grey text-[11px] ml-1">
              <Clock size={12} /> {article.readTime}
            </span>
          </div>
        </div>

        {/* Body card */}
        <div className="bg-white rounded-[32px] shadow-sm border border-navy/5 p-6">
          {(lang === 'Kiswahili' ? article.body_sw : article.body) ? renderBody(lang === 'Kiswahili' ? article.body_sw : article.body) : (
            <p className="font-nunito text-grey text-sm text-center py-8">
              {t('learn.content_coming_soon', lang)}
            </p>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default ArticleDetail;
