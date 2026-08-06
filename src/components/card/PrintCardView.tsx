import React, { useEffect, useState } from 'react';
import { Member } from '../../types/member';
import { generateMemberQRCodeDataUrl } from '../../utils/qrCode';
import { downloadMemberPDF, printMemberCard } from '../../utils/pdfPrint';
import { Printer, Download, X } from 'lucide-react';

interface PrintCardViewProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintCardView: React.FC<PrintCardViewProps> = ({ member, isOpen, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && member) {
      generateMemberQRCodeDataUrl(member, 400, false).then(setQrUrl);
    }
  }, [isOpen, member]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel max-w-2xl w-full rounded-3xl p-6 sm:p-8 border-sky-500/40 shadow-2xl space-y-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20 uppercase tracking-wider">
              Format Standard Impression 85×54 mm (300 DPI)
            </span>
            <h3 className="font-serif text-xl font-bold text-white mt-1">
              Version Imprimable HD — Carte Physique Recto/Verso
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area Wrapper */}
        <div id="printable-card-area" className="space-y-8 py-2">
          
          {/* RECTO (Front) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-sky-200">
              <span>RECTO (Face Identité & Coordonnées)</span>
              <span className="text-[10px] text-slate-400">Fond Bleu Royal #002366 • Fond Perdu 3mm</span>
            </div>

            <div className="w-full max-w-[420px] aspect-[85/54] mx-auto rounded-xl bg-[#002366] p-5 border-2 border-sky-500/60 shadow-2xl flex flex-col justify-between relative overflow-hidden text-white">
              
              {/* Top Gold Accent Line */}
              <div className="absolute top-2 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#93C5FD] to-transparent" />
              <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#93C5FD] to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-[11px] font-extrabold tracking-widest text-[#93C5FD]">
                    CABINET RE2M
                  </h4>
                  <p className="text-[7px] text-slate-300 font-medium tracking-wider">
                    CONSULTING & STRATÉGIE
                  </p>
                </div>
                <div className="w-7 h-7 rounded bg-blue-950 p-0.5 border border-sky-500/40">
                  <img src="/logo.svg" alt="RE2M" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Identity */}
              <div className="space-y-0.5">
                <h3 className="font-serif text-sm font-extrabold text-white tracking-wide">
                  {member.civility} {member.firstName} {member.lastName.toUpperCase()}
                </h3>
                <p className="text-[9px] font-semibold text-[#93C5FD]">
                  {member.title}
                </p>
                <span className="inline-block text-[7px] bg-[#1A4C8C] text-white px-2 py-0.5 rounded font-semibold uppercase">
                  Département : {member.department}
                </span>
              </div>

              {/* Coordonnées & Mini QR */}
              <div className="flex items-end justify-between text-[8px] text-slate-200 pt-1 border-t border-sky-500/20">
                <div className="space-y-0.5">
                  <p><strong>Mobile:</strong> {member.mobile}</p>
                  <p><strong>Email:</strong> {member.email}</p>
                  <p><strong>Siège:</strong> {member.address}</p>
                </div>
                {qrUrl && (
                  <div className="w-9 h-9 bg-white p-0.5 rounded shadow">
                    <img src={qrUrl} alt="Mini QR" className="w-full h-full" />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* VERSO (Back) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-sky-200">
              <span>VERSO (Face QR Code & Slogan)</span>
              <span className="text-[10px] text-slate-400">Fond Sombre • Slogan Officiant</span>
            </div>

            <div className="w-full max-w-[420px] aspect-[85/54] mx-auto rounded-xl bg-[#081026] p-5 border-2 border-[#93C5FD] shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
              
              {/* Inner Frame */}
              <div className="absolute inset-2 border border-[#93C5FD]/40 rounded-lg pointer-events-none" />

              <div className="pt-1">
                <h4 className="font-serif text-[10px] font-bold text-[#93C5FD] tracking-widest uppercase">
                  RE2M CONNECT
                </h4>
              </div>

              {/* Large Centered QR */}
              {qrUrl && (
                <div className="w-20 h-20 bg-white p-1 rounded-lg shadow-xl border border-[#93C5FD]">
                  <img src={qrUrl} alt="QR Code Verso" className="w-full h-full" />
                </div>
              )}

              <div className="pb-1 space-y-0.5">
                <p className="text-[9px] font-bold text-white tracking-wide">
                  Réseau Professionnel Digital Cabinet RE2M
                </p>
                <p className="text-[7.5px] text-[#93C5FD] italic">
                  Scannez ce QR Code pour enregistrer la vCard 4.0 et accéder au profil.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => downloadMemberPDF(member)}
            className="flex-1 bg-gradient-to-r from-blue-900 via-sky-800 to-sky-600 hover:from-sky-700 hover:to-sky-500 text-white font-bold py-3.5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger PDF HD Recto/Verso</span>
          </button>

          <button
            onClick={printMemberCard}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 hover:border-sky-500/40 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-sky-300" />
            <span>Imprimer Carte Physique</span>
          </button>
        </div>

      </div>
    </div>
  );
};
