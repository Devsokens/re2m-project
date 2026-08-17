import React, { useState, useEffect } from 'react';
import { Member, Civility } from '../../types/member';
import { Save, User, PhoneCall, Palette, Eye, Download, Printer } from 'lucide-react';
import { downloadVCard } from '../../utils/vcard';
import { generateMemberQRCodeDataUrl } from '../../utils/qrCode';
import { downloadMemberPDF } from '../../utils/pdfPrint';
import { SlideOver } from './SlideOver';
import { ImageUploadField } from './ImageUploadField';
import confetti from 'canvas-confetti';

interface MemberFormModalProps {
  member?: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Member) => void;
}

const inputClass = 'w-full bg-slate-50 text-slate-700 rounded-xl px-3 py-2.5 border border-slate-200 text-xs focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

const STEPS: { id: 1 | 2 | 3 | 4; label: string; icon: React.ElementType }[] = [
  { id: 1, label: 'Personnel', icon: User },
  { id: 2, label: 'Coordonnées', icon: PhoneCall },
  { id: 3, label: 'Design QR', icon: Palette },
  { id: 4, label: 'Aperçu & Actions', icon: Eye }
];

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  // Form State initialized matching Firestore schema
  const [formData, setFormData] = useState<Member>({
    id: `RE2M-00${Math.floor(Math.random() * 900 + 100)}`,
    civility: 'M.',
    lastName: '',
    firstName: '',
    title: '',
    department: 'Achats',
    bio: '',
    photo: '',
    email: '',
    mobile: '+241 ',
    phone: '+241 ',
    address: 'BP 1234, Libreville, Gabon',
    linkedin: '',
    website: '',
    qrColor: '#002366',
    qrBackground: '#FFFFFF',
    status: 'active',
    scanCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'ADMIN_001'
  });

  const [previewQRUrl, setPreviewQRUrl] = useState<string>('');

  useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      setFormData({
        id: `RE2M-00${Math.floor(Math.random() * 900 + 100)}`,
        civility: 'M.',
        lastName: '',
        firstName: '',
        title: '',
        department: 'Achats',
        bio: '',
        photo: '',
        email: '',
        mobile: '+241 07 00 00 00',
        phone: '+241 01 00 00 00',
        address: 'BP 1234, Libreville, Gabon',
        linkedin: '',
        website: '',
        qrColor: '#002366',
        qrBackground: '#FFFFFF',
        status: 'active',
        scanCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'ADMIN_001'
      });
    }
    setActiveTab(1);
  }, [member, isOpen]);

  // Update live preview QR Code
  useEffect(() => {
    if (isOpen) {
      generateMemberQRCodeDataUrl(formData, 400, true).then(setPreviewQRUrl);
    }
  }, [formData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={member ? `Éditer : ${member.firstName} ${member.lastName}` : 'Nouveau Consultant Cabinet RE2M'}
      subtitle={member ? 'Édition Membre' : 'Création Rapide < 2 minutes'}
      width="840px"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-slate-750 border border-slate-200 text-xs font-bold cursor-pointer"
          >
            Annuler
          </button>
          {activeTab > 1 && (
            <button
              type="button"
              onClick={() => setActiveTab((activeTab - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 cursor-pointer"
            >
              Précédent
            </button>
          )}
          {activeTab < 4 && (
            <button
              type="button"
              onClick={() => setActiveTab((activeTab + 1) as any)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#002366] text-xs font-bold border border-slate-200 cursor-pointer"
            >
              Suivant
            </button>
          )}
          <button
            type="submit"
            form="member-form"
            className="bg-[#002366] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{member ? 'Enregistrer' : 'Créer le Membre'}</span>
          </button>
        </>
      }
    >
      <form id="member-form" onSubmit={handleSubmit} className="flex gap-6">

        {/* Left lateral timeline */}
        <div className="w-28 sm:w-36 shrink-0">
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
            <div className="space-y-6">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = activeTab === step.id;
                const isDone = activeTab > step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveTab(step.id)}
                    className="relative flex items-center gap-2 text-left cursor-pointer group w-full"
                  >
                    <span
                      className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        isActive || isDone ? 'bg-[#002366] border-[#002366]' : 'bg-white border-slate-300 group-hover:border-slate-400'
                      }`}
                    />
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#002366]' : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-bold leading-tight ${isActive ? 'text-[#002366]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: active tab content */}
        <div className="flex-1 min-w-0">

          {/* TAB 1: INFORMATIONS PERSONNELLES */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Civilité *</label>
                  <select
                    value={formData.civility}
                    onChange={(e) => setFormData({ ...formData, civility: e.target.value as Civility })}
                    className={inputClass}
                  >
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                    <option value="Dr">Dr</option>
                    <option value="Pr">Pr</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="MOUBEYI"
                    className={`${inputClass} uppercase`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jackie"
                    className={`${inputClass} capitalize`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Fonction *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Consultant Senior Achats"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Département *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={inputClass}
                  >
                    <option value="Achats">Achats</option>
                    <option value="Direction">Direction</option>
                    <option value="Finance & Audit">Finance & Audit</option>
                    <option value="Ressources Humaines">Ressources Humaines</option>
                    <option value="Marketing & Com">Marketing & Com</option>
                    <option value="Conseil IT & Digital">Conseil IT & Digital</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Photo du membre (optionnel)"
                  value={formData.photo || ''}
                  onChange={(v) => setFormData({ ...formData, photo: v })}
                />
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                  Note : La photo s'affichera uniquement sur l'afficheur de ses coordonnées (Carte Virtuelle).
                </p>
              </div>

              <div>
                <label className={labelClass}>Biographie (Optionnel)</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Expertise, années d'expérience, spécialités du consultant..."
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* TAB 2: COORDONNÉES */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email Professionnel *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="j.moubeyi@cabinet-re2m.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Téléphone Mobile *</label>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+241 07 00 00 00"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Téléphone Fixe</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+241 01 00 00 00"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Adresse Physique *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="BP 1234, Libreville, Gabon"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Profil LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/jackie-moubeyi"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Site Web / Portfolio</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://jackiemoubeyi.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN QR CODE */}
          {activeTab === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Couleur des motifs QR Code</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.qrColor}
                      onChange={(e) => setFormData({ ...formData, qrColor: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-200"
                    />
                    <input
                      type="text"
                      value={formData.qrColor}
                      onChange={(e) => setFormData({ ...formData, qrColor: e.target.value })}
                      className="bg-slate-50 text-slate-700 text-xs font-mono rounded-xl px-3 py-2.5 border border-slate-200 uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Couleur de Fond QR Code</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.qrBackground}
                      onChange={(e) => setFormData({ ...formData, qrBackground: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-200"
                    />
                    <input
                      type="text"
                      value={formData.qrBackground}
                      onChange={(e) => setFormData({ ...formData, qrBackground: e.target.value })}
                      className="bg-slate-50 text-slate-700 text-xs font-mono rounded-xl px-3 py-2.5 border border-slate-200 uppercase focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#002366] uppercase tracking-wider">Palettes Prédéfinies Premium</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qrColor: '#002366', qrBackground: '#FFFFFF' })}
                    className="px-3.5 py-2 rounded-xl bg-[#002366] text-white text-xs border border-blue-900 hover:scale-103 transition-transform cursor-pointer font-bold"
                  >
                    Bleu Royal Classic (#002366)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qrColor: '#1A4C8C', qrBackground: '#FFFFFF' })}
                    className="px-3.5 py-2 rounded-xl bg-[#1A4C8C] text-white text-xs border border-blue-900 hover:scale-103 transition-transform cursor-pointer font-bold"
                  >
                    Bleu Lumineux (#1A4C8C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qrColor: '#001845', qrBackground: '#F0F9FF' })}
                    className="px-3.5 py-2 rounded-xl bg-[#001845] text-blue-100 text-xs border border-blue-950 hover:scale-103 transition-transform cursor-pointer font-bold"
                  >
                    Bleu Sombre & Ciel (#001845)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APERÇU TEMPS RÉEL & ACTIONS */}
          {activeTab === 4 && (
            <div className="space-y-4 animate-fadeIn">

              {/* 1:1 Live Physical Card Preview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest">Aperçu Carte Physique 1:1 (Direct Live)</span>

                <div className="w-full max-w-sm aspect-[85/54] rounded-xl bg-[#002366] p-4 border border-blue-900 flex flex-col justify-between text-white shadow-lg relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-[10px] font-bold text-blue-200">CABINET RE2M</span>
                    <span className="text-[8px] bg-blue-800 px-2 py-0.5 rounded font-bold uppercase">{formData.department}</span>
                  </div>

                  <div>
                    <h4 className="font-serif text-xs font-black">{formData.civility} {formData.firstName} {formData.lastName || 'NOM'}</h4>
                    <p className="text-[9px] text-blue-200">{formData.title || 'Fonction'}</p>
                  </div>

                  <div className="flex justify-between items-end text-[7.5px] text-slate-350">
                    <div>
                      <p>{formData.email}</p>
                      <p>{formData.mobile}</p>
                    </div>
                    {previewQRUrl && (
                      <img src={previewQRUrl} alt="QR Live" className="w-8 h-8 rounded bg-white p-0.5 object-contain" />
                    )}
                  </div>
                </div>
              </div>

              {/* Instant Actions */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest">Actions Instantanées</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => downloadVCard(formData)}
                    className="w-full bg-white hover:bg-slate-50 text-slate-750 font-bold py-2.5 px-3 rounded-xl border border-slate-200 flex items-center gap-2 text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#002366]" />
                    <span>Télécharger vCard 4.0</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadMemberPDF(formData)}
                    className="w-full bg-white hover:bg-slate-50 text-slate-750 font-bold py-2.5 px-3 rounded-xl border border-slate-200 flex items-center gap-2 text-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#002366]" />
                    <span>Imprimer PDF HD Recto/Verso</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </SlideOver>
  );
};
export default MemberFormModal;
