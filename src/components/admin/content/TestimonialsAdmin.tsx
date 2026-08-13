import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Link2, Copy, Check, MessageSquareQuote, Inbox } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { cmsStorage } from '../../../utils/cmsStorage';
import { testimonialsStore, PendingTestimonial } from '../../../utils/testimonialsStore';

interface Testimonial {
  company: string;
  service: string;
  text: string;
  logo: string;
}

const emptyDraft: Testimonial = { company: '', service: '', text: '', logo: '' };
const inputClass = 'w-full bg-slate-50 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

export const TestimonialsAdmin: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [pending, setPending] = useState<PendingTestimonial[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Testimonial>(emptyDraft);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const loadItems = () => {
    const blocks = cmsStorage.getDraftLayout('accueil');
    const block = blocks.find((b) => b.type === 'Testimonials');
    setItems(block?.settings.items || []);
  };

  useEffect(() => {
    loadItems();
    setPending(testimonialsStore.getPending());
  }, []);

  const persist = (updated: Testimonial[]) => {
    const blocks = cmsStorage.getDraftLayout('accueil');
    const next = blocks.map((b) => (b.type === 'Testimonials' ? { ...b, settings: { ...b.settings, items: updated } } : b));
    cmsStorage.saveDraftLayout('accueil', next);
    cmsStorage.publishLayout('accueil');
    setItems(updated);
  };

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
    if (window.confirm('Supprimer ce témoignage ?')) {
      persist(items.filter((_, i) => i !== idx));
    }
  };

  const handleSave = () => {
    if (!draft.company.trim() || !draft.text.trim()) return;
    if (editingIndex === null) {
      persist([draft, ...items]);
    } else {
      persist(items.map((t, i) => (i === editingIndex ? draft : t)));
    }
    setIsOpen(false);
  };

  const handleGenerateLink = () => {
    const token = testimonialsStore.createShareToken();
    const url = `${window.location.origin}${window.location.pathname}?testimonial=${token}`;
    setShareLink(url);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = (entry: PendingTestimonial) => {
    persist([{ company: entry.company, service: entry.service, text: entry.text, logo: entry.logo }, ...items]);
    testimonialsStore.removePending(entry.id);
    setPending(testimonialsStore.getPending());
  };

  const handleReject = (entry: PendingTestimonial) => {
    testimonialsStore.removePending(entry.id);
    setPending(testimonialsStore.getPending());
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#0f172a]">

      {/* Share link generator */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-[#002366]">Partager un formulaire à un client</h3>
            <p className="text-[11px] text-slate-500">Générez un lien privé à envoyer par email pour recueillir un témoignage.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleGenerateLink}
            className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
          >
            Générer un lien
          </button>
          {shareLink && (
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <span className="flex-1 text-[11px] text-slate-600 truncate">{shareLink}</span>
              <button onClick={handleCopy} className="text-[#002366] hover:text-blue-900 cursor-pointer shrink-0" title="Copier">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pending submissions */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#002366] flex items-center gap-2">
            <Inbox className="w-4 h-4" /> En attente de validation ({pending.length})
          </h3>
          {pending.map((entry) => (
            <div key={entry.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#002366]">{entry.company} — <span className="font-normal text-slate-500">{entry.service}</span></p>
                <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-2">"{entry.text}"</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(entry)}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleReject(entry)}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Published testimonials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#002366]">Témoignages publiés</h2>
            <p className="text-xs text-slate-500">{items.length} témoignage(s) affiché(s) sur le site</p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nouveau témoignage
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((testi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4">"{testi.text}"</p>
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#002366] truncate">{testi.company}</p>
                  <p className="text-[10px] text-slate-400 truncate">{testi.service}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
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
          ))}

          {items.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-center gap-3 py-16 corporate-card rounded-3xl border border-dashed border-slate-300 bg-white">
              <MessageSquareQuote className="w-8 h-8 text-slate-300" />
              <p className="text-xs text-slate-400">Aucun témoignage pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingIndex === null ? 'Nouveau témoignage' : 'Modifier le témoignage'}
        subtitle="Témoignages clients"
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
          <label className={labelClass}>Entreprise</label>
          <input className={inputClass} value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Service</label>
          <input className={inputClass} value={draft.service} onChange={(e) => setDraft({ ...draft, service: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Logo (URL)</label>
          <input className={inputClass} value={draft.logo} onChange={(e) => setDraft({ ...draft, logo: e.target.value })} placeholder="https://..." />
        </div>
        <div>
          <label className={labelClass}>Témoignage</label>
          <textarea
            className={`${inputClass} resize-y`}
            rows={5}
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
        </div>
      </SlideOver>
    </div>
  );
};

export default TestimonialsAdmin;
