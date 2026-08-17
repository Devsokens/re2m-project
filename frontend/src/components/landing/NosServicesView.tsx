import React from 'react';
import { ClipboardList, GraduationCap, UsersRound, CheckCircle, Workflow, Plus, X } from 'lucide-react';
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
      <div className="animate-fadeIn space-y-8 bg-white text-[#0f172a] py-10">
        {blocks.map((block) => {
          if (!onSelectBlock && !block.enabled) return null;

          const renderBlockContent = () => {
            switch (block.type) {
              case 'HeaderBanner':
                return (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                      <EditableText
                        as="h1"
                        label="Titre"
                        value={block.settings.title}
                        onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                        className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] mb-5"
                      />
                      <EditableText
                        as="p"
                        label="Description"
                        multiline
                        value={block.settings.description}
                        onSave={(v) => onUpdateBlockSetting?.(block.id, 'description', v)}
                        className="text-slate-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                );
              case 'ServicesList': {
                const serviceItems = block.settings.items || [];
                return (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      {serviceItems.map((srv: any, idx: number) => {
                        const saveField = (key: string, v: any) => {
                          const items = [...serviceItems];
                          items[idx] = { ...items[idx], [key]: v };
                          onUpdateBlockSetting?.(block.id, 'items', items);
                        };
                        const details: string[] = srv.details || [];
                        return (
                          <div key={idx} className="corporate-card rounded-3xl border border-slate-200/80 flex flex-col justify-between overflow-hidden bg-white h-full">
                            <div className="flex flex-col h-full justify-between">
                              <div>
                                <div className="w-full aspect-[37/20] overflow-hidden bg-slate-100 border-b border-slate-100 relative group">
                                  <EditableImage
                                    src={srv.image}
                                    alt={srv.title}
                                    onSave={(v) => saveField('image', v)}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                                <div className="p-5 space-y-4">
                                  <div className="space-y-3">
                                    <EditableIcon
                                      value={srv.iconName}
                                      onSave={(iconName) => saveField('iconName', iconName)}
                                      className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366]"
                                      iconClassName="w-5 h-5"
                                    />
                                    <div>
                                      <EditableText
                                        as="h3"
                                        label="Titre"
                                        value={srv.title}
                                        onSave={(v) => saveField('title', v)}
                                        className="font-serif text-base font-bold text-[#002366] leading-snug min-h-[40px] flex items-center"
                                      />
                                      <EditableText
                                        as="p"
                                        label="Description"
                                        multiline
                                        value={srv.desc}
                                        onSave={(v) => saveField('desc', v)}
                                        className="text-xs text-slate-500 mt-1 leading-relaxed min-h-[72px]"
                                      />
                                    </div>
                                  </div>
                                  <ul className="space-y-1.5 border-t border-slate-100 pt-3">
                                    {details.map((det: string, detIdx: number) => (
                                      <li key={detIdx} className="flex items-start gap-2 text-xs text-slate-600">
                                        <CheckCircle className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                                        <EditableText
                                          as="span"
                                          label={`Détail ${detIdx + 1}`}
                                          value={det}
                                          onSave={(v) => {
                                            const updated = [...details];
                                            updated[detIdx] = v;
                                            saveField('details', updated);
                                          }}
                                          className="leading-tight"
                                        />
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="px-5 pb-5 pt-3 mt-auto border-t border-slate-100">
                                <span className="text-[11px] font-bold text-[#002366]">Expertise Cabinet RE2M</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              case 'Collaborations':
                return (
                  <section className="py-12 bg-white overflow-hidden border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                      <EditableText
                        as="h3"
                        label="Titre"
                        value={block.settings.title || "Ils nous font confiance"}
                        onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                        className="font-serif text-2xl font-bold text-[#002366]"
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
                          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-[#002366] text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors">
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
                                <EditableImage
                                  src={partner.logo || ''}
                                  alt={`${partner.name} logo`}
                                  onSave={(v) => {
                                    const updated = [...collabs];
                                    updated[idx] = { ...updated[idx], logo: v };
                                    onUpdateBlockSetting(block.id, 'items', updated);
                                  }}
                                  containerClassName="w-[150px] h-16 flex items-center justify-center"
                                  className="h-12 w-auto max-w-[130px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                                />
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
                        <div className="flex items-center gap-20 animate-marquee-slow whitespace-nowrap">
                          {(() => {
                            const collabs = block.settings.items || partners;
                            const repeated = [...collabs, ...collabs, ...collabs];
                            return repeated.map((partner, pIdx) => (
                              partner.logo ? (
                                <img
                                  key={pIdx}
                                  src={partner.logo}
                                  alt={`${partner.name} logo`}
                                  title={partner.name}
                                  className="h-14 w-auto max-w-[150px] object-contain shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
                                />
                              ) : (
                                <span
                                  key={pIdx}
                                  title={partner.name}
                                  className="font-serif text-lg font-bold text-slate-400 shrink-0 hover:text-[#002366] transition-colors"
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
                onSelectBlock && !block.enabled ? 'rounded-3xl my-2 opacity-40 bg-slate-50/50' : ''
              }`}
            >
              {onSelectBlock && !block.enabled && (
                <div className="absolute top-3 right-3 bg-[#002366] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg shadow-md z-30 uppercase pointer-events-none">
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
    <div className="animate-fadeIn space-y-8 bg-white text-[#0f172a] py-10">

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] mb-5">
            Nos Domaines d'Expertise Stratégiques
          </h1>

          <p className="text-slate-500 text-sm sm:text-base">
            Des services structurés pour vous faire réaliser des économies substantielles et optimiser vos flux de stockage.
          </p>
        </div>
      </div>

      {/* Services List Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {list.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="corporate-card rounded-3xl border border-slate-200/80 flex flex-col justify-between overflow-hidden bg-white h-full">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-full aspect-[37/20] overflow-hidden bg-slate-100 border-b border-slate-100 relative group">
                      <img 
                        src={srv.image} 
                        alt={srv.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366]">
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div>
                          <h3 className="font-serif text-base font-bold text-[#002366] leading-snug min-h-[40px] flex items-center">
                            {srv.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed min-h-[72px]">
                            {srv.desc}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-1.5 border-t border-slate-100 pt-3">
                        {srv.details.map((det, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                            <span className="leading-tight">{det}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 mt-auto border-t border-slate-100">
                    <span className="text-[11px] font-bold text-[#002366]">Expertise Cabinet RE2M</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION COLLABORATIONS */}
      <section className="py-12 bg-white overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-[#002366]">Ils nous font confiance</h3>
          <p className="text-xs text-slate-400 mt-1">Des entreprises leaders de leur secteur partenaires du Cabinet RE2M</p>
        </div>

        <div className="relative w-full flex overflow-x-hidden py-4">
          <div className="flex items-center gap-20 animate-marquee-slow whitespace-nowrap">
            {[...partners, ...partners, ...partners].map((partner, idx) => (
              partner.logo ? (
                <img
                  key={idx}
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  title={partner.name}
                  className="h-14 w-auto max-w-[150px] object-contain shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              ) : (
                <span
                  key={idx}
                  title={partner.name}
                  className="font-serif text-lg font-bold text-slate-400 shrink-0 hover:text-[#002366] transition-colors"
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
