import React from 'react';
import { CertificateTemplate, CertificateData, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT } from './CertificateTemplate';

const SAMPLE_DATA: Omit<CertificateData, 'templateId'> = {
  participantName: 'Jean DUPONT',
  formationTitle: 'Gestion des Achats & Approvisionnements',
  date: new Date().toISOString(),
  signerName: 'Roch-Emmanuel MVE-MBORO',
  signerTitle: 'Directeur Général'
};

interface CertificateTemplatePreviewProps {
  templateId: CertificateData['templateId'];
  width?: number;
  className?: string;
}

// Renders the real certificate template at full size, scaled down to a
// thumbnail — so choosing a model shows exactly what will be generated,
// instead of a plain text card.
export const CertificateTemplatePreview: React.FC<CertificateTemplatePreviewProps> = ({
  templateId,
  width = 220,
  className = ''
}) => {
  const scale = width / CERTIFICATE_WIDTH;
  const height = Math.round(CERTIFICATE_HEIGHT * scale);

  return (
    <div
      style={{ width, height }}
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white shrink-0 ${className}`}
    >
      <div style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <CertificateTemplate {...SAMPLE_DATA} templateId={templateId} />
      </div>
    </div>
  );
};

export default CertificateTemplatePreview;
