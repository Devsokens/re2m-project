import React, { useState, useEffect } from 'react';
import { Member, Civility } from '../../types/member';
import { X, Save, User, PhoneCall, Palette, Eye, Download, Printer } from 'lucide-react';
import { downloadVCard } from '../../utils/vcard';
import { generateMemberQRCodeDataUrl } from '../../utils/qrCode';
import { downloadMemberPDF } from '../../utils/pdfPrint';
import confetti from 'canvas-confetti';

interface MemberFormModalProps {
  member?: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Member) => void;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  // Form State initialized matching 7.1 Firestore schema
  const [formData, setFormData] = useState<Member>({
    id: `RE2M-00${Math.floor(Math.random() * 900 + 100)}`,
    civility: 'M.',
    lastName: '',
    firstName: '',
    title: '',
    department: 'Achats',
    bio: '',
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

  // Update live preview QR Code when tab 4 is selected or colors change
  useEffect(() => {
    if (isOpen) {
      generateMemberQRCodeDataUrl(formData, 400, true).then(setPreviewQRUrl);
    }
  }, [formData, isOpen]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel max-w-4xl w-full rounded-3xl p-6 sm:p-8 border-2 border-sky-500/40 shadow-2xl space-y-6 relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20 uppercase tracking-wider">
              {member ? 'Édition Membre' : 'Création Rapide < 2 minutes'}
            </span>
            <h3 className="font-serif text-2xl font-bold text-white mt-1">
              {member ? `Éditer : ${member.firstName} ${member.lastName}` : 'Nouveau Consultant Cabinet RE2M'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Tabs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 1
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-sky-200 shadow border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-sky-300" />
            <span>1. Personnel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 2
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-sky-200 shadow border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-sky-300" />
            <span>2. Coordonnées</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(3)}
            className={`py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 3
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-sky-200 shadow border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-sky-300" />
            <span>3. Design QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(4)}
            className={`py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 4
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-sky-200 shadow border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4 text-sky-300" />
            <span>4. Aperçu & Actions</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TAB 1: INFORMATIONS PERSONELLES */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Civilité *</label>
                  <select
                    value={formData.civility}
                    onChange={(e) => setFormData({ ...formData, civility: e.target.value as Civility })}
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
                  >
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                    <option value="Dr">Dr</option>
                    <option value="Pr">Pr</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="MOUBEYI"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jackie"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none capitalize"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Fonction *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Consultant Senior Achats"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Département *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Biographie (Optionnel)</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Expertise, années d'expérience, spécialités du consultant..."
                  className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: COORDONNÉES */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Professionnel *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="j.moubeyi@cabinet-re2m.com"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Téléphone Mobile *</label>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+241 07 00 00 00"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Téléphone Fixe</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+241 01 00 00 00"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Adresse Physique *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="BP 1234, Libreville, Gabon"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profil LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/jackie-moubeyi"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Site Web / Portfolio</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://jackiemoubeyi.com"
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 border border-slate-800 text-xs focus:border-sky-400 focus:outline-none"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Couleur des motifs QR Code</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.qrColor}
                      onChange={(e) => setFormData({ ...formData, qrColor: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-slate-900 border border-slate-800"
                    />
                    <input
                      type="text"
                      value={formData.qrColor}
                      onChange={(e) => setFormData({ ...formData, qrColor: e.target.value })}
                      className="bg-slate-900 text-white text-xs font-mono rounded-xl px-3 py-2 border border-slate-800 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Couleur de Fond QR Code</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.qrBackground}
                      onChange={(e) => setFormData({ ...formData, qrBackground: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-slate-900 border border-slate-800"
                    />
                    <input
                      type="text"
                      value={formData.qrBackground}
                      onChange={(e) => setFormData({ ...formData, qrBackground: e.target.value })}
                      className="bg-slate-900 text-white text-xs font-mono rounded-xl px-3 py-2 border border-slate-800 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-sky-300">Palettes Prédéfinies Premium</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qrColor: '#002366', qrBackground: '#FFFFFF' })}
                    className="px-3 py-1.5 rounded-xl bg-[#002366] text-white text-xs border border-sky-500/40 hover:scale-105 transition-transform"
                  >
                    Bleu Royal Classic (#002366)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qrColor: '#1A4C8C', qrBackground: '#FFFFFF' })}
                    className="px-3 py-1.5 rounded-xl bg-[#1A4C8C] text-white text-xs border border-sky-500/40 hover:scale-105 transition-transform"
                  >
                    Bleu Lumineux (#1A4C8C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qrColor: '#081026', qrBackground: '#DBEAFE' })}
                    className="px-3 py-1.5 rounded-xl bg-[#081026] text-sky-200 text-xs border border-sky-500/40 hover:scale-105 transition-transform"
                  >
                    Bleu Nuit & Ciel (#081026)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APERÇU TEMPS RÉEL & ACTIONS */}
          {activeTab === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* 1:1 Live Physical Card Preview */}
                <div className="md:col-span-7 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Aperçu Carte Physique 1:1 (Direct Live)</span>
                  
                  <div className="w-full aspect-[85/54] rounded-xl bg-[#002366] p-4 border border-sky-500/50 flex flex-col justify-between text-white shadow-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-[10px] font-bold text-sky-300">CABINET RE2M</span>
                      <span className="text-[8px] bg-blue-900 px-2 py-0.5 rounded font-semibold">{formData.department}</span>
                    </div>

                    <div>
                      <h4 className="font-serif text-sm font-bold">{formData.civility} {formData.firstName} {formData.lastName || 'NOM'}</h4>
                      <p className="text-[9px] text-sky-200">{formData.title || 'Fonction'}</p>
                    </div>

                    <div className="flex justify-between items-end text-[7.5px] text-slate-300">
                      <div>
                        <p>{formData.email}</p>
                        <p>{formData.mobile}</p>
                      </div>
                      {previewQRUrl && (
                        <img src={previewQRUrl} alt="QR Live" className="w-8 h-8 rounded bg-white p-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Instant Actions */}
                <div className="md:col-span-5 space-y-3">
                  <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Actions Instantanées</span>
                  
                  <button
                    type="button"
                    onClick={() => downloadVCard(formData)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-3 rounded-xl border border-slate-800 flex items-center gap-2 text-xs transition-colors"
                  >
                    <Download className="w-4 h-4 text-sky-300" />
                    <span>Télécharger vCard 4.0</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadMemberPDF(formData)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-3 rounded-xl border border-slate-800 flex items-center gap-2 text-xs transition-colors"
                  >
                    <Printer className="w-4 h-4 text-sky-300" />
                    <span>Imprimer PDF HD Recto/Verso</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeTab > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveTab((activeTab - 1) as any)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Précédent
                </button>
              )}
              {activeTab < 4 && (
                <button
                  type="button"
                  onClick={() => setActiveTab((activeTab + 1) as any)}
                  className="px-4 py-2 rounded-xl bg-blue-950 text-sky-300 text-xs font-semibold hover:bg-blue-900 border border-sky-500/30"
                >
                  Suivant
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-900 via-sky-800 to-sky-600 hover:from-sky-700 hover:to-sky-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 ice-glow cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{member ? 'Enregistrer les Modifications' : 'Créer le Membre RE2M'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
