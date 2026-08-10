import React from 'react';
import { news } from '../../data/news';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const ActualitesView: React.FC = () => {
  const mainItems = news.slice(0, 6);
  const featured = news.slice(0, 3);
  const latest = [...news].slice(3, 6).length ? news.slice(3, 6) : news.slice(0, 3);

  return (
    <div className="animate-fadeIn bg-white text-[#0f172a]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="flex items-center gap-4 mb-10">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366] whitespace-nowrap">
            Actualités du Cabinet
          </h1>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

          {/* Main grid - left */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainItems.map((item, idx) => (
              <div
                key={idx}
                className="corporate-card rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col cursor-pointer group hover:shadow-lg transition-all duration-300"
              >
                <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold text-[#002366] bg-white/90 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
                <div className="p-5 space-y-2 flex-1">
                  <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug line-clamp-2">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-justify line-clamp-3">{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - right */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-serif text-lg font-bold text-[#002366] whitespace-nowrap">À la une</h2>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="space-y-4">
                {featured.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-semibold">{formatDate(item.date)}</p>
                      <h4 className="text-xs font-bold text-[#002366] leading-snug group-hover:text-blue-800 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-serif text-lg font-bold text-[#002366] whitespace-nowrap">Dernières</h2>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="space-y-4">
                {latest.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-semibold">{formatDate(item.date)}</p>
                      <h4 className="text-xs font-bold text-[#002366] leading-snug group-hover:text-blue-800 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ActualitesView;
