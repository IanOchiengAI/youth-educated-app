import { LIFEKIT_ARTICLES } from './src/data/lifekit';

LIFEKIT_ARTICLES.forEach(article => {
    if (!article.title_sw) console.log(`Missing title_sw for article ${article.id}`);
    if (!article.body_sw) console.log(`Missing body_sw for article ${article.id}`);
});
