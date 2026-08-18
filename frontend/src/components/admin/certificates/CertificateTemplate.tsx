import React from 'react';
import { CertificateTemplateId } from '../../../data/formations';
import { FlourishCorner } from './FlourishCorner';

export interface CertificateData {
  participantName: string;
  formationTitle: string;
  date: string; // ISO
  signerName: string;
  signerTitle: string;
  stampUrl?: string;
  templateId: CertificateTemplateId;
}

const MONTHS_FR = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];

const formatCertDate = (iso: string) => {
  const d = new Date(iso);
  return {
    dayMonth: `${String(d.getDate()).padStart(2, '0')} ${MONTHS_FR[d.getMonth()]}`,
    year: String(d.getFullYear())
  };
};

export const CERTIFICATE_WIDTH = 1200;
export const CERTIFICATE_HEIGHT = 848;

// The real RE2M wordmark (bar-chart + arrow icon, "RE2M", "gagner grâce aux
// achats" tagline) — reproduces the reference certificate exactly instead of
// an approximated hand-drawn icon.
const RE2MLogo: React.FC<{ dark?: boolean }> = ({ dark = true }) => (
  <img
    src="/logo2.png"
    alt="Cabinet RE2M"
    className="h-16 w-auto object-contain"
    style={dark ? undefined : { filter: 'brightness(0) invert(1)' }}
  />
);

const ScallopedSeal: React.FC<{ dayMonth: string; year: string }> = ({ dayMonth, year }) => (
  <div
    className="relative flex flex-col items-center justify-center shrink-0"
    style={{
      width: 148,
      height: 148,
      borderRadius: '50%',
      background: 'repeating-conic-gradient(#F1E1BB 0deg 15deg, #F5E9CC 15deg 30deg)'
    }}
  >
    <div className="absolute rounded-full bg-[#FBF3E1]" style={{ inset: 11 }} />
    <div className="relative text-center" style={{ fontFamily: 'Georgia, serif' }}>
      <p className="text-sm tracking-wide text-[#3a2e22]">{dayMonth}</p>
      <p className="text-3xl font-bold text-[#3a2e22] leading-none mt-1.5">{year}</p>
    </div>
  </div>
);

const SignatureBlock: React.FC<{ signerName: string; signerTitle: string; stampUrl?: string; light?: boolean }> = ({
  signerName,
  signerTitle,
  stampUrl,
  light
}) => (
  <div className={`relative flex-1 border-t pt-3 ${light ? 'border-white/40' : 'border-slate-400'}`}>
    {stampUrl && (
      <img
        src={stampUrl}
        alt="Cachet"
        className="absolute -top-20 left-6 w-24 h-24 object-contain opacity-90 pointer-events-none"
      />
    )}
    <p className={`text-sm leading-relaxed ${light ? 'text-white/90' : 'text-[#3a2e22]'}`} style={{ fontFamily: 'Georgia, serif' }}>
      SIGNÉ PAR <em>{signerName}</em>, {signerTitle}
    </p>
  </div>
);

export const CertificateTemplate: React.FC<CertificateData> = ({
  participantName,
  formationTitle,
  date,
  signerName,
  signerTitle,
  stampUrl,
  templateId
}) => {
  const { dayMonth, year } = formatCertDate(date);

  if (templateId === 'moderne') {
    return (
      <div
        style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, fontFamily: 'Georgia, serif' }}
        className="relative bg-white flex flex-col"
      >
        <div className="h-40 bg-[#002366] flex items-center justify-between px-16 shrink-0">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-blue-200 font-semibold">CABINET RE2M</p>
            <h1 className="text-3xl font-extrabold text-white tracking-wide mt-1">ATTESTATION DE FORMATION</h1>
          </div>
          <RE2MLogo dark={false} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-24">
          <p className="text-xs tracking-[0.3em] text-slate-400 font-semibold">DÉCERNÉ À</p>
          <h2 className="text-5xl text-[#002366] font-bold mt-4 mb-4">{participantName}</h2>
          <div className="w-24 h-1 bg-[#C9A24B] rounded-full mb-6" />
          <p className="text-xs tracking-[0.2em] text-slate-400 font-semibold">POUR SA PARTICIPATION À LA FORMATION</p>
          <h3 className="text-xl font-bold text-[#0f172a] mt-3 max-w-2xl">{formationTitle.toUpperCase()}</h3>
        </div>

        <div className="flex items-end justify-between px-16 pb-14 shrink-0">
          <ScallopedSeal dayMonth={dayMonth} year={year} />
          <SignatureBlock signerName={signerName} signerTitle={signerTitle} stampUrl={stampUrl} />
          <div className="ml-10"><RE2MLogo /></div>
        </div>
      </div>
    );
  }

  if (templateId === 'corporate') {
    return (
      <div
        style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, fontFamily: 'Georgia, serif' }}
        className="relative bg-white flex flex-col"
      >
        <div className="h-3 bg-gradient-to-r from-[#002366] via-[#C9A24B] to-[#002366] shrink-0" />
        <div className="absolute inset-6 border border-slate-300" />

        <div className="flex-1 flex flex-col items-center justify-center text-center px-20 relative z-10">
          <RE2MLogo />
          <h1 className="text-4xl font-extrabold text-[#002366] tracking-[0.15em] mt-8">ATTESTATION DE FORMATION</h1>
          <p className="text-xs tracking-[0.3em] text-slate-400 font-semibold mt-8">DÉCERNÉ À</p>
          <h2 className="text-4xl text-[#0f172a] font-bold mt-3 border-b-2 border-[#C9A24B] pb-3 px-8">{participantName}</h2>
          <p className="text-xs tracking-[0.2em] text-slate-400 font-semibold mt-8">POUR SA PRÉCIEUSE CONTRIBUTION À</p>
          <h3 className="text-lg font-bold text-[#002366] mt-3 max-w-2xl uppercase">{formationTitle}</h3>
        </div>

        <div className="flex items-end justify-between px-20 pb-16 relative z-10 shrink-0">
          <ScallopedSeal dayMonth={dayMonth} year={year} />
          <SignatureBlock signerName={signerName} signerTitle={signerTitle} stampUrl={stampUrl} />
        </div>
      </div>
    );
  }

  // Default: 're2m-classique' — reproduces the reference template. Uses a
  // full-height flex column (like the other two templates) so the middle
  // content is vertically centered in whatever space remains above the
  // seal/signature row, instead of leaving a dead gap when the content is
  // shorter than the fixed canvas height.
  return (
    <div
      style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, fontFamily: 'Georgia, serif' }}
      className="relative bg-white flex flex-col"
    >
      <div className="absolute inset-6 border border-slate-300" />

      <FlourishCorner className="absolute top-3 left-3" />
      <div className="absolute top-3 right-3" style={{ transform: 'scaleX(-1)' }}><FlourishCorner /></div>
      <div className="absolute bottom-3 left-3" style={{ transform: 'scaleY(-1)' }}><FlourishCorner /></div>
      <div className="absolute bottom-3 right-3" style={{ transform: 'scale(-1,-1)' }}><FlourishCorner /></div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-24 relative z-10">
        <h1 className="text-6xl font-bold text-[#3a2e22] tracking-[0.05em]" style={{ fontFamily: 'Georgia, serif' }}>
          ATTESTATION DE FORMATION
        </h1>

        <p className="text-sm tracking-[0.3em] text-slate-500 font-semibold mt-10">DÉCERNÉ À</p>

        <div className="border-t border-b border-slate-400 mt-3 px-14 py-3">
          <h2 className="text-6xl text-[#3a2e22]">{participantName}</h2>
        </div>

        <p className="text-sm tracking-[0.25em] text-slate-500 font-semibold mt-10">POUR SA PRÉCIEUSE CONTRIBUTION À</p>

        <div className="flex items-center gap-5 mt-5">
          <span className="text-[#C9A24B] text-2xl">❧</span>
          <h3 className="text-2xl font-bold text-[#0f172a] tracking-wide max-w-3xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {formationTitle.toUpperCase()}
          </h3>
          <span className="text-[#C9A24B] text-2xl scale-x-[-1]">❧</span>
        </div>
      </div>

      <div className="flex items-end justify-between px-24 pb-16 relative z-10 shrink-0">
        <ScallopedSeal dayMonth={dayMonth} year={year} />
        <SignatureBlock signerName={signerName} signerTitle={signerTitle} stampUrl={stampUrl} />
        <div className="ml-10"><RE2MLogo /></div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
