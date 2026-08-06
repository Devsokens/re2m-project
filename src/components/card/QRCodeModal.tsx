import React, { useEffect, useState } from 'react';
import { Member } from '../../types/member';
import { generateMemberQRCodeDataUrl } from '../../utils/qrCode';
import { X, Download, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ member, isOpen, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && member) {
      generateMemberQRCodeDataUrl(member, 600, true).then(setQrUrl);
    }
  }, [isOpen, member]);

  if (!isOpen) return null;

  const handleDownloadQR = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `qrcode_${member.firstName}_${member.lastName}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-md w-full rounded-3xl p-6 border-sky-500/40 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs font-semibold">
            <QrCode className="w-4 h-4" /> QR CODE INDIVIDUEL RE2M
          </div>
          <h3 className="font-serif text-xl font-bold text-white">
            {member.civility} {member.firstName} {member.lastName}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {member.title} • Cabinet RE2M
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
          {qrUrl ? (
            <div className="p-3 bg-white rounded-xl shadow-2xl border-4 border-sky-500/40">
              <img src={qrUrl} alt="QR Code RE2M" className="w-56 h-56 object-contain" />
            </div>
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-500 text-xs animate-pulse">
              Génération du QR Code HD...
            </div>
          )}

          <p className="text-[11px] text-slate-400 text-center max-w-xs">
            Encodage haute résolution (300px/600px). Scannez pour rediriger immédiatement vers la carte virtuelle.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownloadQR}
            className="flex-1 bg-gradient-to-r from-blue-900 via-sky-800 to-sky-600 hover:from-sky-700 hover:to-sky-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger QR (PNG HD)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
