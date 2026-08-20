import React, { useState } from 'react';
import { ClipboardList, GraduationCap, UsersRound, CheckCircle, Workflow, Plus, X, ChevronDown, Sparkles } from 'lucide-react';
import { partners } from '../../data/partners';
import { CMSBlock } from '../../types/cms';
import { EditableIcon } from '../admin/editable/EditableIcon';
import { EditableText } from '../admin/editable/EditableText';
import { EditableImage } from '../admin/editable/EditableImage';
import { apiClient, ApiError } from '../../lib/apiClient';

interface NosServicesViewProps {
  blocks?: CMSBlock[];
  onSelectBlock?: (blockId: string) => void;
  selectedBlockId?: string | null;
  renderBlockEditor?: (block: CMSBlock) => React.ReactNode;
  onUpdateBlockSetting?: (blockId: string, key: string, value: any) => void;
}

// One alternating (image left/right) accordion row for a service. Only one
// detail can be expanded at a time; since the data model has a single `desc`
// per service (not one per detail), the expanded panel reveals that shared
// description — still gives real, animated interactivity without requiring
// a CMS schema change for per-detail long-form text.
const ServiceAccordionRow: React.FC<{
  index: number;
  icon?: React.ReactNode;
  title: React.ReactNode;
  desc: React.ReactNode;
  revealText: string;
  details: React.ReactNode[];
  imageMain: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}> = ({ index, icon, title, desc, revealText, details, imageMain, imageSrc, imageAlt }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const reversed = index % 2 === 1;

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 animate-fadeIn ${
        index !== 0 ? 'border-t border-white/10' : ''
      }`}
    >
      <div className={`space-y-5 ${reversed ? 'lg:order-2' : ''}`}>
        {icon}
        <div className="font-serif text-2xl sm:text-3xl font-bold text-white">{title}</div>
        <div className="text-sm text-slate-300 leading-relaxed max-w-lg">{desc}</div>

        <div className="space-y-2 pt-2">
          {details.map((label, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden transition-colors hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-100">
                    <CheckCircle className={`w-4 h-4 shrink-0 transition-colors duration-300 ${isOpen ? 'text-sky-400' : 'text-slate-500'}`} />
                    {label}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-sky-400' : ''}`}
                  />
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 pl-11 text-xs text-slate-400 leading-relaxed">{revealText}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={reversed ? 'lg:order-1' : ''}>
        <div className="relative group max-w-md mx-auto lg:max-w-none">
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3]">
            {imageMain}
          </div>
          <div className="hidden sm:block absolute -bottom-6 -right-6 w-28 h-28 lg:w-36 lg:h-36 rounded-2xl overflow-hidden border-4 border-[#020c24] shadow-2xl">
            <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const NosServicesView: React.FC<NosServicesViewProps> = ({ blocks, onSelectBlock, selectedBlockId, renderBlockEditor, onUpdateBlockSetting }) => {
  const list = [
    {
      icon: ClipboardList,
      title: "Audit & Conseil en Approvisionnements",
      desc: "Nous analysons en profondeur vos processus achats, vos contrats, vos coûts et vos relations fournisseurs. Nos audits vous aident à restructurer votre supply chain et à éliminer les gaspillages.",
      details: [
        "Diagnostic de la fonction achats",
        "Cartographie des dépenses et des risques",
        "Optimisation des processus et flux physiques",
        "Assistance au sourcing de fournisseurs stratégiques"
      ],
      image: "/single_service_01.jpg"
    },
    {
      icon: GraduationCap,
      title: "Formation Professionnelle Certifiante",
      desc: "Parce que la performance repose sur l'humain, nous dispensons des modules de formation pour vos collaborateurs, validés par notre expertise PNUD.",
      details: [
        "Gestion opérationnelle des stocks et inventaires",
        "Techniques de négociation commerciale complexes",
        "Gestion des contrats d'approvisionnement",
        "Éthique et lutte contre la fraude achats"
      ],
      image: "/single_service_02.jpg"
    },
    {
      icon: UsersRound,
      title: "Accompagnement Opérationnel & Coaching",
      desc: "Nous ne vous laissons pas seuls avec nos rapports. Nos consultants vous accompagnent sur le terrain pour la mise en œuvre effective de nos plans d'actions.",
      details: [
        "Coaching de managers logistiques",
        "Mise en place d'outils digitaux d'évaluation",
        "Suivi des indicateurs de performance (KPI)",
        "Accompagnement à la conduite du changement"
      ],
      image: "/single_service_03.jpg"
    },
    {
      icon: Workflow,
      title: "Gestion des Flux Physiques & Financiers",
      desc: "Nous pilotons vos flux physiques et financiers (approvisionnements, logistique, manutention) et déployons des systèmes d'information décisionnels.",
      details: [
        "Gestion des flux physiques et financiers",
        "Optimisation des opérations de manutention",
        "Déploiement de SI dédiés (SAP, Oracle, Sage X3)",
        "Mesure de la performance achats et fournisseurs"
      ],
      image: "/single_service_04.jpg"
    }
  ];

  if (blocks && blocks.length > 0) {
    return (
      <div className="animate-fadeIn bg-gradient-to-b from-[#020c24] via-[#00102e] to-[#020c24] text-white">
        {blocks.map((block) => {
          if (!onSelectBlock && !block.enabled) return null;

          const renderBlockContent = () => {
            switch (block.type) {
              case 'HeaderBanner':
                return (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> Nos expertises
                      </div>
                      <EditableText
                        as="h1"
                        label="Titre"
                        value={block.settings.title}
                        onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                        className="font-serif text-3xl sm:text-4xl font-extrabold text-white"
                      />
                      <EditableText
                        as="p"
                        label="Description"
                        multiline
                        value={block.settings.description}
                        onSave={(v) => onUpdateBlockSetting?.(block.id, 'description', v)}
                        className="text-slate-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                );
              case 'ServicesList': {
                const serviceItems = block.settings.items || [];
                return (
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                    {serviceItems.map((srv: any, idx: number) => {
                      const saveField = (key: string, v: any) => {
                        const items = [...serviceItems];
                        items[idx] = { ...items[idx], [key]: v };
                        onUpdateBlockSetting?.(block.id, 'items', items);
                      };
                      const details: string[] = srv.details || [];
                      return (
                        <ServiceAccordionRow
                          key={idx}
                          index={idx}
                          icon={
                            <EditableIcon
                              value={srv.iconName}
                              onSave={(iconName) => saveField('iconName', iconName)}
                              className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-300"
                              iconClassName="w-5 h-5"
                            />
                          }
                          title={
                            <EditableText
                              as="span"
                              label="Titre"
                              value={srv.title}
                              onSave={(v) => saveField('title', v)}
                            />
                          }
                          desc={
                            <EditableText
                              as="span"
                              label="Description"
                              multiline
                              value={srv.desc}
                              onSave={(v) => saveField('desc', v)}
                            />
                          }
                          revealText={srv.desc}
                          details={details.map((det: string, detIdx: number) => (
                            <EditableText
                              key={detIdx}
                              as="span"
                              label={`Détail ${detIdx + 1}`}
                              value={det}
                              onSave={(v) => {
                                const updated = [...details];
                                updated[detIdx] = v;
                                saveField('details', updated);
                              }}
                            />
                          ))}
                          imageMain={
                            <EditableImage
                              src={srv.image}
                              alt={srv.title}
                              onSave={(v) => saveField('image', v)}
                              className="w-full h-full object-cover"
                            />
                          }
                          imageSrc={srv.image}
                          imageAlt={srv.title}
                        />
                      );
                    })}
                  </div>
                );
              }
              case 'Collaborations':
                return (
                  <section className="py-12 border-t border-white/10 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                      <EditableText
                        as="h3"
                        label="Titre"
                        value={block.settings.title || "Ils nous font confiance"}
                        onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                        className="font-serif text-2xl font-bold text-white"
                      />
                      <EditableText
                        as="p"
                        label="Description"
                        value={block.settings.description || "Des entreprises leaders de leur secteur partenaires du Cabinet RE2M"}
                        onSave={(v) => onUpdateBlockSetting?.(block.id, 'description', v)}
                        className="text-xs text-slate-400 mt-1"
                      />

                      {onUpdateBlockSetting && (
                        <div className="flex justify-center mt-4">
                          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold cursor-pointer hover:bg-white/20 transition-colors">
                            <Plus className="w-4 h-4" />
                            Ajouter un partenaire
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                e.target.value = '';
                                if (!file) return;
                                try {
                                  const { url } = await apiClient.upload<{ url: string }>('/api/uploads', file);
                                  const collabs = block.settings.items || partners;
                                  const updated = [...collabs, { name: 'Nouveau partenaire', logo: url }];
                                  onUpdateBlockSetting(block.id, 'items', updated);
                                } catch (err) {
                                  window.alert(err instanceof ApiError ? err.message : "Échec de l'envoi de l'image.");
                                }
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    {onUpdateBlockSetting ? (
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-6 overflow-x-auto overflow-y-visible pt-4 pb-3">
                          {(block.settings.items || partners).map((partner: any, idx: number) => {
                            const collabs = block.settings.items || partners;
                            return (
                              <div key={idx} className="relative shrink-0 group/partner">
                                <div className="w-[150px] h-16 flex items-center justify-center rounded-xl bg-white/95 px-2">
                                  <EditableImage
                                    src={partner.logo || ''}
                                    alt={`${partner.name} logo`}
                                    onSave={(v) => {
                                      const updated = [...collabs];
                                      updated[idx] = { ...updated[idx], logo: v };
                                      onUpdateBlockSetting(block.id, 'items', updated);
                                    }}
                                    containerClassName="w-full h-full flex items-center justify-center"
                                    className="h-12 w-auto max-w-[130px] object-contain"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = collabs.filter((_: any, i: number) => i !== idx);
                                    onUpdateBlockSetting(block.id, 'items', updated);
                                  }}
                                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow cursor-pointer opacity-0 group-hover/partner:opacity-100 transition-opacity"
                                  title="Retirer ce partenaire"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full flex overflow-x-hidden py-4">
                        <div className="flex items-center gap-8 animate-marquee-slow whitespace-nowrap">
                          {(() => {
                            const collabs = block.settings.items || partners;
                            const repeated = [...collabs, ...collabs, ...collabs];
                            return repeated.map((partner, pIdx) => (
                              partner.logo ? (
                                <div key={pIdx} title={partner.name} className="w-[150px] h-16 shrink-0 flex items-center justify-center rounded-xl bg-white/95 px-2 opacity-90 hover:opacity-100 transition-opacity">
                                  <img
                                    src={partner.logo}
                                    alt={`${partner.name} logo`}
                                    className="h-12 w-auto max-w-[130px] object-contain"
                                  />
                                </div>
                              ) : (
                                <span
                                  key={pIdx}
                                  title={partner.name}
                                  className="font-serif text-lg font-bold text-slate-400 shrink-0 hover:text-white transition-colors"
                                >
                                  {partner.name}
                                </span>
                              )
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </section>
                );
              default:
                return null;
            }
          };

          return (
            <div
              key={block.id}
              className={`relative transition-all ${
                onSelectBlock && !block.enabled ? 'rounded-3xl my-2 opacity-40 bg-white/5' : ''
              }`}
            >
              {onSelectBlock && !block.enabled && (
                <div className="absolute top-3 right-3 bg-white text-[#002366] text-[9px] font-extrabold px-2.5 py-1 rounded-lg shadow-md z-30 uppercase pointer-events-none">
                  Masqué: {block.type}
                </div>
              )}
              {renderBlockContent()}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback Statique
  return (
    <div className="animate-fadeIn bg-gradient-to-b from-[#020c24] via-[#00102e] to-[#020c24] text-white">

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Nos expertises
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            Nos Domaines d'Expertise Stratégiques
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Des services structurés pour vous faire réaliser des économies substantielles et optimiser vos flux de stockage.
          </p>
        </div>
      </div>

      {/* Services accordion list */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {list.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <ServiceAccordionRow
              key={idx}
              index={idx}
              icon={
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-300">
                  <Icon className="w-5 h-5" />
                </div>
              }
              title={srv.title}
              desc={srv.desc}
              revealText={srv.desc}
              details={srv.details}
              imageMain={<img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />}
              imageSrc={srv.image}
              imageAlt={srv.title}
            />
          );
        })}
      </div>

      {/* SECTION COLLABORATIONS */}
      <section className="py-12 border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-white">Ils nous font confiance</h3>
          <p className="text-xs text-slate-400 mt-1">Des entreprises leaders de leur secteur partenaires du Cabinet RE2M</p>
        </div>

        <div className="relative w-full flex overflow-x-hidden py-4">
          <div className="flex items-center gap-8 animate-marquee-slow whitespace-nowrap">
            {[...partners, ...partners, ...partners].map((partner, idx) => (
              partner.logo ? (
                <div key={idx} title={partner.name} className="w-[150px] h-16 shrink-0 flex items-center justify-center rounded-xl bg-white/95 px-2 opacity-90 hover:opacity-100 transition-opacity">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="h-12 w-auto max-w-[130px] object-contain"
                  />
                </div>
              ) : (
                <span
                  key={idx}
                  title={partner.name}
                  className="font-serif text-lg font-bold text-slate-400 shrink-0 hover:text-white transition-colors"
                >
                  {partner.name}
                </span>
              )
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
export default NosServicesView;
