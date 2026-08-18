import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Newspaper, Heart, Share2 } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { RichTextEditor } from '../RichTextEditor';
import { ImageUploadField } from '../ImageUploadField';
import { NewsItem, NewsInput, newsStore } from '../../../data/news';
import { EngagementSummary, getEngagementSummary } from '../../../utils/engagementStore';
import { PageLoader } from '../../layout/PageLoader';
import { ConfirmModal } from '../ConfirmModal';

const emptyDraft: NewsInput = {
  title: '',
  excerpt: '',
  date: new Date().toISOString().slice(0, 10),
  image: '/service_01.jpg',
  tag: ''
};

const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

export const ActualiteAdmin: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NewsInput>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<EngagementSummary>({ likes: {}, comments: {}, shares: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([newsStore.list().then(setItems), getEngagementSummary('news').then(setSummary)])
      .catch((err) => console.error('Impossible de charger les actualités :', err))
      .finally(() => setIsLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setIsOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setDraft(item);
    setIsOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    newsStore
      .remove(deleteTarget.id)
      .then(() => {
        setItems((prev) => prev.filter((n) => n.id !== deleteTarget.id));
        setDeleteTarget(null);
      })
      .catch((err) => console.error('Échec de la suppression :', err))
      .finally(() => setDeleting(false));
  };

  const handleSave = () => {
    if (!draft.title.trim() || saving) return;
    setSaving(true);
    const request = editingId === null ? newsStore.create(draft) : newsStore.update(editingId, draft);
    request
      .then((saved) => {
        setItems((prev) => (editingId === null ? [saved, ...prev] : prev.map((n) => (n.id === saved.id ? saved : n))));
        setIsOpen(false);
      })
      .catch((err) => console.error("Échec de l'enregistrement :", err))
      .finally(() => setSaving(false));
  };

  if (isLoading) return <PageLoader label="Chargement..." fullScreen={false} />;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm group flex flex-col"
          >
            <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[10px] font-bold text-[#002366] bg-white/90 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {item.tag}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col">
              <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug line-clamp-2">{item.title}</h4>
              <p
                className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 flex-1"
                dangerouslySetInnerHTML={{ __html: item.excerpt }}
              />
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-slate-400" /> {summary.likes[item.id] ?? 0}</span>
                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-slate-400" /> {summary.shares[item.id] ?? 0}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(item)}
                    className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
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
            <Newspaper className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-400">Aucune actualité pour le moment.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId === null ? 'Nouvelle actualité' : "Modifier l'actualité"}
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
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
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

        <ImageUploadField
          label="Image"
          value={draft.image}
          onChange={(v) => setDraft({ ...draft, image: v })}
        />

        <div>
          <label className={labelClass}>Extrait</label>
          <RichTextEditor
            value={draft.excerpt}
            onChange={(html) => setDraft({ ...draft, excerpt: html })}
            placeholder="Rédigez l'actualité..."
          />
        </div>
      </SlideOver>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Supprimer cette actualité ?"
        message={deleteTarget ? `« ${deleteTarget.title} » sera définitivement supprimée.` : ''}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ActualiteAdmin;
