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
      generateMemberQRCodeDataUrl(member, 400, true).then(setQrUrl);
    }
  }, [isOpen, member]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn text-[#0f172a]">
      <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
              Format Standard Impression 85×54 mm (300 DPI)
            </span>
            <h3 className="font-serif text-lg font-bold text-[#002366] pt-1">
              Version Imprimable HD — Carte Physique Recto/Verso
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area Wrapper */}
        <div id="printable-card-area" className="space-y-8 py-2">
          
          {/* RECTO (Front) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-655">
              <span>RECTO (Face Identité & Coordonnées)</span>
              <span className="text-[10px] text-slate-400 font-medium">Fond Bleu Royal #002366 • Fond Perdu 3mm</span>
            </div>

            <div className="w-full max-w-[420px] aspect-[85/54] mx-auto rounded-xl bg-[#002366] p-5 border border-blue-900 shadow-lg flex flex-col justify-between relative overflow-hidden text-white">
              
              {/* Decorative Accent Lines */}
              <div className="absolute top-2 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />
              <div className="absolute bottom-2 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-[11px] font-extrabold tracking-widest text-blue-200">
                    CABINET RE2M
                  </h4>
                  <p className="text-[7px] text-slate-300 font-medium tracking-wider">
                    CONSULTING & STRATÉGIE
                  </p>
                </div>
                <div className="w-7 h-7 rounded bg-[#001845] p-0.5 border border-blue-900">
                  <img src="/logo1.png" alt="RE2M" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Identity */}
              <div className="space-y-0.5">
                <h3 className="font-serif text-xs font-black text-white tracking-wide">
                  {member.civility} {member.firstName} {member.lastName.toUpperCase()}
                </h3>
                <p className="text-[9px] font-semibold text-blue-200">
                  {member.title}
                </p>
                <span className="inline-block text-[7px] bg-[#00348c] text-white px-2 py-0.5 rounded font-bold uppercase">
                  Département : {member.department}
                </span>
              </div>

              {/* Coordonnées & Mini QR */}
              <div className="flex items-end justify-between text-[8px] text-slate-200 pt-1.5 border-t border-blue-900/40">
                <div className="space-y-0.5">
                  <p><strong>Mobile:</strong> {member.mobile}</p>
                  <p><strong>Email:</strong> {member.email}</p>
                  <p><strong>Siège:</strong> {member.address}</p>
                </div>
                {qrUrl && (
                  <div className="w-9 h-9 bg-white p-0.5 rounded shadow">
                    <img src={qrUrl} alt="Mini QR" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* VERSO (Back) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-655">
              <span>VERSO (Face QR Code & Slogan)</span>
              <span className="text-[10px] text-slate-400 font-medium">Fond Sombre • Slogan Officiant</span>
            </div>

            <div className="w-full max-w-[420px] aspect-[85/54] mx-auto rounded-xl bg-[#001845] p-5 border border-blue-950 shadow-lg flex flex-col items-center justify-between text-center relative overflow-hidden text-white">
              
              {/* Inner Frame */}
              <div className="absolute inset-2 border border-blue-800/30 rounded-lg pointer-events-none" />

              <div className="pt-1">
                <h4 className="font-sans text-[10px] font-extrabold text-blue-200 tracking-widest uppercase">
                  RE2M CONNECT
                </h4>
              </div>

              {/* Large Centered QR */}
              {qrUrl && (
                <div className="w-20 h-20 bg-white p-1 rounded-lg shadow-xl border border-slate-100">
                  <img src={qrUrl} alt="QR Code Verso" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="pb-1 space-y-0.5">
                <p className="text-[9px] font-bold text-white tracking-wide">
                  Réseau Professionnel Digital Cabinet RE2M
                </p>
                <p className="text-[7.5px] text-blue-200 italic">
                  Scannez ce QR Code pour enregistrer la vCard 4.0 et accéder au profil.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => downloadMemberPDF(member)}
            className="flex-1 bg-[#002366] hover:bg-blue-900 text-white font-bold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger PDF HD Recto/Verso</span>
          </button>

          <button
            onClick={printMemberCard}
            className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-[#002366] hover:text-[#002366] transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#002366]" />
            <span>Imprimer la Carte</span>
          </button>
        </div>

      </div>
    </div>
  );
};
export default PrintCardView;
