import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Search } from 'lucide-react';
import { newsStore, NewsItem } from '../../data/news';
import { LikeButton } from './LikeButton';
import { PostModal, PostModalItem } from './PostModal';
import { stripHtml } from '../../utils/text';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const VOIR_PLUS_THRESHOLD = 140;

const toPostModalItem = (item: NewsItem): PostModalItem => ({
  id: item.id,
  targetType: 'news',
  author: 'Cabinet RE2M',
  authorIcon: Building2,
  date: item.date,
  text: item.excerpt,
  image: item.image,
  tag: item.tag
});

export const ActualitesView: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    newsStore.list().then(setNews).catch((err) => console.error('Impossible de charger les actualités :', err));
  }, []);

  const sortedNews = useMemo(
    () => [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [news]
  );

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [query, setQuery] = useState('');

  const openModalFor = (item: NewsItem) => setSelectedNews(item);

  const handleSelectOther = (other: PostModalItem) => {
    const match = news.find((n) => n.id === other.id);
    if (match) setSelectedNews(match);
  };

  const filteredNews = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedNews;
    return sortedNews.filter(
      (item) => item.title.toLowerCase().includes(q) || stripHtml(item.excerpt).toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)
    );
  }, [sortedNews, query]);

  return (
    <div className="animate-fadeIn bg-white text-[#0f172a]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366] whitespace-nowrap">
            Actualités du Cabinet
          </h1>
          <span className="h-px flex-1 bg-slate-200 hidden sm:block" />
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une actualité..."
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {filteredNews.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-16">
            {news.length === 0 ? 'Aucune actualité pour le moment.' : `Aucune actualité ne correspond à "${query}".`}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredNews.map((item) => {
            const isLong = stripHtml(item.excerpt).length > VOIR_PLUS_THRESHOLD;
            return (
              <div
                key={item.id}
                className={`corporate-card rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col group hover:shadow-lg transition-all duration-300 ${
                  isLong ? 'cursor-pointer' : ''
                }`}
                onClick={() => isLong && openModalFor(item)}
              >
                <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-bold text-[#002366] bg-white/90 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
                <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-[#002366] leading-snug">{item.title}</h4>
                  <p
                    className={`text-[10px] sm:text-[11px] text-slate-500 leading-relaxed text-justify ${isLong ? 'line-clamp-2' : ''}`}
                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                  />
                  {isLong && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModalFor(item);
                      }}
                      className="text-[10px] sm:text-[11px] font-bold text-[#002366] hover:underline cursor-pointer text-left w-fit"
                    >
                      Voir plus
                    </button>
                  )}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 mt-auto border-t border-slate-100">
                    <LikeButton targetType="news" targetId={item.id} />
                    <span className="text-[9px] sm:text-[10px] text-slate-400">{formatDate(item.date)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      <PostModal
        item={selectedNews ? toPostModalItem(selectedNews) : null}
        otherItems={selectedNews ? sortedNews.filter((n) => n !== selectedNews).map(toPostModalItem) : []}
        mode="actualite"
        onClose={() => setSelectedNews(null)}
        onSelectItem={handleSelectOther}
      />
    </div>
  );
};

export default ActualitesView;
