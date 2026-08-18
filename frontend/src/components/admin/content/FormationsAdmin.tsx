import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  GraduationCap,
  Users,
  MapPin,
  Calendar,
  ChevronLeft,
  Upload,
  UserPlus,
  Eye,
  Download,
  Trash2,
  FileArchive,
  FileText,
  Loader2,
  MoreVertical,
  Pencil,
  FileSpreadsheet,
  Mail,
  Building,
  Search
} from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { PageLoader } from '../../layout/PageLoader';
import { ConfirmModal } from '../ConfirmModal';
import { CertificatePreviewModal } from '../certificates/CertificatePreviewModal';
import { CertificateData } from '../certificates/CertificateTemplate';
import { CertificateTemplatePreview } from '../certificates/CertificateTemplatePreview';
import { CERTIFICATE_TEMPLATES } from '../../../data/certificateTemplates';
import {
  Formation,
  Participant,
  CertificateTemplateId,
  formationsStore
} from '../../../data/formations';
import {
  downloadSingleCertificate,
  downloadMergedCertificatesPdf,
  downloadCertificatesZip
} from '../../../utils/certificateGenerator';
import { getInitials } from '../../../utils/text';

const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

const getDefaultTemplateId = (): CertificateTemplateId =>
  (localStorage.getItem('re2m_certificate_default_template') as CertificateTemplateId) || 're2m-classique';

const emptyFormationDraft: Formation = {
  id: '',
  title: '',
  date: new Date().toISOString().slice(0, 10),
  location: 'Libreville, Gabon',
  description: '',
  templateId: 're2m-classique',
  signerName: 'Roch-Emmanuel MVE-MBORO',
  signerTitle: 'Directeur-Expert Consultant Formateur en Achats & Logistique certifié'
};

const emptyParticipantDraft = { fullName: '', email: '', organization: '' };

interface ParticipantEditDraft {
  fullName: string;
  email: string;
  organization: string;
  present: boolean;
}

const emptyEditDraft: ParticipantEditDraft = { fullName: '', email: '', organization: '', present: true };

// Get the digital stamp uploaded in Paramètres (shared localStorage key with SettingsAdmin)
const getStampUrl = (): string | undefined => localStorage.getItem('re2m_certificate_stamp') || undefined;

type DetailTab = 'participants' | 'certification';

export const FormationsAdmin: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeFormationId, setActiveFormationId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('participants');

  const [isFormationFormOpen, setIsFormationFormOpen] = useState(false);
  const [formationDraft, setFormationDraft] = useState<Formation>(emptyFormationDraft);

  const [isParticipantFormOpen, setIsParticipantFormOpen] = useState(false);
  const [participantDraft, setParticipantDraft] = useState(emptyParticipantDraft);

  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [participantQuery, setParticipantQuery] = useState('');

  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ParticipantEditDraft>(emptyEditDraft);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewData, setPreviewData] = useState<CertificateData | null>(null);
  const [previewParticipant, setPreviewParticipant] = useState<Participant | null>(null);
  const [isBulkWorking, setIsBulkWorking] = useState<'pdf' | 'zip' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteFormationTarget, setDeleteFormationTarget] = useState<Formation | null>(null);
  const [deletingFormation, setDeletingFormation] = useState(false);
  const [deleteParticipantTarget, setDeleteParticipantTarget] = useState<Participant | null>(null);
  const [deletingParticipant, setDeletingParticipant] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFormation = formations.find((f) => f.id === activeFormationId) || null;
  const selectedParticipant = participants.find((p) => p.id === selectedParticipantId) || null;

  const filteredParticipants = useMemo(() => {
    const q = participantQuery.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter(
      (p) => p.fullName.toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q) || (p.organization || '').toLowerCase().includes(q)
    );
  }, [participants, participantQuery]);

  const loadFormations = () => {
    return formationsStore.list().then(setFormations).catch((err) => console.error('Échec du chargement des formations :', err));
  };

  useEffect(() => {
    loadFormations().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!activeFormationId) {
      setParticipants([]);
      return;
    }
    formationsStore
      .listParticipants(activeFormationId)
      .then(setParticipants)
      .catch((err) => console.error('Échec du chargement des participants :', err));
  }, [activeFormationId]);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  if (isLoading) return <PageLoader label="Chargement..." fullScreen={false} />;

  const handleOpenMenu = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 144;
    setMenuPosition({ top: rect.bottom + 4, left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8) });
    setOpenMenuId(id);
  };

  // --- Formation CRUD ---
  const openCreateFormation = () => {
    setFormationDraft({ ...emptyFormationDraft, id: `FRM-${Date.now()}`, templateId: getDefaultTemplateId() });
    setIsFormationFormOpen(true);
  };
  const handleSaveFormation = () => {
    if (!formationDraft.title.trim()) return;
    formationsStore
      .create(formationDraft)
      .then((created) => {
        setFormations((prev) => [created, ...prev]);
        setIsFormationFormOpen(false);
      })
      .catch((err) => console.error('Échec de la création de la formation :', err));
  };
  const handleConfirmDeleteFormation = () => {
    if (!deleteFormationTarget) return;
    setDeletingFormation(true);
    formationsStore
      .remove(deleteFormationTarget.id)
      .then(() => {
        setFormations((prev) => prev.filter((f) => f.id !== deleteFormationTarget.id));
        setDeleteFormationTarget(null);
      })
      .catch((err) => console.error('Échec de la suppression :', err))
      .finally(() => setDeletingFormation(false));
  };

  const openFormationDetail = (id: string) => {
    setActiveFormationId(id);
    setDetailTab('participants');
    setSelectedParticipantId(null);
    setSelectedIds(new Set());
  };

  // --- Participant CRUD ---
  const openAddParticipant = () => {
    setParticipantDraft(emptyParticipantDraft);
    setIsParticipantFormOpen(true);
  };
  const handleSaveParticipant = () => {
    if (!participantDraft.fullName.trim() || !activeFormationId) return;
    formationsStore
      .addParticipant(activeFormationId, participantDraft)
      .then((created) => {
        setParticipants((prev) => [...prev, created]);
        setFormations((prev) => prev.map((f) => (f.id === activeFormationId ? { ...f, participantCount: (f.participantCount ?? 0) + 1 } : f)));
        setIsParticipantFormOpen(false);
      })
      .catch((err) => console.error('Échec de l\'ajout du participant :', err));
  };
  const handleConfirmDeleteParticipant = () => {
    if (!deleteParticipantTarget) return;
    const id = deleteParticipantTarget.id;
    setDeletingParticipant(true);
    formationsStore
      .removeParticipant(id)
      .then(() => {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
        setFormations((prev) => prev.map((f) => (f.id === activeFormationId ? { ...f, participantCount: Math.max(0, (f.participantCount ?? 1) - 1) } : f)));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setSelectedParticipantId((prev) => (prev === id ? null : prev));
        setDeleteParticipantTarget(null);
      })
      .catch((err) => console.error('Échec de la suppression du participant :', err))
      .finally(() => setDeletingParticipant(false));
  };

  const openEditParticipant = (p: Participant) => {
    setEditingParticipantId(p.id);
    setEditDraft({ fullName: p.fullName, email: p.email || '', organization: p.organization || '', present: p.present });
  };
  const handleSaveEditParticipant = () => {
    if (!editingParticipantId || !editDraft.fullName.trim()) return;
    formationsStore
      .updateParticipant(editingParticipantId, editDraft)
      .then((updated) => {
        setParticipants((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditingParticipantId(null);
      })
      .catch((err) => console.error('Échec de la mise à jour :', err));
  };

  // --- Excel import / template ---
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !activeFormationId) return;

    const XLSX = await import('xlsx');
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const imported = rows
      .map((row) => {
        const fullName = row['Nom'] || row['Nom complet'] || row['Name'] || row['nom'] || '';
        if (!fullName) return null;
        return {
          fullName: String(fullName),
          email: String(row['Email'] || row['email'] || ''),
          organization: String(row['Organisation'] || row['Entreprise'] || row['organization'] || ''),
          present: true
        };
      })
      .filter((p): p is { fullName: string; email: string; organization: string; present: boolean } => p !== null);

    if (imported.length === 0) {
      window.alert("Aucune ligne valide trouvée. Assurez-vous d'avoir une colonne \"Nom\".");
      return;
    }

    formationsStore
      .addParticipantsBulk(activeFormationId, imported)
      .then((created) => {
        setParticipants((prev) => [...prev, ...created]);
        setFormations((prev) => prev.map((f) => (f.id === activeFormationId ? { ...f, participantCount: (f.participantCount ?? 0) + created.length } : f)));
      })
      .catch((err) => console.error('Échec de l\'import Excel :', err));
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.aoa_to_sheet([
      ['Nom', 'Email', 'Organisation'],
      ['Jean Dupont', 'jean.dupont@email.com', 'Société XYZ']
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    XLSX.writeFile(wb, 'Modele_Participants_RE2M.xlsx');
  };

  // --- Certificate helpers ---
  const toCertData = (p: Participant): CertificateData | null => {
    if (!activeFormation) return null;
    return {
      participantName: p.fullName,
      formationTitle: activeFormation.title,
      date: activeFormation.date,
      signerName: activeFormation.signerName,
      signerTitle: activeFormation.signerTitle,
      stampUrl: getStampUrl(),
      templateId: activeFormation.templateId
    };
  };

  const handlePreview = async (p: Participant) => {
    const data = toCertData(p);
    if (!data) return;
    setPreviewParticipant(p);
    setPreviewData(data);
  };

  const handleDownloadOne = async (p: Participant) => {
    const data = toCertData(p);
    if (!data) return;
    await downloadSingleCertificate(data);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    const presentIds = participants.filter((p) => p.present).map((p) => p.id);
    setSelectedIds((prev) => (prev.size === presentIds.length ? new Set() : new Set(presentIds)));
  };

  const selectedParticipants = participants.filter((p) => selectedIds.has(p.id) && p.present);
  const bulkTargets = selectedParticipants.length > 0 ? selectedParticipants : participants.filter((p) => p.present);

  const handleBulkDownload = async (mode: 'pdf' | 'zip') => {
    if (!activeFormation || bulkTargets.length === 0) return;
    setIsBulkWorking(mode);
    try {
      const items = bulkTargets.map((p) => toCertData(p)).filter((d): d is CertificateData => d !== null);
      if (mode === 'pdf') {
        await downloadMergedCertificatesPdf(items, `Attestations_${activeFormation.title.slice(0, 30)}.pdf`);
      } else {
        await downloadCertificatesZip(items, `Attestations_${activeFormation.title.slice(0, 30)}.zip`);
      }
    } finally {
      setIsBulkWorking(null);
    }
  };

  // ============ DETAIL VIEW ============
  if (activeFormation) {
    return (
      <div className="space-y-6 animate-fadeIn text-[#0f172a]">
        <button
          onClick={() => { setActiveFormationId(null); setSelectedIds(new Set()); }}
          className="text-xs font-bold text-[#002366] hover:text-blue-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Toutes les formations
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#002366]">{activeFormation.title}</h2>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(activeFormation.date).toLocaleDateString('fr-FR')}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {activeFormation.location}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {participants.length} participant(s)</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#002366] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg uppercase tracking-wider shrink-0">
            Modèle : {CERTIFICATE_TEMPLATES.find((t) => t.id === activeFormation.templateId)?.name}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200">
          {(['participants', 'certification'] as DetailTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setDetailTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold cursor-pointer border-b-2 -mb-px transition-colors ${
                detailTab === tab ? 'border-[#002366] text-[#002366]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'participants' ? 'Participants' : 'Certification'}
            </button>
          ))}
        </div>

        {detailTab === 'certification' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">
              {selectedParticipants.length > 0
                ? `${selectedParticipants.length} participant(s) sélectionné(s)`
                : `${bulkTargets.length} participant(s) présent(s) — le téléchargement portera sur tous`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkDownload('pdf')}
                disabled={bulkTargets.length === 0 || isBulkWorking !== null}
                className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 text-[#002366] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isBulkWorking === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                PDF unique ({bulkTargets.length})
              </button>
              <button
                onClick={() => handleBulkDownload('zip')}
                disabled={bulkTargets.length === 0 || isBulkWorking !== null}
                className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 text-[#002366] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isBulkWorking === 'zip' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileArchive className="w-4 h-4" />}
                ZIP séparé ({bulkTargets.length})
              </button>
            </div>
          </div>
        )}

        {/* ============ PARTICIPANTS TAB ============ */}
        {detailTab === 'participants' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            <div className="space-y-4 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={openAddParticipant}
                  className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Ajouter un participant
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#002366] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" /> Importer un fichier Excel
                </button>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Modèle Excel
                </button>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelImport} />
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={participantQuery}
                  onChange={(e) => setParticipantQuery(e.target.value)}
                  placeholder="Rechercher un participant..."
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-visible shadow-sm divide-y divide-slate-100">
                {filteredParticipants.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedParticipantId(p.id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors first:rounded-t-3xl last:rounded-b-3xl ${
                      selectedParticipantId === p.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-[#002366]">{getInitials(p.fullName) || '?'}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#002366] truncate">{p.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{p.organization || p.email || '—'}</p>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                        p.present ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                      }`}
                    >
                      {p.present ? 'Présent' : 'Absent'}
                    </span>
                    <div className="shrink-0">
                      <button
                        onClick={(e) => handleOpenMenu(p.id, e)}
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer text-slate-400"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredParticipants.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
                    <Users className="w-8 h-8 text-slate-300" />
                    <p className="text-xs text-slate-400">
                      {participants.length === 0 ? 'Aucun participant pour le moment.' : 'Aucun participant ne correspond à la recherche.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {openMenuId &&
              menuPosition &&
              createPortal(
                <div
                  ref={menuRef}
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                  className="fixed w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-[80] overflow-hidden animate-scaleUp"
                >
                  {(() => {
                    const p = participants.find((x) => x.id === openMenuId);
                    if (!p) return null;
                    return (
                      <>
                        <button
                          onClick={() => { openEditParticipant(p); setOpenMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Modifier
                        </button>
                        <button
                          onClick={() => { setDeleteParticipantTarget(p); setOpenMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </button>
                      </>
                    );
                  })()}
                </div>,
                document.body
              )}

            {/* Right panel - selected participant details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:sticky lg:top-24">
              {selectedParticipant ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[#002366]">{getInitials(selectedParticipant.fullName) || '?'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#002366] truncate">{selectedParticipant.fullName}</p>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mt-1 ${
                          selectedParticipant.present ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}
                      >
                        {selectedParticipant.present ? 'Présent' : 'Absent'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-start gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                        <p className="text-xs text-slate-600 break-words">{selectedParticipant.email || 'Non renseigné'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Organisation</p>
                        <p className="text-xs text-slate-600 break-words">{selectedParticipant.organization || 'Non renseignée'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Formation</p>
                        <p className="text-xs text-slate-600 break-words">{activeFormation.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => openEditParticipant(selectedParticipant)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#002366] text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button
                      onClick={() => setDeleteParticipantTarget(selectedParticipant)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-2 py-12">
                  <Users className="w-6 h-6 text-slate-300" />
                  <p className="text-xs text-slate-400">Sélectionnez un participant pour voir ses informations.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ CERTIFICATION TAB ============ */}
        {detailTab === 'certification' && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size > 0 && selectedIds.size === participants.filter((p) => p.present).length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-[#002366] cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Participant</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Présence</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors ${!p.present ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        disabled={!p.present}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 accent-[#002366] cursor-pointer disabled:opacity-30"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-bold text-[#002366]">{p.fullName}</p>
                      {p.email && <p className="text-[11px] text-slate-400">{p.email}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                          p.present ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-rose-700 bg-rose-50 border border-rose-100'
                        }`}
                      >
                        {p.present ? 'Présent' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handlePreview(p)}
                          disabled={!p.present}
                          className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Voir le certificat"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownloadOne(p)}
                          disabled={!p.present}
                          className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Télécharger"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {participants.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
                <Users className="w-8 h-8 text-slate-300" />
                <p className="text-xs text-slate-400">Aucun participant pour le moment.</p>
              </div>
            )}
          </div>
        )}

        <SlideOver
          isOpen={isParticipantFormOpen}
          onClose={() => setIsParticipantFormOpen(false)}
          title="Ajouter un participant"
          subtitle={activeFormation.title}
          footer={
            <>
              <button onClick={() => setIsParticipantFormOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-all">
                Annuler
              </button>
              <button onClick={handleSaveParticipant} className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all">
                Ajouter
              </button>
            </>
          }
        >
          <div>
            <label className={labelClass}>Nom complet</label>
            <input className={inputClass} value={participantDraft.fullName} onChange={(e) => setParticipantDraft({ ...participantDraft, fullName: e.target.value })} placeholder="Prénom NOM" />
          </div>
          <div>
            <label className={labelClass}>Email (optionnel)</label>
            <input className={inputClass} value={participantDraft.email} onChange={(e) => setParticipantDraft({ ...participantDraft, email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Organisation (optionnel)</label>
            <input className={inputClass} value={participantDraft.organization} onChange={(e) => setParticipantDraft({ ...participantDraft, organization: e.target.value })} />
          </div>
        </SlideOver>

        {/* Centered edit modal */}
        {editingParticipantId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setEditingParticipantId(null)}
          >
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-scaleUp">
              <h3 className="font-serif text-base font-bold text-[#002366]">Modifier le participant</h3>
              <div>
                <label className={labelClass}>Nom complet</label>
                <input className={inputClass} value={editDraft.fullName} onChange={(e) => setEditDraft({ ...editDraft, fullName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} value={editDraft.email} onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Organisation</label>
                <input className={inputClass} value={editDraft.organization} onChange={(e) => setEditDraft({ ...editDraft, organization: e.target.value })} />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editDraft.present}
                  onChange={(e) => setEditDraft({ ...editDraft, present: e.target.checked })}
                  className="w-4 h-4 accent-[#002366] cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-600">Présent à la formation</span>
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setEditingParticipantId(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-all">
                  Annuler
                </button>
                <button onClick={handleSaveEditParticipant} className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        <CertificatePreviewModal
          data={previewData}
          onClose={() => setPreviewData(null)}
          onDownload={() => previewParticipant && handleDownloadOne(previewParticipant)}
        />

        <ConfirmModal
          isOpen={deleteParticipantTarget !== null}
          title="Supprimer ce participant ?"
          message={deleteParticipantTarget ? `${deleteParticipantTarget.fullName} sera retiré de la liste des participants.` : ''}
          loading={deletingParticipant}
          onConfirm={handleConfirmDeleteParticipant}
          onCancel={() => setDeleteParticipantTarget(null)}
        />
      </div>
    );
  }

  // ============ LIST VIEW ============
  return (
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#002366]">Formations</h2>
          <p className="text-xs text-slate-500">{formations.length} formation(s) enregistrée(s)</p>
        </div>
        <button
          onClick={openCreateFormation}
          className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Nouvelle formation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {formations.map((f) => (
          <div key={f.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between group">
            <div onClick={() => openFormationDetail(f.id)} className="cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug line-clamp-2">{f.title}</h4>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(f.date).toLocaleDateString('fr-FR')}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {f.participantCount ?? 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <button onClick={() => openFormationDetail(f.id)} className="text-xs font-bold text-[#002366] hover:text-blue-900 cursor-pointer">
                Gérer les participants →
              </button>
              <button
                onClick={() => setDeleteFormationTarget(f)}
                className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {formations.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-center gap-3 py-16 corporate-card rounded-3xl border border-dashed border-slate-300 bg-white">
            <GraduationCap className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-400">Aucune formation pour le moment.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isFormationFormOpen}
        onClose={() => setIsFormationFormOpen(false)}
        title="Nouvelle formation"
        subtitle="Formations & certifications"
        width="720px"
        footer={
          <>
            <button onClick={() => setIsFormationFormOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-all">
              Annuler
            </button>
            <button onClick={handleSaveFormation} className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all">
              Créer
            </button>
          </>
        }
      >
        <div>
          <label className={labelClass}>Titre de la formation</label>
          <input className={inputClass} value={formationDraft.title} onChange={(e) => setFormationDraft({ ...formationDraft, title: e.target.value })} placeholder="Ex : Gestion optimisée des stocks..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" className={inputClass} value={formationDraft.date} onChange={(e) => setFormationDraft({ ...formationDraft, date: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Lieu</label>
            <input className={inputClass} value={formationDraft.location} onChange={(e) => setFormationDraft({ ...formationDraft, location: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description (optionnel)</label>
          <textarea className={`${inputClass} resize-y`} rows={2} value={formationDraft.description} onChange={(e) => setFormationDraft({ ...formationDraft, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Signataire</label>
            <input className={inputClass} value={formationDraft.signerName} onChange={(e) => setFormationDraft({ ...formationDraft, signerName: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Fonction du signataire</label>
            <input className={inputClass} value={formationDraft.signerTitle} onChange={(e) => setFormationDraft({ ...formationDraft, signerTitle: e.target.value })} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Modèle de certificat</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CERTIFICATE_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFormationDraft({ ...formationDraft, templateId: t.id as CertificateTemplateId })}
                className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  formationDraft.templateId === t.id ? 'border-[#002366] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CertificateTemplatePreview templateId={t.id as CertificateTemplateId} width={180} className="w-full" />
                <div className="text-center">
                  <p className="text-xs font-bold text-[#002366]">{t.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SlideOver>

      <ConfirmModal
        isOpen={deleteFormationTarget !== null}
        title="Supprimer cette formation ?"
        message={deleteFormationTarget ? `« ${deleteFormationTarget.title} » et tous ses participants seront définitivement supprimés.` : ''}
        loading={deletingFormation}
        onConfirm={handleConfirmDeleteFormation}
        onCancel={() => setDeleteFormationTarget(null)}
      />
    </div>
  );
};

export default FormationsAdmin;
