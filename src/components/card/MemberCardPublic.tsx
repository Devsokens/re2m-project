import React, { useState } from 'react';
import { Member } from '../../types/member';
import { downloadVCard } from '../../utils/vcard';
import { QRCodeModal } from './QRCodeModal';
import { PrintCardView } from './PrintCardView';
import { 
  Phone, Mail, MapPin, Linkedin, Globe, QrCode, Share2, Printer, 
  Download, Sparkles, Building2, Check 
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
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center">
      
      {/* Main Glass Virtual Card Container */}
      <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 border-2 border-sky-500/40 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Background Subtle Gradient Lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Brand Emblem */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-sky-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950 p-1 border border-sky-500/40 shadow-lg">
              <img src="/logo.svg" alt="RE2M Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white tracking-wider">
                CABINET RE2M
              </h2>
              <p className="text-xs text-sky-300 font-semibold">
                CARTE MEMBRE VIRTUELLE OFFICIELLE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-sky-500/10 text-sky-200 text-xs font-semibold px-3 py-1 rounded-full border border-sky-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Statut: {member.status === 'active' ? 'Membre Actif' : 'En Attente'}
            </span>
          </div>
        </div>

        {/* Consultant Identity Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar Badge */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-blue-900 via-sky-600/30 to-slate-900 border-2 border-sky-500/50 flex items-center justify-center font-serif text-3xl sm:text-4xl font-extrabold text-sky-200 shadow-2xl shrink-0">
            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
          </div>

          {/* Details */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-block bg-blue-950 text-sky-300 text-xs font-bold px-3 py-1 rounded-lg border border-sky-500/30 uppercase tracking-widest">
              Département : {member.department}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              {member.civility} {member.firstName} {member.lastName}
            </h1>
            <p className="text-base sm:text-lg text-sky-200 font-medium">
              {member.title}
            </p>
            
            {member.bio && (
              <p className="text-xs sm:text-sm text-slate-300 italic pt-2 leading-relaxed max-w-xl">
                « {member.bio} »
              </p>
            )}
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          
          {/* Mobile Phone */}
          <a
            href={`tel:${member.mobile}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-sky-500/30 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Téléphone Mobile</p>
              <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{member.mobile}</p>
            </div>
          </a>

          {/* Landline Phone if present */}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-sky-500/30 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Téléphone Fixe</p>
                <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{member.phone}</p>
              </div>
            </a>
          )}

          {/* Email */}
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-sky-500/30 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Email Professionnel</p>
              <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors truncate">{member.email}</p>
            </div>
          </a>

          {/* Address */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-sky-500/30 flex items-center justify-center text-sky-300 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Adresse Siège</p>
              <p className="text-xs font-medium text-white">{member.address}</p>
            </div>
          </div>

          {/* LinkedIn if present */}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-sky-500/30 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">LinkedIn</p>
                <p className="text-xs font-medium text-sky-200 truncate">{member.linkedin}</p>
              </div>
            </a>
          )}

          {/* Website if present */}
          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-sky-500/30 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Site Web</p>
                <p className="text-xs font-medium text-sky-200 truncate">{member.website}</p>
              </div>
            </a>
          )}

        </div>

        {/* Primary Actions Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Actions Instantanées
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Download vCard */}
            <button
              onClick={handleDownloadVCard}
              className="bg-gradient-to-r from-blue-900 via-sky-800 to-sky-600 hover:from-sky-700 hover:to-sky-500 text-white font-bold p-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs ice-glow cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ajouter aux Contacts (.vcf)</span>
            </button>

            {/* View QR Code */}
            <button
              onClick={() => setShowQRModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold p-3.5 rounded-2xl border border-sky-500/30 hover:border-sky-500/60 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-sky-300" />
              <span>Voir QR Code</span>
            </button>

            {/* Share via Web Share API */}
            <button
              onClick={handleShare}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold p-3.5 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-sky-300" />}
              <span>{copiedLink ? 'Lien Copié !' : 'Partager la Carte'}</span>
            </button>

            {/* Printable Version 85x54 mm */}
            <button
              onClick={() => setShowPrintModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold p-3.5 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-sky-300" />
              <span>Version Imprimable</span>
            </button>
          </div>
        </div>

        {/* Card Footer Info */}
        <div className="text-center pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Cabinet RE2M • Carte # {member.id}</span>
          <span className="text-sky-300 font-medium">Scans enregistrés : {member.scanCount}</span>
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
