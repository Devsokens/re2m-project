import React, { useState } from 'react';
import { Member } from '../../types/member';
import { downloadVCard } from '../../utils/vcard';
import { QRCodeModal } from './QRCodeModal';
import { PrintCardView } from './PrintCardView';
import { 
  Phone, Mail, MapPin, Linkedin, Globe, QrCode, Share2, Printer, 
  Download, Sparkles, Building2, Check, ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemberCardPublicProps {
  member: Member;
  onBackToHome?: () => void;
}

export const MemberCardPublic: React.FC<MemberCardPublicProps> = ({ member, onBackToHome }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownloadVCard = () => {
    downloadVCard(member);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/c/${member.id}`;
    const shareData = {
      title: `Carte Membre ${member.firstName} ${member.lastName} — Cabinet RE2M`,
      text: `${member.civility} ${member.firstName} ${member.lastName} • ${member.title} au Cabinet RE2M`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center bg-slate-50 text-[#0f172a]">
      
      {/* Back to Previous Navigation Arrow */}
      {onBackToHome && (
        <div className="w-full max-w-2xl mb-4 flex justify-start animate-fadeIn">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#002366] bg-white border border-slate-200 hover:border-[#002366] px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Retour</span>
          </button>
        </div>
      )}

      {/* Main Corporate Virtual Card Container */}
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 relative overflow-hidden">
        
        {/* Subtle Watermark Logo in Card Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.08] z-0">
          <img src="/logo2.png" alt="Cabinet RE2M Watermark" className="w-[85%] h-auto object-contain max-h-[85%]" />
        </div>

        {/* Background Subtle Gradient Lighting (Matching Frontend Theme) */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#002366]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Brand Emblem */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center shrink-0">
              <img src="/logo2.png" alt="Cabinet RE2M Logo" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <h2 className="font-sans text-base font-black text-[#002366] tracking-wider uppercase">
                CABINET RE2M
              </h2>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                CARTE MEMBRE VIRTUELLE OFFICIELLE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {member.status === 'active' ? 'Membre Actif' : 'En Attente'}
            </span>
          </div>
        </div>

        {/* Consultant Identity Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar Badge with Member Photo (or Cabinet Logo fallback) */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white flex items-center justify-center p-2 relative z-10">
            <img 
              src={member.photo || "/logo2.png"} 
              alt={member.photo ? `${member.firstName} ${member.lastName}` : "Cabinet RE2M Logo"} 
              className={`w-full h-full ${member.photo ? 'object-cover rounded-2xl' : 'object-contain'}`} 
            />
          </div>

          {/* Details */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-block bg-blue-50 text-blue-800 text-[10px] font-extrabold px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
              Département : {member.department}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366]">
              {member.civility} {member.firstName} {member.lastName}
            </h1>
            <p className="text-sm sm:text-base text-slate-550 font-bold">
              {member.title}
            </p>
            
            {member.bio && (
              <p className="text-xs sm:text-sm text-slate-500 italic pt-2 leading-relaxed max-w-xl">
                « {member.bio} »
              </p>
            )}
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 relative z-10">
          
          {/* Mobile Phone */}
          <a
            href={`tel:${member.mobile}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#002366] transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] group-hover:scale-105 transition-transform shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Téléphone Mobile</p>
              <p className="text-sm font-bold text-[#002366] group-hover:text-blue-900 transition-colors">{member.mobile}</p>
            </div>
          </a>

          {/* Landline Phone if present */}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#002366] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] group-hover:scale-105 transition-transform shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold">Téléphone Fixe</p>
                <p className="text-sm font-bold text-[#002366] group-hover:text-blue-900 transition-colors">{member.phone}</p>
              </div>
            </a>
          )}

          {/* Email */}
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#002366] transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] group-hover:scale-105 transition-transform shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] text-slate-400 uppercase font-bold">Email Professionnel</p>
              <p className="text-sm font-bold text-[#002366] group-hover:text-blue-900 transition-colors truncate">{member.email}</p>
            </div>
          </a>

          {/* Address */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Adresse Siège</p>
              <p className="text-xs font-semibold text-[#002366]">{member.address}</p>
            </div>
          </div>

          {/* LinkedIn if present */}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#002366] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] group-hover:scale-105 transition-transform shrink-0">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] text-slate-400 uppercase font-bold">LinkedIn</p>
                <p className="text-xs font-bold text-blue-900 truncate">{member.linkedin}</p>
              </div>
            </a>
          )}

          {/* Website if present */}
          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#002366] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] group-hover:scale-105 transition-transform shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] text-slate-400 uppercase font-bold">Site Web</p>
                <p className="text-xs font-bold text-blue-900 truncate">{member.website}</p>
              </div>
            </a>
          )}

        </div>

        {/* Primary Actions Grid */}
        <div className="space-y-4 relative z-10">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Actions Instantanées
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Download vCard */}
            <button
              onClick={handleDownloadVCard}
              className="bg-[#002366] hover:bg-blue-900 text-white font-bold p-3.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ajouter aux Contacts</span>
            </button>

            {/* View QR Code */}
            <button
              onClick={() => setShowQRModal(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold p-3.5 rounded-2xl border border-slate-200 hover:border-[#002366] hover:text-[#002366] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#002366]" />
              <span>Voir QR Code</span>
            </button>

            {/* Share via Web Share API */}
            <button
              onClick={handleShare}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold p-3.5 rounded-2xl border border-slate-200 hover:border-[#002366] hover:text-[#002366] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#002366]" />}
              <span>{copiedLink ? 'Lien Copié !' : 'Partager'}</span>
            </button>

            {/* Printable Version 85x54 mm */}
            <button
              onClick={() => setShowPrintModal(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold p-3.5 rounded-2xl border border-slate-200 hover:border-[#002366] hover:text-[#002366] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#002366]" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* Card Footer Info */}
        <div className="text-center pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 relative z-10">
          <span>Cabinet RE2M • Carte # {member.id}</span>
          <span className="text-[#002366] font-bold">Scans enregistrés : {member.scanCount}</span>
        </div>

      </div>

      {/* QR Code Modal Popup */}
      <QRCodeModal
        member={member}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />

      {/* Print View Modal */}
      <PrintCardView
        member={member}
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
      />
    </div>
  );
};
export default MemberCardPublic;
