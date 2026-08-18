import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Building2, CalendarClock, XCircle, MessageCircleReply, Inbox } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { ServiceRequest, RequestType, RequestStatus, requestsStore } from '../../../data/requests';
import { PageLoader } from '../../layout/PageLoader';

const TYPE_OPTIONS: RequestType[] = ['Audit & Conseil', 'Formation', 'Partenariat', 'Autre'];

const STATUS_META: Record<RequestStatus, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'text-amber-700 bg-amber-50 border-amber-100' },
  scheduled: { label: 'Programmée', className: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  refused: { label: 'Refusée', className: 'text-rose-700 bg-rose-50 border-rose-100' }
};

export const RequestsAdmin: React.FC = () => {
  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [typeFilter, setTypeFilter] = useState<RequestType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);
  const [action, setAction] = useState<'refuse' | 'schedule' | null>(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestsStore
      .list()
      .then(setItems)
      .catch((err) => console.error('Impossible de charger les demandes :', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((r) => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [items, typeFilter, statusFilter]);

  const openReply = (req: ServiceRequest) => {
    setActiveRequest(req);
    setAction(null);
    setMeetingDate('');
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (!activeRequest || !action || saving) return;
    setSaving(true);
    const request =
      action === 'refuse' ? requestsStore.refuse(activeRequest.id) : requestsStore.schedule(activeRequest.id, meetingDate);
    request
      .then((updated) => {
        setItems((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setIsOpen(false);
      })
      .catch((err) => console.error('Échec de la mise à jour :', err))
      .finally(() => setSaving(false));
  };

  if (isLoading) return <PageLoader label="Chargement..." fullScreen={false} />;

  return (
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">
      <div>
        <h2 className="font-serif text-xl font-bold text-[#002366]">Demandes</h2>
        <p className="text-xs text-slate-500">{filtered.length} demande(s) affichée(s) sur {items.length}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
              statusFilter === 'all' ? 'bg-[#002366] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            Toutes
          </button>
          {(Object.keys(STATUS_META) as RequestStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                statusFilter === s ? 'bg-[#002366] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as RequestType | 'all')}
          className="bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 px-3 py-1.5 focus:outline-none focus:border-[#002366] cursor-pointer sm:ml-auto"
        >
          <option value="all">Tous les types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Demandeur</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Reçue le</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Statut</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => (
              <tr key={req.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <p className="text-xs font-bold text-[#002366]">{req.name}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1"><Building2 className="w-3 h-3" /> {req.company}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[10px] font-extrabold text-[#002366] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {req.type}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-slate-500">{new Date(req.receivedAt).toLocaleDateString('fr-FR')}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${STATUS_META[req.status].className}`}>
                    {STATUS_META[req.status].label}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => openReply(req)}
                    className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] hover:bg-blue-100 text-[11px] font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageCircleReply className="w-3.5 h-3.5" /> Répondre
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
            <Inbox className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-400">Aucune demande ne correspond à ces filtres.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Répondre à la demande"
        subtitle={activeRequest?.company}
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!action || (action === 'schedule' && !meetingDate) || saving}
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Enregistrement...' : 'Confirmer'}
            </button>
          </>
        }
      >
        {activeRequest && (
          <>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-bold text-[#002366]">{activeRequest.name}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {activeRequest.company}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {activeRequest.email}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {activeRequest.phone}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Message</p>
              <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-2xl p-4">
                {activeRequest.message}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Action</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAction('refuse')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    action === 'refuse' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  Refuser
                </button>
                <button
                  onClick={() => setAction('schedule')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    action === 'schedule' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <CalendarClock className="w-5 h-5" />
                  Programmer un RDV
                </button>
              </div>
            </div>

            {action === 'schedule' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Date du rendez-vous</label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none"
                />
              </div>
            )}
          </>
        )}
      </SlideOver>
    </div>
  );
};

export default RequestsAdmin;
