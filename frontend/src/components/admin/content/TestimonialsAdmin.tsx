import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Ban, RotateCcw, Link2, Copy, Check, MessageSquareQuote, Search, Globe } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { ImageUploadField } from '../ImageUploadField';
import { cmsStorage } from '../../../utils/cmsStorage';
import { testimonialsStore, PendingTestimonial, RejectedTestimonial } from '../../../utils/testimonialsStore';

interface Testimonial {
  id: string;
  company: string;
  service: string;
  text: string;
  logo: string;
}

type Status = 'soumis' | 'publié' | 'rejeté';
type FilterStatus = 'tous' | Status;

interface UnifiedRow {
  id: string;
  company: string;
  service: string;
  text: string;
  logo: string;
  status: Status;
  submittedAt?: string;
  source?: string;
  publishedIdx?: number;
  pendingRef?: PendingTestimonial;
  rejectedRef?: RejectedTestimonial;
}

const emptyDraft = { company: '', service: '', text: '', logo: '' };
const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

const STATUS_STYLES: Record<Status, string> = {
  soumis: 'text-amber-700 bg-amber-50 border-amber-100',
  publié: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  rejeté: 'text-rose-700 bg-rose-50 border-rose-100'
};

const genId = () => `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const TestimonialsAdmin: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [pending, setPending] = useState<PendingTestimonial[]>([]);
  const [rejected, setRejected] = useState<RejectedTestimonial[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('tous');

  const loadItems = async () => {
    const blocks = await cmsStorage.getDraftLayout('accueil');
    const block = blocks.find((b) => b.type === 'Testimonials');
    const rawItems: any[] = block?.settings.items || [];
    // One-time migration: assign a stable id to any legacy item that doesn't have one yet
    let mutated = false;
    const withIds: Testimonial[] = rawItems.map((t) => {
      if (t.id) return t;
      mutated = true;
      return { ...t, id: genId() };
    });
    if (mutated && block) {
      const next = blocks.map((b) => (b.type === 'Testimonials' ? { ...b, settings: { ...b.settings, items: withIds } } : b));
      await cmsStorage.saveDraftLayout('accueil', next);
      await cmsStorage.publishLayout('accueil');
    }
    setItems(withIds);
  };

  useEffect(() => {
    loadItems().catch((err) => console.error('Échec du chargement des témoignages :', err));
    setPending(testimonialsStore.getPending());
    setRejected(testimonialsStore.getRejected());
  }, []);

  const persistItems = async (updated: Testimonial[]) => {
    const blocks = await cmsStorage.getDraftLayout('accueil');
    const next = blocks.map((b) => (b.type === 'Testimonials' ? { ...b, settings: { ...b.settings, items: updated } } : b));
    await cmsStorage.saveDraftLayout('accueil', next);
    await cmsStorage.publishLayout('accueil');
    setItems(updated);
  };

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setIsOpen(true);
  };

  const openEdit = (row: UnifiedRow) => {
    setEditingId(row.id);
    setDraft({ company: row.company, service: row.service, text: row.text, logo: row.logo });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!draft.company.trim() || !draft.text.trim()) return;
    if (editingId === null) {
      persistItems([{ id: genId(), ...draft }, ...items]);
    } else {
      persistItems(items.map((t) => (t.id === editingId ? { ...t, ...draft } : t)));
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

  // soumis -> publié
  const handleApprove = (entry: PendingTestimonial) => {
    persistItems([{ id: genId(), company: entry.company, service: entry.service, text: entry.text, logo: entry.logo }, ...items]);
    testimonialsStore.removePending(entry.id);
    setPending(testimonialsStore.getPending());
  };

  // soumis -> rejeté (kept, not deleted)
  const handleRejectPending = (entry: PendingTestimonial) => {
    testimonialsStore.addRejected({ id: entry.id, company: entry.company, service: entry.service, text: entry.text, logo: entry.logo, submittedAt: entry.submittedAt });
    testimonialsStore.removePending(entry.id);
    setPending(testimonialsStore.getPending());
    setRejected(testimonialsStore.getRejected());
  };

  // publié -> rejeté (kept, not deleted)
  const handleRejectPublished = (row: UnifiedRow) => {
    if (!window.confirm('Rejeter ce témoignage ? Il ne sera plus affiché sur le site mais restera consultable via le filtre "Rejeté".')) return;
    testimonialsStore.addRejected({ id: row.id, company: row.company, service: row.service, text: row.text, logo: row.logo, submittedAt: new Date().toISOString() });
    persistItems(items.filter((t) => t.id !== row.id));
    setRejected(testimonialsStore.getRejected());
  };

  // rejeté -> publié
  const handleRepublish = (row: RejectedTestimonial) => {
    persistItems([{ id: row.id, company: row.company, service: row.service, text: row.text, logo: row.logo }, ...items]);
    testimonialsStore.removeRejected(row.id);
    setRejected(testimonialsStore.getRejected());
  };

  const unifiedRows: UnifiedRow[] = useMemo(() => {
    const published: UnifiedRow[] = items.map((t) => ({
      id: t.id,
      company: t.company,
      service: t.service,
      text: t.text,
      logo: t.logo,
      status: 'publié'
    }));
    const soumis: UnifiedRow[] = pending.map((p) => ({
      id: p.id,
      company: p.company,
      service: p.service,
      text: p.text,
      logo: p.logo,
      status: 'soumis',
      submittedAt: p.submittedAt,
      source: p.source === 'public' ? 'Site public' : 'Lien privé',
      pendingRef: p
    }));
    const rejetes: UnifiedRow[] = rejected.map((r) => ({
      id: r.id,
      company: r.company,
      service: r.service,
      text: r.text,
      logo: r.logo,
      status: 'rejeté',
      submittedAt: r.rejectedAt,
      rejectedRef: r
    }));
    return [...soumis, ...published, ...rejetes];
  }, [items, pending, rejected]);

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return unifiedRows.filter((row) => {
      // By default (no explicit filter) only show "soumis" and "publié" — rejected stays hidden
      const matchesStatus = statusFilter === 'tous' ? row.status !== 'rejeté' : row.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return row.company.toLowerCase().includes(q) || row.service.toLowerCase().includes(q) || row.text.toLowerCase().includes(q);
    });
  }, [unifiedRows, query, statusFilter]);

  const counts = useMemo(
    () => ({
      soumis: unifiedRows.filter((r) => r.status === 'soumis').length,
      publié: unifiedRows.filter((r) => r.status === 'publié').length,
      rejeté: unifiedRows.filter((r) => r.status === 'rejeté').length
    }),
    [unifiedRows]
  );

  const FILTERS: { id: FilterStatus; label: string; count?: number }[] = [
    { id: 'tous', label: 'Actifs (soumis + publiés)' },
    { id: 'soumis', label: 'Soumis', count: counts.soumis },
    { id: 'publié', label: 'Publiés', count: counts.publié },
    { id: 'rejeté', label: 'Rejetés', count: counts.rejeté }
  ];

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
            <p className="text-[11px] text-slate-500">
              Générez un lien privé à envoyer par email, ou laissez vos visiteurs déposer un témoignage directement depuis le site public — dans les deux cas, il arrive ici en attente de validation.
            </p>
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

      {/* Unified list: search + status filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#002366]">Témoignages</h2>
            <p className="text-xs text-slate-500">{visibleRows.length} témoignage(s) affiché(s)</p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nouveau témoignage
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une entreprise, un service, un extrait..."
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold border cursor-pointer transition-colors whitespace-nowrap ${
                  statusFilter === f.id
                    ? 'bg-[#002366] border-[#002366] text-white'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {f.label}{f.count !== undefined ? ` (${f.count})` : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleRows.map((row) => (
            <div key={row.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between relative">
              <span className={`absolute top-4 right-4 text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider border ${STATUS_STYLES[row.status]}`}>
                {row.status}
              </span>

              <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4 pr-16">"{row.text}"</p>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#002366] truncate">{row.company}</p>
                  <p className="text-[10px] text-slate-400 truncate">{row.service}</p>
                  {row.source && (
                    <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Globe className="w-2.5 h-2.5" /> {row.source}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {row.status === 'soumis' && row.pendingRef && (
                    <>
                      <button
                        onClick={() => handleApprove(row.pendingRef!)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => handleRejectPending(row.pendingRef!)}
                        className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer transition-colors"
                        title="Rejeter"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {row.status === 'publié' && (
                    <>
                      <button
                        onClick={() => openEdit(row)}
                        className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRejectPublished(row)}
                        className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer transition-colors"
                        title="Rejeter"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {row.status === 'rejeté' && row.rejectedRef && (
                    <button
                      onClick={() => handleRepublish(row.rejectedRef!)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                      title="Republier"
                    >
                      <RotateCcw className="w-3 h-3" /> Republier
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {visibleRows.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-center gap-3 py-16 corporate-card rounded-3xl border border-dashed border-slate-300 bg-white">
              <MessageSquareQuote className="w-8 h-8 text-slate-300" />
              <p className="text-xs text-slate-400">Aucun témoignage ne correspond à ces critères.</p>
            </div>
          )}
        </div>
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId === null ? 'Nouveau témoignage' : 'Modifier le témoignage'}
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
        <ImageUploadField label="Logo de l'entreprise" value={draft.logo} onChange={(v) => setDraft({ ...draft, logo: v })} />
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
