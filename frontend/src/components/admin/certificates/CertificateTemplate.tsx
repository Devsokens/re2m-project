import React from 'react';
import { CertificateTemplateId } from '../../../data/formations';

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
        style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif" }}
        className="relative bg-[#FAFAFC] overflow-hidden select-none flex flex-col justify-between"
      >
        {/* Subtle geometric grid / security background pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="modern-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#002366" strokeWidth="1" />
              <circle cx="40" cy="40" r="1.5" fill="#C9A24B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#modern-grid)" />
        </svg>

        {/* Left architectural luxury pillar (Navy & Gold geometric layers) */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-[#0B1E3F] flex flex-col justify-between items-center py-10 z-10">
          <div className="w-1 h-32 bg-gradient-to-b from-transparent via-[#C9A24B] to-transparent opacity-80" />
          <div className="writing-mode-vertical text-[11px] tracking-[0.4em] font-bold text-[#C9A24B] uppercase rotate-180 select-none">
            RE2M • EXCELLENCE & EXPERTISE
          </div>
          <div className="w-1 h-32 bg-gradient-to-b from-transparent via-[#C9A24B] to-transparent opacity-80" />
        </div>
        <div className="absolute top-0 bottom-0 left-24 w-1.5 bg-[#C9A24B] z-10 opacity-90" />
        <div className="absolute top-0 bottom-0 left-[102px] w-0.5 bg-[#002366]/20 z-10" />

        {/* Top-Right modern geometric corner accent */}
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0B1E3F] rotate-45" />
          <div className="absolute -top-20 -right-20 w-48 h-48 border-2 border-[#C9A24B] rotate-45 opacity-60" />
        </div>

        {/* Main Content Container with left offset for architectural pillar */}
        <div className="pl-36 pr-16 pt-12 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-8 bg-[#C9A24B]" />
              <span className="text-[12px] tracking-[0.35em] font-bold text-[#002366] uppercase">
                CABINET DE CONSEIL & FORMATION
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-[#0B1E3F] tracking-[0.12em] uppercase mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              ATTESTATION DE FORMATION
            </h1>
            <p className="text-[13px] text-slate-500 font-medium tracking-wide mt-1">
              Certificat professionnel attestant de la réussite et des compétences acquises
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl shadow-md border border-slate-100">
            <RE2MLogo />
          </div>
        </div>

        {/* Center Recipient & Formation Section */}
        <div className="pl-36 pr-16 flex-1 flex flex-col justify-center my-4 z-10">
          <div className="flex items-center gap-4">
            <span className="text-[12px] tracking-[0.3em] font-bold text-slate-400 uppercase">DÉCERNÉ AVEC DISTINCTION À</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-300 to-transparent" />
          </div>

          <div className="mt-3 mb-5">
            <h2
              className="text-5xl font-bold text-[#0B1E3F] tracking-tight"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: participantName.length > 35 ? '34px' : participantName.length > 25 ? '42px' : '50px'
              }}
            >
              {participantName}
            </h2>
            <div className="h-1.5 w-36 bg-gradient-to-r from-[#C9A24B] via-[#E5C158] to-transparent rounded-full mt-3" />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[12px] tracking-[0.25em] font-bold text-slate-400 uppercase">POUR AVOIR SUIVI ET VALIDÉ LA FORMATION</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-300 to-transparent" />
          </div>

          <div className="mt-3 p-5 rounded-xl bg-gradient-to-r from-[#0B1E3F]/5 via-[#C9A24B]/10 to-transparent border-l-4 border-[#0B1E3F] max-w-3xl">
            <h3
              className="text-2xl font-extrabold text-[#0B1E3F] uppercase tracking-wide"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: formationTitle.length > 60 ? '18px' : '22px'
              }}
            >
              {formationTitle}
            </h3>
          </div>
        </div>

        {/* Bottom Details (Seal Badge & Signature) */}
        <div className="pl-36 pr-16 pb-12 flex items-end justify-between z-10 shrink-0">
          {/* Modern Geometric Holographic-style Octagonal Badge */}
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 100">
                <polygon points="50,2 85,15 98,50 85,85 50,98 15,85 2,50 15,15" fill="#0B1E3F" stroke="#C9A24B" strokeWidth="2.5" />
                <polygon points="50,8 79,19 90,50 79,81 50,92 21,81 10,50 21,19" fill="#0F2B5B" stroke="#E5C158" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="50" cy="50" r="30" fill="#0B1E3F" stroke="#C9A24B" strokeWidth="1.5" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold tracking-widest text-[#E5C158] uppercase">{dayMonth}</span>
                <span className="text-xl font-extrabold text-white leading-none mt-0.5">{year}</span>
                <span className="text-[8px] font-semibold tracking-wider text-blue-200 mt-1">CERTIFIED</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0B1E3F] tracking-widest uppercase">ATTESTATION OFFICIELLE</p>
              <p className="text-[11px] text-slate-500 font-medium">Cabinet RE2M • Formation Certifiante</p>
            </div>
          </div>

          {/* Signature Block */}
          <div className="relative min-w-[340px]">
            {stampUrl && (
              <img
                src={stampUrl}
                alt="Cachet"
                className="absolute -top-24 left-10 w-28 h-28 object-contain opacity-85 pointer-events-none"
                style={{ transform: 'rotate(-4deg)' }}
              />
            )}
            <div className="w-full h-[1.5px] bg-[#0B1E3F] mb-3" />
            <p className="text-[14px] text-[#0B1E3F]">
              <span className="font-bold text-[12px] tracking-wider text-slate-500 uppercase">SIGNÉ PAR : </span>
              <span className="font-bold text-[#0B1E3F]" style={{ fontFamily: "'Georgia', serif" }}>{signerName}</span>
            </p>
            <p className="text-[13px] text-slate-600 font-medium mt-0.5">
              {signerTitle}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'corporate') {
    return (
      <div
        style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, fontFamily: "'Georgia', serif" }}
        className="relative bg-[#FCFBF7] overflow-hidden select-none flex flex-col justify-between"
      >
        {/* Double Guilloche / Prestige Ornate Security Border Frame */}
        <div className="absolute inset-5 border-[3px] border-[#0A1A3A] pointer-events-none z-10" />
        <div className="absolute inset-7 border border-[#C9A24B] pointer-events-none z-10" />
        <div className="absolute inset-9 border border-[#0A1A3A]/20 pointer-events-none z-10" />

        {/* Ornate Gold Corner Medallions */}
        {['top-5 left-5', 'top-5 right-5 rotate-90', 'bottom-5 left-5 -rotate-90', 'bottom-5 right-5 rotate-180'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-16 h-16 pointer-events-none z-20`}>
            <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
              <path d="M0,0 L60,0 L60,8 L8,8 L8,60 L0,60 Z" fill="#0A1A3A" />
              <path d="M12,12 L45,12 L45,16 L16,16 L16,45 L12,45 Z" fill="#C9A24B" />
              <circle cx="28" cy="28" r="5" fill="#C9A24B" />
              <circle cx="28" cy="28" r="2.5" fill="#0A1A3A" />
            </svg>
          </div>
        ))}

        {/* Top Header Crest with Laurel Wreaths */}
        <div className="pt-12 px-20 text-center relative z-20 flex flex-col items-center">
          <div className="flex items-center justify-center gap-6">
            <svg className="w-16 h-8 text-[#C9A24B]" viewBox="0 0 100 40" fill="currentColor">
              <path d="M50 35 C30 30 15 20 5 0 C15 15 30 25 50 30 C70 25 85 15 95 0 C85 20 70 30 50 35 Z" opacity="0.8" />
              <circle cx="50" cy="12" r="4" />
              <circle cx="35" cy="18" r="3" />
              <circle cx="65" cy="18" r="3" />
            </svg>
            <div className="flex flex-col items-center">
              <p className="text-[12px] tracking-[0.4em] font-bold text-[#C9A24B] uppercase">CABINET RE2M • INSTITUT DE FORMATION</p>
              <h1 className="text-4xl font-extrabold text-[#0A1A3A] tracking-[0.2em] uppercase mt-1" style={{ fontFamily: "'Georgia', 'Cinzel', serif" }}>
                CERTIFICAT DE FORMATION
              </h1>
            </div>
            <svg className="w-16 h-8 text-[#C9A24B] scale-x-[-1]" viewBox="0 0 100 40" fill="currentColor">
              <path d="M50 35 C30 30 15 20 5 0 C15 15 30 25 50 30 C70 25 85 15 95 0 C85 20 70 30 50 35 Z" opacity="0.8" />
              <circle cx="50" cy="12" r="4" />
              <circle cx="35" cy="18" r="3" />
              <circle cx="65" cy="18" r="3" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-24 bg-[#C9A24B]" />
            <span className="text-[#C9A24B] text-sm">✦</span>
            <span className="text-[12px] tracking-[0.3em] font-semibold text-slate-500 uppercase">DIPLÔME PROFESSIONNEL OFFICIEL</span>
            <span className="text-[#C9A24B] text-sm">✦</span>
            <div className="h-[1px] w-24 bg-[#C9A24B]" />
          </div>
        </div>

        {/* Center Recipient Section */}
        <div className="px-20 text-center relative z-20 flex-1 flex flex-col justify-center my-2">
          <p className="text-[13px] tracking-[0.35em] text-slate-500 font-semibold uppercase">
            CE PRÉSENT DOCUMENT EST DÉCERNÉ À
          </p>

          <div className="my-3 py-2 flex items-center justify-center">
            <div className="relative inline-block px-12 py-2">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent" />
              <h2
                className="text-5xl font-bold text-[#0A1A3A] tracking-tight"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: participantName.length > 35 ? '32px' : participantName.length > 25 ? '40px' : '48px'
                }}
              >
                {participantName}
              </h2>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent" />
            </div>
          </div>

          <p className="text-[13px] tracking-[0.25em] text-slate-500 font-semibold uppercase mt-1">
            EN RECONNAISSANCE DE SON ASSIDUITÉ ET DE SA RÉUSSITE DU PROGRAMME
          </p>

          {/* Prestige Cartouche for Formation Title */}
          <div className="mt-4 mx-auto max-w-3xl px-8 py-4 bg-white/80 border border-[#C9A24B]/60 rounded-lg shadow-sm">
            <h3
              className="text-xl font-bold text-[#0A1A3A] uppercase tracking-wide leading-relaxed"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {formationTitle}
            </h3>
          </div>
        </div>

        {/* Bottom Row: Imperial Medallion Seal, Logo & Official Signature */}
        <div className="px-20 pb-12 flex items-end justify-between relative z-20 shrink-0">
          {/* Imperial Sunburst Gold Medallion with Ribbon Tails */}
          <div className="relative flex items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Ribbon Tails */}
              <div className="absolute -bottom-5 left-7 w-6 h-14 bg-[#B38728] rotate-[20deg] shadow" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
              <div className="absolute -bottom-5 right-7 w-6 h-14 bg-[#8E691A] -rotate-[20deg] shadow" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
              
              {/* Starburst gold medal */}
              <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 120 120">
                <defs>
                  <radialGradient id="gold-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF2B2" />
                    <stop offset="45%" stopColor="#E5C158" />
                    <stop offset="85%" stopColor="#B38728" />
                    <stop offset="100%" stopColor="#8E691A" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="54" fill="url(#gold-grad)" stroke="#8E691A" strokeWidth="1.5" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3,2" />
                <circle cx="60" cy="60" r="41" fill="#0A1A3A" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-bold tracking-widest text-[#E5C158] uppercase">{dayMonth}</span>
                <span className="text-2xl font-bold text-white leading-none my-0.5">{year}</span>
                <span className="text-[8px] tracking-[0.2em] font-bold text-[#E5C158] uppercase">PRESTIGE</span>
              </div>
            </div>
          </div>

          {/* Official Signatures & Institutional RE2M Brand */}
          <div className="flex items-center gap-12">
            <div className="relative min-w-[300px]">
              {stampUrl && (
                <img
                  src={stampUrl}
                  alt="Cachet"
                  className="absolute -top-20 left-10 w-28 h-28 object-contain opacity-90 pointer-events-none"
                  style={{ transform: 'rotate(-4deg)' }}
                />
              )}
              <div className="w-full border-t-2 border-[#0A1A3A] pt-2">
                <p className="text-[14px] text-[#0A1A3A]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">SIGNÉ PAR : </span>
                  <span className="font-bold italic text-[#0A1A3A]">{signerName}</span>
                </p>
                <p className="text-[12px] text-slate-600 font-medium mt-0.5">
                  {signerTitle}
                </p>
              </div>
            </div>
            <div className="pl-6 border-l border-slate-300">
              <RE2MLogo />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper for title splitting in signature
  const renderSignerTitle = (title: string) => {
    if (!title) return null;
    if (title.includes('\n')) {
      const [first, ...rest] = title.split('\n');
      return (
        <>
          <span style={{ fontFamily: "'Georgia', serif" }}>, {first}</span>
          <span className="block mt-0.5" style={{ fontFamily: "'Georgia', serif" }}>
            {rest.join(' ')}
          </span>
        </>
      );
    }
    if (title.includes('Directeur-Expert')) {
      const remaining = title.replace(/^Directeur-Expert[, ]*/, '');
      return (
        <>
          <span style={{ fontFamily: "'Georgia', serif" }}>, Directeur-Expert</span>
          {remaining && (
            <span className="block mt-0.5" style={{ fontFamily: "'Georgia', serif" }}>
              {remaining}
            </span>
          )}
        </>
      );
    }
    return <span style={{ fontFamily: "'Georgia', serif" }}>, {title}</span>;
  };

  // Default: 're2m-classique' — faithful pixel-perfect reproduction of the authentic baroque RE2M certificate
  return (
    <div
      style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT }}
      className="relative bg-white overflow-hidden select-none"
    >
      {/* High-res vector artwork background layer containing baroque frames, flourishes, seal base, double rules, signature rule, and RE2M logo */}
      <img
        src="/certificate_bg_re2m_clean.png"
        alt=""
        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
      />

      {/* Header title */}
      <h1
        className="absolute left-0 right-0 text-center text-[#201407] font-normal"
        style={{
          top: '176px',
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: '44px',
          letterSpacing: '0.06em',
          lineHeight: 1.1
        }}
      >
        ATTESTATION DE FORMATION
      </h1>

      {/* Subtitle */}
      <p
        className="absolute left-0 right-0 text-center font-semibold text-[#6e6e6e]"
        style={{
          top: '248px',
          fontFamily: "'Franklin Gothic Medium', 'Franklin Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '14px',
          letterSpacing: '0.24em'
        }}
      >
        DECERNE A
      </p>

      {/* Recipient Name - positioned between the double lines */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center text-center"
        style={{
          top: '300px',
          height: '76px'
        }}
      >
        <h2
          className="text-[#201407]"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: participantName.length > 35 ? '28px' : participantName.length > 25 ? '34px' : '39px',
            maxWidth: '650px',
            lineHeight: 1.15
          }}
        >
          {participantName}
        </h2>
      </div>

      {/* Attribution text */}
      <p
        className="absolute left-0 right-0 text-center font-semibold text-[#6e6e6e]"
        style={{
          top: '390px',
          fontFamily: "'Franklin Gothic Medium', 'Franklin Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '14px',
          letterSpacing: '0.20em'
        }}
      >
        POUR SA PRECIEUSE CONTRIBUTION A
      </p>

      {/* Formation Title - flanked between the left and right golden flourishes */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center text-center px-4"
        style={{
          top: '428px',
          height: '58px'
        }}
      >
        <h3
          className="font-bold text-[#1f140a] uppercase tracking-wide"
          style={{
            fontFamily: "'Franklin Gothic Medium', 'Franklin Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
            fontSize: formationTitle.length > 65 ? '16px' : formationTitle.length > 45 ? '18px' : '21px',
            maxWidth: '700px',
            lineHeight: 1.25
          }}
        >
          {formationTitle}
        </h3>
      </div>

      {/* Seal Date (Bottom Left Rosette Badge) */}
      <div
        className="absolute text-center flex flex-col items-center justify-center pointer-events-none"
        style={{
          left: '210px',
          top: '638px',
          transform: 'translate(-50%, -50%)',
          width: '120px',
          height: '120px',
          fontFamily: "'Georgia', 'Times New Roman', serif"
        }}
      >
        <p className="text-[#332411] font-semibold text-[15px] tracking-[0.04em] leading-none mb-1">
          {dayMonth}
        </p>
        <p className="text-[#332411] font-bold text-[38px] leading-none tracking-tight">
          {year}
        </p>
      </div>

      {/* Signature Area (Bottom Middle) */}
      <div
        className="absolute"
        style={{
          left: '342px',
          top: '644px',
          maxWidth: '515px'
        }}
      >
        {stampUrl && (
          <img
            src={stampUrl}
            alt="Cachet"
            className="absolute -top-24 left-10 w-28 h-28 object-contain opacity-85 pointer-events-none"
            style={{ transform: 'rotate(-4deg)' }}
          />
        )}
        <p className="text-[14px] leading-snug text-[#332411]">
          <span
            className="font-bold text-[12px] text-[#332411]"
            style={{ fontFamily: "'Franklin Gothic Medium', 'Franklin Gothic', sans-serif" }}
          >
            SIGNE PAR{' '}
          </span>
          <span
            className="italic"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {signerName}
          </span>
          {renderSignerTitle(signerTitle)}
        </p>
      </div>
    </div>
  );
};

export default CertificateTemplate;
