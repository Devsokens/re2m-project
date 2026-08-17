import React, { useState } from 'react';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { RichTextEditor } from '../RichTextEditor';
import { ImageUploadField } from '../ImageUploadField';
import { Article, articles as initialArticles } from '../../../data/articles';

const emptyDraft: Article = {
  title: '',
  excerpt: '',
  content: '',
  author: 'Cabinet RE2M',
  date: new Date().toISOString().slice(0, 10),
  image: '/service_01.jpg',
  category: '',
  tags: []
};

const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

export const BlogAdmin: React.FC = () => {
  const [items, setItems] = useState<Article[]>(initialArticles);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Article>(emptyDraft);

  const openCreate = () => {
    setEditingIndex(null);
    setDraft(emptyDraft);
    setIsOpen(true);
  };

  const openEdit = (idx: number) => {
    setEditingIndex(idx);
    setDraft(items[idx]);
    setIsOpen(true);
  };

  const handleDelete = (idx: number) => {
    if (window.confirm('Supprimer cet article ?')) {
      setItems((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSave = () => {
    if (!draft.title.trim()) return;
    if (editingIndex === null) {
      setItems((prev) => [draft, ...prev]);
    } else {
      setItems((prev) => prev.map((a, i) => (i === editingIndex ? draft : a)));
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#002366]">Gestion du Blog</h2>
          <p className="text-xs text-slate-500">{items.length} article(s) publié(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((article, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm group flex flex-col"
          >
            <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[10px] font-bold text-[#002366] bg-white/90 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {article.category}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col">
              <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug line-clamp-2">{article.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold">{article.author}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(idx)}
                    className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-center gap-3 py-16 corporate-card rounded-3xl border border-dashed border-slate-300 bg-white">
            <FileText className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-400">Aucun article pour le moment.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingIndex === null ? 'Nouvel article' : "Modifier l'article"}
        subtitle="Blog du Cabinet RE2M"
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
            >
              Enregistrer
            </button>
          </>
        }
      >
        <div>
          <label className={labelClass}>Titre</label>
          <input
            className={inputClass}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Titre de l'article"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Catégorie</label>
            <input
              className={inputClass}
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="Achats & Logistique"
            />
          </div>
          <div>
            <label className={labelClass}>Auteur</label>
            <input
              className={inputClass}
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
            />
          </div>
        </div>

        <ImageUploadField
          label="Image de couverture"
          value={draft.image}
          onChange={(v) => setDraft({ ...draft, image: v })}
        />

        <div>
          <label className={labelClass}>Extrait</label>
          <textarea
            className={`${inputClass} resize-y`}
            rows={2}
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Contenu</label>
          <RichTextEditor
            value={draft.content}
            onChange={(html) => setDraft({ ...draft, content: html })}
            placeholder="Rédigez l'article..."
          />
        </div>

        <div>
          <label className={labelClass}>Tags (séparés par des virgules)</label>
          <input
            className={inputClass}
            value={draft.tags.join(', ')}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
          />
        </div>
      </SlideOver>
    </div>
  );
};

export default BlogAdmin;
