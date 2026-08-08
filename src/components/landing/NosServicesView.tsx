import React from 'react';
import { ClipboardList, GraduationCap, UsersRound, CheckCircle, Workflow, HelpCircle } from 'lucide-react';
import { partners } from '../../data/partners';
import { CMSBlock } from '../../types/cms';

const iconMap: Record<string, React.ComponentType<any>> = {
  ClipboardList: ClipboardList,
  GraduationCap: GraduationCap,
  UsersRound: UsersRound,
  Workflow: Workflow
};

interface NosServicesViewProps {
  blocks?: CMSBlock[];
  onSelectBlock?: (blockId: string) => void;
}

export const NosServicesView: React.FC<NosServicesViewProps> = ({ blocks, onSelectBlock }) => {
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
                      <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest mb-4 inline-block">
                        {block.settings.badge || "Nos Services"}
                      </span>
                      <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] mb-5">
                        {block.settings.title}
                      </h1>
                      <p className="text-slate-500 text-sm sm:text-base">
                        {block.settings.description}
                      </p>
                    </div>
                  </div>
                );
              case 'ServicesList':
                return (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      {(block.settings.items || []).map((srv: any, idx: number) => {
                        const Icon = iconMap[srv.iconName] || HelpCircle;
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
                                    {(srv.details || []).map((det: string, detIdx: number) => (
                                      <li key={detIdx} className="flex items-start gap-2 text-xs text-slate-600">
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
                );
              case 'Collaborations':
                return (
                  <section className="py-12 bg-white overflow-hidden border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                      <h3 className="font-serif text-2xl font-bold text-[#002366]">
                        {block.settings.title || "Ils nous font confiance"}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {block.settings.description || "Des entreprises leaders de leur secteur partenaires du Cabinet RE2M"}
                      </p>
                    </div>
                    <div className="relative w-full flex overflow-x-hidden bg-slate-50 py-6 border-y border-slate-200/60">
                      <div className="flex gap-16 animate-marquee whitespace-nowrap">
                        {[...partners, ...partners, ...partners].map((partner, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-md shrink-0 transition-transform hover:scale-105"
                          >
                            {partner.logo ? (
                              <img
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                className="h-10 w-auto max-w-[120px] object-contain shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-[#002366] flex items-center justify-center font-bold text-white text-sm shrink-0">
                                {partner.name.charAt(0)}
                              </div>
                            )}
                            <div className="text-left">
                              <p className="text-xs font-extrabold text-[#002366]">{partner.name}</p>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{partner.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
                onSelectBlock 
                  ? `cursor-pointer border-2 border-dashed rounded-3xl group/block my-2 ${
                      block.enabled 
                        ? 'border-transparent hover:border-[#C5A85C] hover:ring-2 hover:ring-[#C5A85C]/30 hover:ring-offset-2' 
                        : 'border-slate-350 opacity-40 hover:opacity-75 bg-slate-50/50'
                    }` 
                  : ''
              }`}
              onClick={(e) => {
                if (onSelectBlock) {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                }
              }}
            >
              {onSelectBlock && (
                <div className="absolute top-3 right-3 bg-[#C5A85C] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg shadow-md z-30 uppercase pointer-events-none opacity-0 group-hover/block:opacity-100 transition-opacity">
                  {block.enabled ? `Modifier: ${block.type}` : `Masqué: ${block.type}`}
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
          <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest mb-4 inline-block">
            Nos Services
          </span>

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

        <div className="relative w-full flex overflow-x-hidden bg-slate-50 py-6 border-y border-slate-200/60">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...partners, ...partners, ...partners].map((partner, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-md shrink-0 transition-transform hover:scale-105"
              >
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    className="h-10 w-auto max-w-[120px] object-contain shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#002366] flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {partner.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs font-extrabold text-[#002366]">{partner.name}</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{partner.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
export default NosServicesView;
