import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, UserCircle2, Search } from 'lucide-react';
import { articlesStore, Article } from '../../data/articles';
import { LikeButton } from './LikeButton';
import { ShareButton } from './ShareButton';
import { PostModal, PostModalItem } from './PostModal';
import { getComments } from '../../utils/engagementStore';
import { NewsletterSignup } from './NewsletterSignup';
import { PageLoader } from '../layout/PageLoader';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const toPostModalItem = (article: Article): PostModalItem => ({
  id: article.id,
  targetType: 'article',
  author: article.author,
  authorIcon: UserCircle2,
  date: article.date,
  text: article.content,
  image: article.image
});

export const BlogView: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    articlesStore
      .list()
      .then(setArticles)
      .catch((err) => console.error('Impossible de charger les articles :', err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (articles.length === 0) return;
    Promise.all(
      articles.map((a) => getComments('article', a.id).then((comments) => [a.id, comments.length] as const))
    )
      .then((entries) => setCommentCounts(Object.fromEntries(entries)))
      .catch((err) => console.error('Impossible de charger les commentaires :', err));
  }, [articles]);

  const sortedArticles = useMemo(
    () => [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [articles]
  );

  const [selected, setSelected] = useState<Article | null>(null);
  const [query, setQuery] = useState('');

  const handleSelectOther = (other: PostModalItem) => {
    const match = articles.find((a) => a.id === other.id);
    if (match) setSelected(match);
  };

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedArticles;
    return sortedArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [sortedArticles, query]);

  return (
    <div className="animate-fadeIn bg-white text-[#0f172a]">

      {/* Articles grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366] whitespace-nowrap">
            Blog du Cabinet RE2M
          </h1>
          <span className="h-px flex-1 bg-slate-200 hidden sm:block" />
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {isLoading && <PageLoader label="Chargement des articles..." fullScreen={false} />}

        {!isLoading && filteredArticles.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-16">
            {articles.length === 0 ? 'Aucun article pour le moment.' : `Aucun article ne correspond à "${query}".`}
          </p>
        )}

        {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredArticles.map((article) => {
            const commentCount = commentCounts[article.id] ?? 0;
            return (
              <div
                key={article.id}
                onClick={() => setSelected(article)}
                className="corporate-card rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col group hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-bold text-[#002366] bg-white/90 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
                <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">{article.author}</p>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-[#002366] leading-snug">{article.title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed text-justify line-clamp-2">
                    {article.excerpt}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(article);
                    }}
                    className="text-[10px] sm:text-[11px] font-bold text-[#002366] hover:underline cursor-pointer text-left w-fit"
                  >
                    Voir plus
                  </button>
                  <div className="flex items-center justify-between pt-2 sm:pt-3 mt-auto border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <LikeButton targetType="article" targetId={article.id} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(article);
                        }}
                        className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-400 hover:text-[#002366] cursor-pointer transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {commentCount}
                      </button>
                      <ShareButton targetType="article" targetId={article.id} title={article.title} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">{formatDate(article.date)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* Newsletter */}
      <NewsletterSignup className="border-t border-slate-100 bg-slate-50" />

      <PostModal
        item={selected ? toPostModalItem(selected) : null}
        otherItems={selected ? sortedArticles.filter((a) => a !== selected).map(toPostModalItem) : []}
        mode="blog"
        onClose={() => setSelected(null)}
        onSelectItem={handleSelectOther}
        onCommentPosted={() => {
          if (!selected) return;
          setCommentCounts((counts) => ({ ...counts, [selected.id]: (counts[selected.id] ?? 0) + 1 }));
        }}
      />
    </div>
  );
};

export default BlogView;
