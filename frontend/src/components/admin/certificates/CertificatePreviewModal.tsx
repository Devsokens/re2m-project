import React from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import { CertificateTemplate, CertificateData, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT } from './CertificateTemplate';

interface CertificatePreviewModalProps {
  data: CertificateData | null;
  onClose: () => void;
  onDownload: () => void;
}

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({ data, onClose, onDownload }) => {
  if (!data) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-scaleUp">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="text-xs font-bold text-[#002366]">Aperçu — {data.participantName}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-3 py-1.5 rounded-lg bg-[#002366] hover:bg-blue-900 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Télécharger
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 bg-slate-100 overflow-auto flex items-center justify-center" style={{ maxHeight: '75vh' }}>
          <div style={{ width: CERTIFICATE_WIDTH * 0.5, height: CERTIFICATE_HEIGHT * 0.5, overflow: 'hidden' }}>
            <div style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, transform: 'scale(0.5)', transformOrigin: 'top left', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
              <CertificateTemplate {...data} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CertificatePreviewModal;
