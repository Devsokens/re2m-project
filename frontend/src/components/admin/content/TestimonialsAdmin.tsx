import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Ban, RotateCcw, Link2, Copy, Check, MessageSquareQuote, Search, Globe } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { ImageUploadField } from '../ImageUploadField';
import { testimonialsStore, Testimonial, TestimonialStatus } from '../../../utils/testimonialsStore';
import { PageLoader } from '../../layout/PageLoader';
import { ConfirmModal } from '../ConfirmModal';

type FilterStatus = 'tous' | TestimonialStatus;

const emptyDraft = { company: '', service: '', text: '', logo: '' };
const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

const STATUS_STYLES: Record<TestimonialStatus, string> = {
  soumis: 'text-amber-700 bg-amber-50 border-amber-100',
  publié: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  rejeté: 'text-rose-700 bg-rose-50 border-rose-100'
};

const SOURCE_LABELS: Record<string, string> = {
  public: 'Site public',
  'lien-privé': 'Lien privé',
  admin: 'Admin'
};

export const TestimonialsAdmin: React.FC = () => {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('tous');
  const [isLoading, setIsLoading] = useState(true);

  const loadRows = () => {
    return testimonialsStore.list().then(setRows).catch((err) => console.error('Échec du chargement des témoignages :', err));
  };

  useEffect(() => {
    loadRows().finally(() => setIsLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setIsOpen(true);
  };

  const openEdit = (row: Testimonial) => {
    setEditingId(row.id);
    setDraft({ company: row.company, service: row.service, text: row.text, logo: row.logo });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!draft.company.trim() || !draft.text.trim()) return;
    const action = editingId === null ? testimonialsStore.create(draft) : testimonialsStore.update(editingId, draft);
    action
      .then((saved) => {
        setRows((prev) => (editingId === null ? [saved, ...prev] : prev.map((r) => (r.id === saved.id ? saved : r))));
        setIsOpen(false);
      })
      .catch((err) => console.error('Échec de l\'enregistrement :', err));
  };

  const handleGenerateLink = () => {
    testimonialsStore
      .createShareToken()
      .then((token) => {
        setShareLink(`${window.location.origin}${window.location.pathname}?testimonial=${token}`);
        setCopied(false);
      })
      .catch((err) => console.error('Échec de la génération du lien :', err));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = (row: Testimonial) => {
    testimonialsStore
      .approve(row.id)
      .then((updated) => setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r))))
      .catch((err) => console.error('Échec de l\'approbation :', err));
  };

  const [rejectTarget, setRejectTarget] = useState<Testimonial | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const performReject = (row: Testimonial) => {
    testimonialsStore
      .reject(row.id)
      .then((updated) => setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r))))
      .catch((err) => console.error('Échec du rejet :', err));
  };

  const handleReject = (row: Testimonial) => {
    if (row.status === 'publié') {
      setRejectTarget(row);
      return;
    }
    performReject(row);
  };

  const handleConfirmReject = () => {
    if (!rejectTarget) return;
    setRejecting(true);
    testimonialsStore
      .reject(rejectTarget.id)
      .then((updated) => {
        setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setRejectTarget(null);
      })
      .catch((err) => console.error('Échec du rejet :', err))
      .finally(() => setRejecting(false));
  };

  const handleRepublish = (row: Testimonial) => {
    testimonialsStore
      .republish(row.id)
      .then((updated) => setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r))))
      .catch((err) => console.error('Échec de la republication :', err));
  };

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      // By default (no explicit filter) only show "soumis" and "publié" — rejected stays hidden
      const matchesStatus = statusFilter === 'tous' ? row.status !== 'rejeté' : row.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return row.company.toLowerCase().includes(q) || row.service.toLowerCase().includes(q) || row.text.toLowerCase().includes(q);
    });
  }, [rows, query, statusFilter]);

  const counts = useMemo(
    () => ({
      soumis: rows.filter((r) => r.status === 'soumis').length,
      publié: rows.filter((r) => r.status === 'publié').length,
      rejeté: rows.filter((r) => r.status === 'rejeté').length
    }),
    [rows]
  );

  const FILTERS: { id: FilterStatus; label: string; count?: number }[] = [
    { id: 'tous', label: 'Actifs (soumis + publiés)' },
    { id: 'soumis', label: 'Soumis', count: counts.soumis },
    { id: 'publié', label: 'Publiés', count: counts.publié },
    { id: 'rejeté', label: 'Rejetés', count: counts.rejeté }
  ];

  if (isLoading) return <PageLoader label="Chargement..." fullScreen={false} />;

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
                  {row.status !== 'publié' && (
                    <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Globe className="w-2.5 h-2.5" /> {SOURCE_LABELS[row.source] || row.source}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {row.status === 'soumis' && (
                    <>
                      <button
                        onClick={() => handleApprove(row)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => handleReject(row)}
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
                        onClick={() => handleReject(row)}
                        className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer transition-colors"
                        title="Rejeter"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {row.status === 'rejeté' && (
                    <button
                      onClick={() => handleRepublish(row)}
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

      <ConfirmModal
        isOpen={rejectTarget !== null}
        title="Rejeter ce témoignage ?"
        message={
          rejectTarget
            ? `Le témoignage de ${rejectTarget.company} ne sera plus affiché sur le site, mais restera consultable via le filtre "Rejeté".`
            : ''
        }
        confirmLabel="Rejeter"
        loading={rejecting}
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectTarget(null)}
      />
    </div>
  );
};

export default TestimonialsAdmin;
