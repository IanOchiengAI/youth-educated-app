import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';
import { t, type Language } from '../lib/i18n';
import { LIFEKIT_ARTICLES } from '../data/lifekit';
import AIAvatar from '../components/AIAvatar';
import { supabase } from '../lib/supabase';

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
  const persona = state.user?.aiPersona ?? 'amara';
  const aiName = persona === 'jabari' ? 'Jabari' : 'Amara';

  const [reaction, setReaction] = useState<'helpful' | 'not_helpful' | null>(null);
  const [reactionCounts, setReactionCounts] = useState({ helpful: 0, not_helpful: 0 });

  useEffect(() => {
    if (!articleId || state.isOffline) return;
    supabase
      .from('article_reactions')
      .select('reaction, user_id')
      .eq('article_id', articleId)
      .then(({ data }) => {
        if (!data) return;
        const mine = data.find(r => r.user_id === state.user?.id);
        if (mine) setReaction(mine.reaction as 'helpful' | 'not_helpful');
        setReactionCounts({
          helpful: data.filter(r => r.reaction === 'helpful').length,
          not_helpful: data.filter(r => r.reaction === 'not_helpful').length,
        });
      });
  }, [articleId]);

  const handleReaction = async (r: 'helpful' | 'not_helpful') => {
    if (!state.user?.id || state.isOffline) return;
    const next = reaction === r ? null : r;
    const prev = reaction;
    setReaction(next);
    setReactionCounts(c => ({
      helpful: c.helpful + (next === 'helpful' ? 1 : 0) - (prev === 'helpful' ? 1 : 0),
      not_helpful: c.not_helpful + (next === 'not_helpful' ? 1 : 0) - (prev === 'not_helpful' ? 1 : 0),
    }));
    if (next) {
      await supabase.from('article_reactions').upsert({ user_id: state.user.id, article_id: articleId, reaction: next }, { onConflict: 'user_id,article_id' });
    } else {
      await supabase.from('article_reactions').delete().eq('user_id', state.user.id).eq('article_id', articleId!);
    }
  };

  const handleAskAI = () => {
    const title = lang === 'Kiswahili' ? article?.title_sw : article?.title;
    navigate('/chat', {
      state: {
        articleContext: lang === 'Kiswahili'
          ? `Nimesoma makala hii: "${title}". Unaweza kunisaidia kuelewa zaidi?`
          : `I just read this article: "${title}". Can you help me understand it better?`
      }
    });
  };

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

        {/* Reactions */}
        <div className="mt-4 bg-white rounded-[24px] border border-navy/5 p-4 flex items-center justify-between">
          <p className="text-xs font-bold text-navy/50">
            {lang === 'Kiswahili' ? 'Je, makala hii ilikuwa na manufaa?' : 'Was this article helpful?'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleReaction('helpful')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                reaction === 'helpful' ? 'bg-green-100 text-green-700' : 'bg-navy/5 text-navy/40 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <ThumbsUp size={14} /> {reactionCounts.helpful > 0 && reactionCounts.helpful}
            </button>
            <button
              onClick={() => handleReaction('not_helpful')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                reaction === 'not_helpful' ? 'bg-red-100 text-red-600' : 'bg-navy/5 text-navy/40 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <ThumbsDown size={14} /> {reactionCounts.not_helpful > 0 && reactionCounts.not_helpful}
            </button>
          </div>
        </div>

        {/* Ask AI button */}
        <button
          onClick={handleAskAI}
          className="w-full mt-4 bg-navy rounded-[32px] p-5 flex items-center gap-4 shadow-xl shadow-navy/20 active:scale-[0.98] transition-all group"
        >
          <AIAvatar persona={persona} size={44} />
          <div className="flex-1 text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
              {lang === 'Kiswahili' ? 'Una swali?' : 'Got questions?'}
            </p>
            <p className="text-white font-bold text-sm leading-snug">
              {lang === 'Kiswahili' ? `Uliza ${aiName} kuhusu makala hii` : `Ask ${aiName} about this article`}
            </p>
          </div>
          <MessageCircle size={20} className="text-yellow flex-shrink-0" />
        </button>
      </motion.main>
    </div>
  );
};

export default ArticleDetail;
