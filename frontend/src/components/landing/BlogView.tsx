import React, { useEffect, useMemo, useState } from 'react';
import { Clock, UserCircle2, Search, MessageCircle } from 'lucide-react';
import { articlesStore, Article } from '../../data/articles';
import { PostModal, PostModalItem } from './PostModal';
import { NewsletterSignup } from './NewsletterSignup';
import { PageLoader } from '../layout/PageLoader';
import { LikeButton } from './LikeButton';
import { ShareButton } from './ShareButton';
import { getComments } from '../../utils/engagementStore';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

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
  const [isLoading, setIsLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

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

  const isSearching = query.trim().length > 0;
  const featured = !isSearching ? sortedArticles[0] : undefined;
  const gridArticles = featured ? filteredArticles.filter((a) => a.id !== featured.id) : filteredArticles;

  return (
    <div className="animate-fadeIn bg-white text-[#0f172a]">

      {isLoading && (
        <div className="py-24">
          <PageLoader label="Chargement des articles..." fullScreen={false} />
        </div>
      )}

      {!isLoading && sortedArticles.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-24">Aucun article pour le moment.</p>
      )}

      {!isLoading && sortedArticles.length > 0 && (
        <>
          {/* Featured article */}
          {featured && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-10 sm:pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="space-y-5 order-2 lg:order-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {formatDate(featured.date)}
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002366] leading-tight">
                    {featured.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelected(featured)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#002366] border border-slate-300 hover:border-[#002366] hover:bg-blue-50 px-5 py-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Lire l'article
                    </button>
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <LikeButton targetType="article" targetId={featured.id} />
                      <button
                        onClick={() => setSelected(featured)}
                        className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#002366] cursor-pointer transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> {commentCounts[featured.id] ?? 0}
                      </button>
                      <ShareButton targetType="article" targetId={featured.id} title={featured.title} />
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setSelected(featured)}
                  className="order-1 lg:order-2 rounded-3xl overflow-hidden cursor-pointer group aspect-[4/3] shadow-lg"
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Latest posts */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-[#002366]">
                  {isSearching ? 'Résultats de recherche' : 'Derniers articles'}
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un article..."
                    className="w-full bg-white text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {gridArticles.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">Aucun article ne correspond à "{query}".</p>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {gridArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setSelected(article)}
                      className="cursor-pointer group"
                    >
                      <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-3 bg-slate-200">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#002366] leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-1">
                        {article.excerpt}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(article);
                        }}
                        className="text-[10px] sm:text-[11px] font-bold text-[#002366] hover:underline cursor-pointer mt-1"
                      >
                        Voir plus
                      </button>
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                          <LikeButton targetType="article" targetId={article.id} />
                          <button
                            onClick={() => setSelected(article)}
                            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-400 hover:text-[#002366] cursor-pointer transition-colors"
                          >
                            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {commentCounts[article.id] ?? 0}
                          </button>
                          <ShareButton targetType="article" targetId={article.id} title={article.title} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400">
                          <Clock className="w-3 h-3" /> {formatDate(article.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Newsletter */}
      <NewsletterSignup className="border-t border-slate-100 bg-white" />

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
