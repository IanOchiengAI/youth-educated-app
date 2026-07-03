import { FREE_MODULES } from '../data/freeModules';
import { LIFEKIT_ARTICLES } from '../data/lifekit';
import { OPPORTUNITIES } from '../data/opportunities';

export type KnowledgeSourceType =
  | 'module_description'
  | 'lesson_section'
  | 'lifekit_article'
  | 'career_guidance'
  | 'opportunity'
  | 'safeguarding_resource';

export interface KnowledgeChunk {
  id: string;                  // e.g. "module:confidence:lesson:2:section:1"
  sourceType: KnowledgeSourceType;
  title: string;               // human-readable label for the response
  text: string;                // the actual indexable + returnable text
  referenceLabel?: string;     // e.g. "See 'Confidence Foundations' in the Learn tab"
}

export interface KnowledgeIndex {
  chunks: KnowledgeChunk[];
  invertedIndex: Record<string, number[]>; // token → indices of chunks that contain it
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2); // skip very short tokens
}

export function buildKnowledgeIndex(): KnowledgeIndex {
  const chunks: KnowledgeChunk[] = [];

  // 1. Free modules
  FREE_MODULES.forEach(module => {
    chunks.push({
      id: `module:${module.id}:description`,
      sourceType: 'module_description',
      title: module.title,
      text: `${module.title} ${module.description}`,
      referenceLabel: `See "${module.title}" in the Learn tab`
    });

    if (Array.isArray(module.content)) {
      module.content.forEach(lesson => {
        chunks.push({
          id: `module:${module.id}:lesson:${lesson.id}:title`,
          sourceType: 'lesson_section',
          title: lesson.title,
          text: lesson.title,
          referenceLabel: `See "${module.title}" -> "${lesson.title}" in the Learn tab`
        });

        if (Array.isArray(lesson.sections)) {
          lesson.sections.forEach((section, secIdx) => {
            if (section.type === 'text' || section.type === 'pullquote') {
              if (section.content) {
                chunks.push({
                  id: `module:${module.id}:lesson:${lesson.id}:section:${secIdx}`,
                  sourceType: 'lesson_section',
                  title: `${lesson.title} - Section ${secIdx + 1}`,
                  text: section.content,
                  referenceLabel: `See "${module.title}" -> "${lesson.title}" in the Learn tab`
                });
              }
            }
          });
        }
      });
    }
  });

  // 2. Life Kit Articles
  LIFEKIT_ARTICLES.forEach(article => {
    chunks.push({
      id: `lifekit:${article.id}`,
      sourceType: 'lifekit_article',
      title: article.title,
      text: `${article.title} ${article.body.substring(0, 2000)}`,
      referenceLabel: `See "${article.title}" in Life Kit`
    });
  });

  // 3. Career guidance
  const careerGuidance = [
    {
      id: 'career:kcse_pathways',
      title: 'KCSE Pathways',
      text: 'KCSE stands for Kenya Certificate of Secondary Education. After KCSE, your grade determines your next step: university (C+ and above), TVET diplomas (C- and C), TVET certificates (D+ and D), or artisan courses (D- and E). Choose your pathway early by understanding which subjects align with your interests and strengths.',
      referenceLabel: 'Explore the Career Mapper tab'
    },
    {
      id: 'career:tvet',
      title: 'TVET and Polytechnics in Kenya',
      text: 'TVET (Technical and Vocational Education and Training) institutions and village polytechnics offer practical skills like plumbing, electrical work, ICT, welding, fashion design, and beauty therapy. They are affordable, take 1-2 years, and are highly valued by employers. Kuccps coordinates placements.',
      referenceLabel: 'Explore the Career Mapper tab'
    },
    {
      id: 'career:university',
      title: 'University in Kenya',
      text: 'To join a public or private university in Kenya for a degree course, you generally need a minimum grade of C+ in KCSE. Applications are done online via KUCCPS (Kenya Universities and Colleges Central Placement Service). HELB (Higher Education Loans Board) provides loans and bursaries to support students.',
      referenceLabel: 'Explore the Career Mapper & Opportunities tab'
    },
    {
      id: 'career:self_employment',
      title: 'Self-employment and Hustling in Kenya',
      text: 'Self-employment and entrepreneurship are common career paths for Kenyan youth. Start small (micro-businesses, digital freelancing, agriculture, or retail), save via mobile money (M-Shwari, KCB M-Pesa), learn basic bookkeeping (calculating costs, profits, and cashflow), and build customer trust.',
      referenceLabel: 'See Money and Future articles in Life Kit'
    }
  ];
  careerGuidance.forEach(cg => {
    chunks.push({
      id: cg.id,
      sourceType: 'career_guidance',
      title: cg.title,
      text: cg.text,
      referenceLabel: cg.referenceLabel
    });
  });

  // 4. Opportunities
  OPPORTUNITIES.forEach(opp => {
    chunks.push({
      id: `opportunity:${opp.id}`,
      sourceType: 'opportunity',
      title: opp.title,
      text: `${opp.title} ${opp.description} ${opp.provider}`,
      referenceLabel: `See "${opp.title}" in the Opportunities tab`
    });
  });

  // 5. Safeguarding resources
  const safeguardingResources = [
    {
      id: 'safeguarding:childline_116',
      title: 'Childline Kenya 116',
      text: 'Childline Kenya runs a free, 24/7 national helpline (call 116) for reporting cases of child abuse, neglect, exploitation, or violence, and to get counseling and referral services. Your identity is kept confidential.',
      referenceLabel: 'Safeguarding Helpline'
    },
    {
      id: 'safeguarding:mental_health',
      title: 'Mental Health Signposting',
      text: 'If you are experiencing severe stress, depression, or thoughts of self-harm, please reach out to trusted adults, mentors, or professional hotlines: call 116 (Childline) or call Befrienders Kenya at 0722 178 177 for confidential support.',
      referenceLabel: 'Confidential Helpline Support'
    }
  ];
  safeguardingResources.forEach(sr => {
    chunks.push({
      id: sr.id,
      sourceType: 'safeguarding_resource',
      title: sr.title,
      text: sr.text,
      referenceLabel: sr.referenceLabel
    });
  });

  const invertedIndex: Record<string, number[]> = {};
  chunks.forEach((chunk, idx) => {
    const tokens = tokenize(chunk.text);
    const uniqueTokens = Array.from(new Set(tokens));
    uniqueTokens.forEach(token => {
      if (!invertedIndex[token]) invertedIndex[token] = [];
      invertedIndex[token].push(idx);
    });
  });

  return { chunks, invertedIndex };
}

export interface SearchOptions {
  maxResults?: number;
  minScore?: number;
}

export function searchKnowledge(
  query: string,
  index: KnowledgeIndex,
  options: SearchOptions = {}
): KnowledgeChunk[] {
  const maxResults = options.maxResults ?? 3;
  const minScore = options.minScore ?? 1;

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scores: Record<number, number> = {};
  queryTokens.forEach(token => {
    const matchingIndices = index.invertedIndex[token];
    if (matchingIndices) {
      matchingIndices.forEach(idx => {
        scores[idx] = (scores[idx] || 0) + 1; // simple term frequency match
      });
    }
  });

  const scoredChunks = Object.keys(scores)
    .map(key => {
      const idx = parseInt(key, 10);
      return {
        chunk: index.chunks[idx],
        score: scores[idx]
      };
    })
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score);

  return scoredChunks.slice(0, maxResults).map(item => item.chunk);
}

export function formatKnowledgeForPrompt(results: KnowledgeChunk[]): string {
  if (results.length === 0) return '';

  let context = '[CONTEXT FROM YOUTH EDUCATED CONTENT]\n';
  results.forEach((result, idx) => {
    const excerpt = result.text.length > 150 ? result.text.substring(0, 150) + '...' : result.text;
    context += `${idx + 1}. ${result.title}: ${excerpt}\n`;
    if (result.referenceLabel) {
      context += `   → ${result.referenceLabel}\n`;
    }
  });
  context += '[END CONTEXT]';

  return context;
}
