import React from 'react';
import { ContactForm } from './ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { PageSlug, CMSBlock } from '../../types/cms';
import { EditableText } from '../admin/editable/EditableText';

interface ContactViewProps {
  blocks?: CMSBlock[];
  onSelectBlock?: (blockId: string) => void;
  selectedBlockId?: string | null;
  renderBlockEditor?: (block: CMSBlock) => React.ReactNode;
  onUpdateBlockSetting?: (blockId: string, key: string, value: any) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  blocks,
  onSelectBlock,
  selectedBlockId,
  renderBlockEditor,
  onUpdateBlockSetting
}) => {
  const renderBlock = (block: CMSBlock) => {
    if (!block.enabled) return null;

    const field = (key: string, fallback: string) => block.settings[key] || fallback;
    const save = (key: string) => (v: string) => onUpdateBlockSetting?.(block.id, key, v);

    switch (block.type) {
      case 'ContactDetails':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn space-y-12 bg-white text-[#0f172a]">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
              <EditableText
                as="h1"
                label="Titre"
                value={field('title', "Prenez Contact avec le Cabinet RE2M")}
                onSave={save('title')}
                className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] mb-8"
              />
              <EditableText
                as="p"
                label="Description"
                multiline
                value={field('description', "Nos conseillers sont disponibles pour répondre à toutes vos questions.")}
                onSave={save('description')}
                className="text-slate-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
              {/* Contact Info Cards */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#002366] mb-4">Coordonnées du Siège</h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <MapPin className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                    <div className="flex-1">
                      <EditableText as="h4" label="Titre adresse" value={field('addressTitle', "Adresse Physique")} onSave={save('addressTitle')} className="font-bold text-xs uppercase text-slate-500" />
                      <EditableText as="p" label="Adresse (ligne 1)" value={field('addressLine1', "93 rue Albert AKOULOU OSSE")} onSave={save('addressLine1')} className="text-sm text-[#002366] font-semibold mt-1" />
                      <EditableText as="p" label="Adresse (ligne 2)" value={field('addressLine2', "BP 1.357 Libreville, Gabon")} onSave={save('addressLine2')} className="text-xs text-slate-500" />
                    </div>
                  </div>

                  {/* Phones */}
                  <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <Phone className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                    <div className="flex-1">
                      <EditableText as="h4" label="Titre téléphone" value={field('phoneTitle', "Téléphones Directs")} onSave={save('phoneTitle')} className="font-bold text-xs uppercase text-slate-500" />
                      <EditableText as="p" label="Téléphone 1" value={field('phone1', "+241 77 17 11 77")} onSave={save('phone1')} className="text-sm text-[#002366] font-semibold mt-1" />
                      <EditableText as="p" label="Téléphone 2" value={field('phone2', "+241 65 06 25 26")} onSave={save('phone2')} className="text-xs text-slate-500" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <Mail className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                    <div className="flex-1">
                      <EditableText as="h4" label="Titre messagerie" value={field('emailTitle', "Messagerie")} onSave={save('emailTitle')} className="font-bold text-xs uppercase text-slate-500" />
                      <EditableText as="p" label="Email" value={field('email', "remvemboro@outlook.fr")} onSave={save('email')} className="text-sm text-blue-800 font-semibold mt-1 underline" />
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <Clock className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                    <div className="flex-1">
                      <EditableText as="h4" label="Titre horaires" value={field('hoursTitle', "Heures d'Ouverture")} onSave={save('hoursTitle')} className="font-bold text-xs uppercase text-slate-500" />
                      <EditableText as="p" label="Horaires (ligne 1)" value={field('hoursLine1', "Lundi - Vendredi")} onSave={save('hoursLine1')} className="text-sm text-[#002366] font-semibold mt-1" />
                      <EditableText as="p" label="Horaires (ligne 2)" value={field('hoursLine2', "08:00 - 17:00")} onSave={save('hoursLine2')} className="text-xs text-slate-500" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-500">
                  <EditableText as="span" label="RCCM" value={field('rccm', "RCCM: RG.LBV.2017A41250")} onSave={save('rccm')} />
                  <EditableText as="span" label="NIF" value={field('nif', "NIF: 482.914Y")} onSave={save('nif')} />
                </div>
              </div>

              {/* Contact Form Section */}
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (blocks && blocks.length > 0) {
    return (
      <div className="bg-white min-h-screen">
        {blocks.map((block) => {
          return (
            <div key={block.id} className={`relative transition-all ${!block.enabled && onSelectBlock ? 'opacity-40 bg-slate-50/50' : ''}`}>
              {!block.enabled && onSelectBlock && (
                <div className="absolute top-2 left-2 z-30 bg-[#002366] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none uppercase tracking-wider">
                  Masqué : {block.type}
                </div>
              )}
              {renderBlock(block)}
            </div>
          );
        })}
      </div>
    );
  }

  // Static Fallback Render
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn space-y-12 bg-white text-[#0f172a]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] mb-8">
          Prenez Contact avec le Cabinet RE2M
        </h1>

        <p className="text-slate-500 text-sm">
          Nos conseillers sont disponibles pour répondre à toutes vos demandes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#002366] mb-4">Coordonnées du Siège</h3>

          <div className="space-y-4">
            {/* Address */}
            <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <MapPin className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500">Adresse Physique</h4>
                <p className="text-sm text-[#002366] font-semibold mt-1">93 rue Albert AKOULOU OSSE</p>
                <p className="text-xs text-slate-500">BP 1.357 Libreville, Gabon</p>
              </div>
            </div>

            {/* Phones */}
            <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <Phone className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500">Téléphones Directs</h4>
                <p className="text-sm text-[#002366] font-semibold mt-1">+241 77 17 11 77</p>
                <p className="text-xs text-slate-500">+241 65 06 25 26</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <Mail className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500">Messagerie</h4>
                <p className="text-sm text-blue-800 font-semibold mt-1 underline">remvemboro@outlook.fr</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <Clock className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500">Heures d'Ouverture</h4>
                <p className="text-sm text-[#002366] font-semibold mt-1">Lundi - Vendredi</p>
                <p className="text-xs text-slate-500">08:00 - 17:00</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-500">
            <span>RCCM: RG.LBV.2017A41250</span>
            <span>NIF: 482.914Y</span>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactView;
