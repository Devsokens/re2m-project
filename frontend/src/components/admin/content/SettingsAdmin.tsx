import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  MailCheck,
  XCircle,
  CalendarClock,
  Bell,
  Check,
  Stamp
} from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';
import { ImageUploadField } from '../ImageUploadField';
import { CERTIFICATE_TEMPLATES } from '../../../data/certificateTemplates';
import { CertificateTemplateId } from '../../../data/formations';
import { CertificateTemplatePreview } from '../certificates/CertificateTemplatePreview';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: SettingsSection[] = [
  { id: 'general', label: 'Informations générales', icon: Building2 },
  { id: 'certificats', label: 'Certificats de formation', icon: Stamp },
  { id: 'accuse', label: 'Accusé de réception', icon: MailCheck },
  { id: 'refus', label: 'Email de refus', icon: XCircle },
  { id: 'rdv', label: 'Email de rendez-vous', icon: CalendarClock },
  { id: 'notifications', label: 'Notifications internes', icon: Bell }
];

const STAMP_STORAGE_KEY = 're2m_certificate_stamp';
const DEFAULT_TEMPLATE_STORAGE_KEY = 're2m_certificate_default_template';

const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

const EmailTemplateCard: React.FC<{
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  subject: string;
  onSubjectChange: (v: string) => void;
  body: string;
  onBodyChange: (v: string) => void;
}> = ({ id, icon: Icon, title, description, enabled, onToggle, subject, onSubjectChange, body, onBodyChange }) => {
  const [saved, setSaved] = useState(false);

  return (
    <div id={id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 scroll-mt-24">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-[#002366]">{title}</h3>
            <p className="text-[11px] text-slate-500">{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`shrink-0 w-11 h-6 rounded-full relative transition-colors cursor-pointer ${enabled ? 'bg-[#002366]' : 'bg-slate-200'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label className={labelClass}>Objet de l'email</label>
            <input className={inputClass} value={subject} onChange={(e) => onSubjectChange(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <RichTextEditor value={body} onChange={onBodyChange} placeholder="Contenu de l'email..." />
          </div>
          <div className="flex justify-end items-center gap-3">
            {saved && <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Enregistré</span>}
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 1800);
              }}
              className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const SettingsAdmin: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [cabinetName, setCabinetName] = useState('Cabinet RE2M');
  const [senderEmail, setSenderEmail] = useState('contact@cabinet-re2m.com');

  const [accuseEnabled, setAccuseEnabled] = useState(true);
  const [accuseSubject, setAccuseSubject] = useState('Nous avons bien reçu votre demande');
  const [accuseBody, setAccuseBody] = useState('<p>Bonjour,</p><p>Nous avons bien reçu votre demande et reviendrons vers vous sous 48h.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>');

  const [refusEnabled, setRefusEnabled] = useState(true);
  const [refusSubject, setRefusSubject] = useState('Concernant votre demande');
  const [refusBody, setRefusBody] = useState("<p>Bonjour,</p><p>Après étude, nous ne sommes malheureusement pas en mesure de donner suite à votre demande pour le moment.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>");

  const [rdvEnabled, setRdvEnabled] = useState(true);
  const [rdvSubject, setRdvSubject] = useState('Confirmation de votre rendez-vous');
  const [rdvBody, setRdvBody] = useState('<p>Bonjour,</p><p>Votre rendez-vous avec le Cabinet RE2M a été programmé. Nous vous enverrons les détails pratiques prochainement.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>');

  const [notifyNewRequest, setNotifyNewRequest] = useState(true);
  const [notifyNewTestimonial, setNotifyNewTestimonial] = useState(true);

  const [stampUrl, setStampUrl] = useState(() => localStorage.getItem(STAMP_STORAGE_KEY) || '');
  const [defaultTemplate, setDefaultTemplate] = useState<CertificateTemplateId>(
    () => (localStorage.getItem(DEFAULT_TEMPLATE_STORAGE_KEY) as CertificateTemplateId) || 're2m-classique'
  );

  const handleStampChange = (value: string) => {
    setStampUrl(value);
    if (value) {
      localStorage.setItem(STAMP_STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STAMP_STORAGE_KEY);
    }
  };

  const handleDefaultTemplateChange = (id: CertificateTemplateId) => {
    setDefaultTemplate(id);
    localStorage.setItem(DEFAULT_TEMPLATE_STORAGE_KEY, id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8 animate-fadeIn text-[#0f172a] items-start">

      {/* Main settings content */}
      <div className="space-y-6 min-w-0">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#002366]">Paramètres</h2>
          <p className="text-xs text-slate-500">Configuration générale et emails automatiques envoyés par l'application</p>
        </div>

        <div ref={(el) => { sectionRefs.current['general'] = el; }} id="general" className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#002366]">Informations générales</h3>
              <p className="text-[11px] text-slate-500">Utilisées comme expéditeur dans tous les emails automatiques</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className={labelClass}>Nom du cabinet</label>
              <input className={inputClass} value={cabinetName} onChange={(e) => setCabinetName(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email expéditeur</label>
              <input className={inputClass} value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
            </div>
          </div>
        </div>

        <div ref={(el) => { sectionRefs.current['certificats'] = el; }} id="certificats" className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#002366]">Certificats de formation</h3>
              <p className="text-[11px] text-slate-500">Cachet numérique et modèle utilisés pour générer les attestations</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-6">
            <div>
              <label className={labelClass}>Cachet numérique</label>
              <div className="max-w-sm">
                <ImageUploadField value={stampUrl} onChange={handleStampChange} label="Déposer le cachet (PNG transparent recommandé)" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">Ce cachet apparaît près de la signature sur chaque certificat généré.</p>
            </div>

            <div>
              <label className={labelClass}>Modèle par défaut</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CERTIFICATE_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleDefaultTemplateChange(t.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      defaultTemplate === t.id ? 'border-[#002366] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CertificateTemplatePreview templateId={t.id as CertificateTemplateId} width={220} className="w-full" />
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#002366]">{t.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{t.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={(el) => { sectionRefs.current['accuse'] = el; }}>
          <EmailTemplateCard
            id="accuse"
            icon={MailCheck}
            title="Accusé de réception automatique"
            description="Envoyé automatiquement dès qu'une demande est reçue"
            enabled={accuseEnabled}
            onToggle={() => setAccuseEnabled((v) => !v)}
            subject={accuseSubject}
            onSubjectChange={setAccuseSubject}
            body={accuseBody}
            onBodyChange={setAccuseBody}
          />
        </div>

        <div ref={(el) => { sectionRefs.current['refus'] = el; }}>
          <EmailTemplateCard
            id="refus"
            icon={XCircle}
            title="Email de refus"
            description="Envoyé quand une demande est marquée comme refusée"
            enabled={refusEnabled}
            onToggle={() => setRefusEnabled((v) => !v)}
            subject={refusSubject}
            onSubjectChange={setRefusSubject}
            body={refusBody}
            onBodyChange={setRefusBody}
          />
        </div>

        <div ref={(el) => { sectionRefs.current['rdv'] = el; }}>
          <EmailTemplateCard
            id="rdv"
            icon={CalendarClock}
            title="Email de rendez-vous"
            description="Envoyé quand un rendez-vous est programmé"
            enabled={rdvEnabled}
            onToggle={() => setRdvEnabled((v) => !v)}
            subject={rdvSubject}
            onSubjectChange={setRdvSubject}
            body={rdvBody}
            onBodyChange={setRdvBody}
          />
        </div>

        <div ref={(el) => { sectionRefs.current['notifications'] = el; }} id="notifications" className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#002366]">Notifications internes</h3>
              <p className="text-[11px] text-slate-500">Alertes affichées dans l'admin (cloche en haut de page)</p>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-600">Nouvelle demande reçue</span>
              <input type="checkbox" checked={notifyNewRequest} onChange={(e) => setNotifyNewRequest(e.target.checked)} className="w-4 h-4 accent-[#002366] cursor-pointer" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-600">Nouveau témoignage soumis</span>
              <input type="checkbox" checked={notifyNewTestimonial} onChange={(e) => setNotifyNewTestimonial(e.target.checked)} className="w-4 h-4 accent-[#002366] cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      {/* Right-side reference timeline */}
      <div className="hidden lg:block sticky top-24">
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
          <div className="space-y-6">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="relative flex items-center gap-2.5 text-left cursor-pointer group w-full"
                >
                  <span
                    className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isActive ? 'bg-[#002366] border-[#002366]' : 'bg-white border-slate-300 group-hover:border-slate-400'
                    }`}
                  />
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#002366]' : 'text-slate-400'}`} />
                  <span className={`text-[11px] font-bold leading-tight ${isActive ? 'text-[#002366]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
