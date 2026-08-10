import React from 'react';
import { ContactForm } from './ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { PageSlug, CMSBlock } from '../../types/cms';

interface ContactViewProps {
  blocks?: CMSBlock[];
  onSelectBlock?: (blockId: string) => void;
  selectedBlockId?: string | null;
  renderBlockEditor?: (block: CMSBlock) => React.ReactNode;
}

export const ContactView: React.FC<ContactViewProps> = ({
  blocks,
  onSelectBlock,
  selectedBlockId,
  renderBlockEditor
}) => {
  const renderBlock = (block: CMSBlock) => {
    if (!block.enabled) return null;
    
    switch (block.type) {
      case 'ContactDetails':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn space-y-12 bg-white text-[#0f172a]">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] mb-8">
                {block.settings.title || "Prenez Contact avec le Cabinet RE2M"}
              </h1>

              <p className="text-slate-500 text-sm">
                {block.settings.description || "Nos conseillers sont disponibles pour répondre à toutes vos questions."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
              {/* Contact Info Cards */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#002366] mb-4">Coordonnées du Siège</h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <MapPin className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-slate-500">
                        {block.settings.addressTitle || "Adresse Physique"}
                      </h4>
                      <p className="text-sm text-[#002366] font-semibold mt-1">
                        {block.settings.addressLine1 || "93 rue Albert AKOULOU OSSE"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {block.settings.addressLine2 || "BP 1.357 Libreville, Gabon"}
                      </p>
                    </div>
                  </div>

                  {/* Phones */}
                  <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <Phone className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-slate-500">
                        {block.settings.phoneTitle || "Téléphones Directs"}
                      </h4>
                      <p className="text-sm text-[#002366] font-semibold mt-1">
                        {block.settings.phone1 || "+241 77 17 11 77"}
                      </p>
                      {block.settings.phone2 && (
                        <p className="text-xs text-slate-500">
                          {block.settings.phone2 || "+241 65 06 25 26"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <Mail className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-slate-500">
                        {block.settings.emailTitle || "Messagerie"}
                      </h4>
                      <p className="text-sm text-blue-800 font-semibold mt-1 underline">
                        {block.settings.email || "remvemboro@outlook.fr"}
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <Clock className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-slate-500">
                        {block.settings.hoursTitle || "Heures d'Ouverture"}
                      </h4>
                      <p className="text-sm text-[#002366] font-semibold mt-1">
                        {block.settings.hoursLine1 || "Lundi - Vendredi"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {block.settings.hoursLine2 || "08:00 - 17:00"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-500">
                  <span>{block.settings.rccm || "RCCM: RG.LBV.2017A41250"}</span>
                  <span>{block.settings.nif || "NIF: 482.914Y"}</span>
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
            <div
              key={block.id}
              className={`relative transition-all ${
                onSelectBlock
                  ? 'hover:outline-2 hover:outline-dashed hover:outline-[#002366] hover:outline-offset-2 cursor-pointer group/block'
                  : ''
              } ${selectedBlockId === block.id ? 'outline-2 outline-dashed outline-[#002366] outline-offset-2' : ''}`}
              onClick={(e) => {
                if (onSelectBlock) {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                }
              }}
            >
              {onSelectBlock && (
                <div className="absolute top-2 left-2 z-50 bg-[#002366] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover/block:opacity-100 transition-opacity pointer-events-none uppercase tracking-wider">
                  Modifier : {block.type}
                </div>
              )}
              {renderBlock(block)}
              {selectedBlockId === block.id && renderBlockEditor && renderBlockEditor(block)}
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
