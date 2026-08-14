import React, { useState } from 'react';
import { articles } from '../../data/articles';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const BlogView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState(articles[0]);

  const suggested = articles.filter((a) => a !== selected);

  return (
    <div className="animate-fadeIn bg-white text-[#0f172a]">

      {/* Article - reading area + suggestions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-xl font-bold text-[#002366] mb-8">Articles récents</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

          {/* Reading area - left, widened */}
          <article className="max-w-none">
            <div className="w-full aspect-[16/8] overflow-hidden rounded-2xl bg-slate-100 mb-6">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-2">
              {selected.author} • {formatDate(selected.date)}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366] leading-tight mb-4">
              {selected.title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-[#002366] border border-slate-200 rounded-full px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <div
              className="space-y-4 text-sm text-slate-600 leading-relaxed text-justify [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: selected.content }}
            />
          </article>

          {/* Suggested articles - right */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-serif text-sm font-bold text-[#002366] uppercase tracking-wider whitespace-nowrap">Suggestions</h3>
              <span className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="space-y-4">
              {suggested.map((article, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelected(article);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-3 cursor-pointer group text-left w-full"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-semibold">{formatDate(article.date)}</p>
                    <h4 className="text-xs font-bold text-[#002366] leading-snug group-hover:text-blue-800 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center border-t border-slate-100 bg-slate-50">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366]">Blog du Cabinet RE2M</h2>
            <p className="text-slate-500 text-sm">
              Abonnez-vous pour recevoir nos analyses sur les Achats, la Logistique et la performance des organisations.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              className="w-full text-xs rounded-xl px-4 py-3 border border-slate-200 focus:border-[#002366] focus:outline-none bg-white"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogView;
