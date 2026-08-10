import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { NewsItem, news as initialNews } from '../../../data/news';

const emptyDraft: NewsItem = {
  title: '',
  excerpt: '',
  date: new Date().toISOString().slice(0, 10),
  image: '/service_01.jpg',
  tag: ''
};

const inputClass = 'w-full bg-slate-50 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

export const ActualiteAdmin: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>(initialNews);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<NewsItem>(emptyDraft);

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
    if (window.confirm('Supprimer cette actualité ?')) {
      setItems((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSave = () => {
    if (!draft.title.trim()) return;
    if (editingIndex === null) {
      setItems((prev) => [draft, ...prev]);
    } else {
      setItems((prev) => prev.map((n, i) => (i === editingIndex ? draft : n)));
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#002366]">Gestion des Actualités</h2>
          <p className="text-xs text-slate-500">{items.length} actualité(s) publiée(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nouvelle actualité
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col sm:flex-row"
          >
            <div className="sm:w-56 aspect-[37/25] sm:aspect-auto overflow-hidden bg-slate-100 relative shrink-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                <span className="text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">{item.tag}</span>
                <span className="text-slate-400">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{item.excerpt}</p>
            </div>
            <div className="flex sm:flex-col items-center justify-end gap-1.5 p-4 shrink-0">
              <button
                onClick={() => openEdit(idx)}
                className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors"
                title="Modifier"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(idx)}
                className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-16 corporate-card rounded-3xl border border-dashed border-slate-300 bg-white">
            <Newspaper className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-400">Aucune actualité pour le moment.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingIndex === null ? 'Nouvelle actualité' : "Modifier l'actualité"}
        subtitle="Actualités du Cabinet RE2M"
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
            placeholder="Titre de l'actualité"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Tag</label>
            <input
              className={inputClass}
              value={draft.tag}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              placeholder="Partenariat"
            />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              className={inputClass}
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Image (URL)</label>
          <input
            className={inputClass}
            value={draft.image}
            onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            placeholder="/service_01.jpg"
          />
        </div>

        <div>
          <label className={labelClass}>Extrait</label>
          <textarea
            className={`${inputClass} resize-y`}
            rows={5}
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          />
        </div>
      </SlideOver>
    </div>
  );
};

export default ActualiteAdmin;
