import React, { useState, useEffect } from 'react';
import { Hero } from './Hero';
import { Award, CheckCircle, Sparkles, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { partners } from '../../data/partners';
import { CMSBlock } from '../../types/cms';
import { cmsStorage } from '../../utils/cmsStorage';

interface AccueilViewProps {
  onStartDemo: () => void;
  onNavigate: (view: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact') => void;
  blocks?: CMSBlock[];
  onSelectBlock?: (blockId: string) => void;
}

export const AccueilView: React.FC<AccueilViewProps> = ({ 
  onStartDemo, 
  onNavigate, 
  blocks, 
  onSelectBlock 
}) => {
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [testiIndex, setTestiIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { value: '25', label: "Ans d'Expérience" },
    { value: '16', label: 'Entreprises Formées' },
    { value: '42', label: 'Projets Réalisés' },
    { value: '23', label: 'Formations Certifiantes' }
  ];

  const testimonials = [
    {
      company: 'COLAS Gabon',
      service: 'Formation & Accompagnement',
      text: '“Le Cabinet RE2M nous a accompagnés dans la mise en place de notre gestion de la relation fournisseurs. Des résultats concrets et mesurables.”',
      logo: 'https://tse4.mm.bing.net/th/id/OIP.TeuJJGq0FrNo9cbaoSOijQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      company: 'SEEG',
      service: 'Formation & Conseil',
      text: '“Expertise remarquable en gestion des stocks et relation fournisseurs. Une équipe professionnelle et réactive.”',
      logo: 'https://africannuaire.com/wp-content/uploads/2017/05/LOGO-SEEG-AA-17.jpg'
    },
    {
      company: 'SGEPP',
      service: 'Formation Achats',
      text: '“Des formations pratiques et opérationnelles qui ont directement impacté notre performance achats.”',
      logo: 'https://arda.africa/wp-content/uploads/2022/08/Arda_Member_Logos_SGEPP.png'
    },
    {
      company: 'PERENCO',
      service: 'Gestion des Inventaires',
      text: '“Un accompagnement de qualité pour l\'optimisation de notre gestion des inventaires. Recommandé.”',
      logo: 'https://th.bing.com/th/id/R.416f199d5a0200667f7e42d6df1e3241?rik=4M35Oghc52VHow&riu=http%3a%2f%2flogonoid.com%2fimages%2fperenco-logo.png&ehk=AX2r5xs6pgn5JJuZJsUs4dLRsQMfAVJthprTVaaeaE8%3d&risl=&pid=ImgRaw&r=0'
    }
  ];

  if (blocks && blocks.length > 0) {
    return (
      <div className="space-y-16 animate-fadeIn bg-white text-[#0f172a]">
        {blocks.map((block) => {
          if (!onSelectBlock && !block.enabled) return null;

          const renderBlockContent = () => {
            switch (block.type) {
              case 'Hero':
                return (
                  <Hero 
                    onNavigate={onNavigate} 
                    slides={block.settings.slides} 
                  />
                );
              case 'CounterStats':
                return (
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002366] text-xs font-semibold uppercase tracking-wider border border-blue-100">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Notre valeur ajoutée
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] leading-tight">
                          Faire <em>gagner votre entreprise</em>
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                          Notre expertise de 25 ans nous permet d'intervenir dans tous les secteurs d'activité avec des résultats concrets. Nous transformons vos fonctions Achats et Logistique en véritables leviers de performance.
                        </p>
                        <div className="space-y-3 pt-2 text-slate-700 text-xs sm:text-sm">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                            <span><strong>Diagnostic personnalisé</strong> : identification des gisements d'économies.</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                            <span><strong>Solutions innovantes</strong> : implémentation de meilleures pratiques mondiales.</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                            <span><strong>Transfert de compétences</strong> : formation intensive de vos équipes logistiques.</span>
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                        {(block.settings.stats || stats).map((stat: any, index: number) => (
                          <div key={index} className="corporate-card rounded-2xl p-6 text-center space-y-2 border border-slate-100 bg-slate-50">
                            <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#002366]">{stat.value}</span>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <div className="w-8 h-1 bg-blue-800 mx-auto rounded-full mt-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              case 'ServicesPreview':
                const sBlock = cmsStorage.getDraftLayout('nos-services').find(b => b.type === 'ServicesList');
                const allServices = sBlock?.settings.items || [
                  {
                    title: "Audit & Conseil",
                    desc: "Diagnostic complet de vos fonctions Achats et Logistique. Recommandations stratégiques pour l'optimisation de vos processus.",
                    image: "/service_01.jpg"
                  },
                  {
                    title: "Formation Certifiante",
                    desc: "Formations pratiques et opérationnelles en gestion des achats, contrats, stocks, inventaires, négociation et relation fournisseurs. Programme sur mesure.",
                    image: "/service_02.jpg"
                  },
                  {
                    title: "Accompagnement & Coaching",
                    desc: "Coaching et accompagnement personnalisé pour la mise en œuvre de solutions innovantes. Transfert de compétences et outils d'amélioration continue.",
                    image: "/service_03.jpg"
                  }
                ];
                const limit = block.settings.limit || 3;
                const displayServices = allServices.slice(0, limit);

                return (
                  <section className="bg-slate-50 py-16 border-y border-slate-200 animate-fadeIn">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest inline-block">
                          Quelques-uns de nos services
                        </span>
                        <h2 className="font-serif text-3xl font-extrabold text-[#002366] leading-tight">
                          {block.settings.title || "Quelques-uns de nos services"}
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base">
                          {block.settings.description || "Des solutions sur mesure pour optimiser votre performance"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {displayServices.map((srv: any, idx: number) => (
                          <div key={idx} className="corporate-card rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col justify-between h-full group hover:shadow-lg transition-all duration-300">
                            <div>
                              <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                                <img 
                                  src={srv.image || "/service_01.jpg"} 
                                  alt={srv.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>
                              <div className="p-6 space-y-3">
                                <h4 className="font-serif text-lg font-bold text-[#002366]">{srv.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed text-justify">
                                  {srv.desc}
                                </p>
                              </div>
                            </div>
                            <div className="px-6 pb-6 pt-2">
                              <button 
                                onClick={() => onNavigate('nos-services')}
                                className="text-xs font-bold text-blue-800 hover:text-blue-900 flex items-center gap-1 group/btn cursor-pointer"
                              >
                                Découvrir <span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </section>
                );
              case 'FounderSection':
                return (
                  <section className="bg-white py-16 border-b border-slate-200 animate-fadeIn">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        <div className="lg:col-span-5 flex justify-center">
                          <div className="relative max-w-sm w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white p-1">
                            <img
                              src={block.settings.image || "/team_01.jpg"}
                              alt="Roch-Emmanuel MVE-MBORO - Fondateur"
                              className="w-full h-auto rounded-2xl object-contain"
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-7 space-y-5">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002366] text-xs font-semibold uppercase tracking-wider border border-blue-100">
                            <Sparkles className="w-3.5 h-3.5" />
                            {block.settings.title || "Notre valeur ajoutée"}
                          </div>

                          <h2 className="font-serif text-3xl font-extrabold text-[#002366]">
                            {block.settings.subtitle || "Pourquoi choisir le Cabinet RE2M ?"}
                          </h2>

                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify font-bold italic text-blue-900">
                            {block.settings.quote || "Gagner grâce aux Achats et à la Logistique"}
                          </p>

                          <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed text-justify">
                            {(block.settings.paragraphs || []).map((paragraph: string, pIdx: number) => (
                              <p key={pIdx}>
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          <div 
                            onClick={() => setIsCertificateModalOpen(true)}
                            className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-700 cursor-pointer hover:border-blue-800 hover:bg-blue-50/40 transition-all shadow-sm group/cert"
                            title="Cliquer pour afficher la certification PNUD"
                          >
                            <Award className="w-5 h-5 text-[#002366] shrink-0 group-hover/cert:scale-110 transition-transform" />
                            <div>
                              <span className="font-bold text-[#002366] underline group-hover/cert:text-blue-800">Certification PNUD</span> de niveau international, assurant rigueur et conformité. <span className="text-[10px] text-slate-400 font-semibold">(Cliquez pour afficher)</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </section>
                );
              case 'Testimonials':
                return (
                  <section className="bg-slate-50 py-16 border-y border-slate-200 animate-fadeIn">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      
                      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest inline-block">
                          Témoignages
                        </span>
                        <h2 className="font-serif text-3xl font-extrabold text-[#002366] leading-tight">
                          {block.settings.title || "Ce que disent nos clients"}
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base">
                          {block.settings.description || "Découvrez les retours d'expérience des leaders sectoriels accompagnés par le Cabinet RE2M."}
                        </p>
                      </div>

                      {(() => {
                        const items = block.settings.items || testimonials;
                        const isSlider = items.length > 4;
                        const displayedTestimonials = isSlider
                          ? items.slice(testiIndex, testiIndex + (isMobile ? 1 : 2))
                          : items;

                        return (
                          <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                              {displayedTestimonials.map((testi: any, tIdx: number) => (
                                <div 
                                  key={tIdx} 
                                  className="corporate-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow duration-300 min-h-[220px]"
                                >
                                  <span className="absolute top-4 right-6 font-serif text-6xl text-slate-100 select-none pointer-events-none group-hover:text-blue-50 transition-colors">
                                    ”
                                  </span>

                                  <div className="space-y-4 relative z-10">
                                    <p className="text-slate-600 text-sm italic leading-relaxed text-justify">
                                      {testi.text}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-100 relative z-10">
                                    <img 
                                      src={testi.logo} 
                                      alt={`${testi.company} logo`}
                                      className="w-12 h-12 rounded-xl object-contain border border-slate-100 p-1 bg-white shrink-0"
                                    />
                                    <div>
                                      <h4 className="font-serif text-sm font-bold text-[#002366]">{testi.company}</h4>
                                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{testi.service}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {isSlider && (
                              <div className="flex items-center justify-center gap-4 mt-8 select-none">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTestiIndex(prev => Math.max(0, prev - 1));
                                  }}
                                  disabled={testiIndex === 0}
                                  className="p-2.5 rounded-full border border-slate-200 bg-white text-[#002366] hover:border-[#002366] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-slate-200 cursor-pointer shadow-sm"
                                  title="Précédent"
                                >
                                  <ArrowLeft className="w-4 h-4" />
                                </button>
                                
                                <div className="flex gap-2">
                                  {Array.from({ length: items.length - (isMobile ? 0 : 1) }).map((_, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTestiIndex(idx);
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                        testiIndex === idx ? 'bg-[#C5A85C] w-4' : 'bg-slate-300'
                                      }`}
                                      aria-label={`Aller à la diapositive ${idx + 1}`}
                                    />
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTestiIndex(prev => Math.min(items.length - (isMobile ? 1 : 2), prev + 1));
                                  }}
                                  disabled={testiIndex >= items.length - (isMobile ? 1 : 2)}
                                  className="p-2.5 rounded-full border border-slate-200 bg-white text-[#002366] hover:border-[#002366] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-slate-200 cursor-pointer shadow-sm"
                                  title="Suivant"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    </div>
                  </section>
                );
              case 'Collaborations':
                return (
                  <section className="py-12 bg-white overflow-hidden border-b border-slate-100 animate-fadeIn">
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
                        {(() => {
                          const collabs = block.settings.items || partners;
                          const repeated = [...collabs, ...collabs, ...collabs];
                          return repeated.map((partner, idx) => (
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
                          ));
                        })()}
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

        {/* Demo Call to action */}
        <section className="bg-[#002366] text-white py-12 text-center rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl font-bold">Cabinet Connected & PWA</h3>
            <p className="text-xs text-slate-300">
              En complément de nos services d'audit, explorez notre système de cartes membres dématérialisées virtuelles.
            </p>
            <button
              onClick={onStartDemo}
              className="bg-white text-[#002366] font-bold px-6 py-2.5 rounded-xl hover:bg-slate-100 transition-colors text-xs cursor-pointer"
            >
              Lancer la démo des Cartes Virtuelles
            </button>
          </div>
        </section>

        {/* Certificate Modal */}
        {isCertificateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl relative border border-slate-200 space-y-4 animate-scaleUp">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#002366]">
                  Aperçu du Certificat Officiel
                </h3>
                <button
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 cursor-pointer"
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-center bg-slate-50 rounded-2xl p-2 border border-slate-100 overflow-hidden">
                <img
                  src="/undp_certificate.png"
                  alt="UNDP Procurement Certificate - Roch-Emmanuel MVE-MBORO"
                  className="w-full h-auto object-contain max-h-[60vh] rounded-xl"
                />
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Certification de Réussite délivrée à Roch-Emmanuel MVE-MBORO en Novembre 2009 à New York,<br />
                par le Directeur du Bureau de Gestion du Programme des Nations Unies pour le Développement (PNUD).
              </p>

              <div className="text-center pt-2">
                <button
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Fermer l'aperçu
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback Statique
  return (
    <div className="space-y-16 animate-fadeIn bg-white text-[#0f172a]">
      
      <Hero onNavigate={onNavigate} />

      {/* 1. SECTION VALEUR AJOUTÉE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002366] text-xs font-semibold uppercase tracking-wider border border-blue-100">
              <TrendingUp className="w-3.5 h-3.5" />
              Notre valeur ajoutée
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] leading-tight">
              Faire <em>gagner votre entreprise</em>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Notre expertise de 25 ans nous permet d'intervenir dans tous les secteurs d'activité avec des résultats concrets. Nous transformons vos fonctions Achats et Logistique en véritables leviers de performance.
            </p>

            <div className="space-y-3 pt-2 text-slate-700 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <span><strong>Diagnostic personnalisé</strong> : identification des gisements d'économies.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <span><strong>Solutions innovantes</strong> : implémentation de meilleures pratiques mondiales.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <span><strong>Transfert de compétences</strong> : formation intensive de vos équipes logistiques.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="corporate-card rounded-2xl p-6 text-center space-y-2 border border-slate-100 bg-slate-50">
                <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#002366]">{stat.value}</span>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <div className="w-8 h-1 bg-blue-800 mx-auto rounded-full mt-2" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 1.5 SECTION QUELQUES-UNS DE NOS SERVICES */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest inline-block">
              Quelques-uns de nos services
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#002366] leading-tight">
              Nos principales expertises
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Découvrez un aperçu condensé des prestations offertes par le cabinet pour structurer et rentabiliser vos chaînes logistiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="corporate-card rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col justify-between h-full group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                  <img 
                    src="/service_01.jpg" 
                    alt="Audit & Conseil"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-serif text-lg font-bold text-[#002366]">Audit & Conseil</h4>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    Diagnostic complet de vos fonctions Achats et Logistique. Recommandations stratégiques pour l'optimisation de vos processus et l'amélioration de votre performance.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <button 
                  onClick={() => onNavigate('nos-services')}
                  className="text-xs font-bold text-blue-800 hover:text-blue-900 flex items-center gap-1 group/btn cursor-pointer"
                >
                  Découvrir <span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
                </button>
              </div>
            </div>

            <div className="corporate-card rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col justify-between h-full group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                  <img 
                    src="/service_02.jpg" 
                    alt="Formation Certifiante"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-serif text-lg font-bold text-[#002366]">Formation Certifiante</h4>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    Formations pratiques et opérationnelles en gestion des achats, contrats, stocks, inventaires, négociation et relation fournisseurs. Programme sur mesure.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <button 
                  onClick={() => onNavigate('nos-services')}
                  className="text-xs font-bold text-blue-800 hover:text-blue-900 flex items-center gap-1 group/btn cursor-pointer"
                >
                  Découvrir <span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
                </button>
              </div>
            </div>

            <div className="corporate-card rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col justify-between h-full group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                  <img 
                    src="/service_03.jpg" 
                    alt="Accompagnement"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-serif text-lg font-bold text-[#002366]">Accompagnement & Coaching</h4>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    Coaching et accompagnement personnalisé pour la mise en œuvre de solutions innovantes. Transfert de compétences et outils d'amélioration continue.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <button 
                  onClick={() => onNavigate('nos-services')}
                  className="text-xs font-bold text-blue-800 hover:text-blue-900 flex items-center gap-1 group/btn cursor-pointer"
                >
                  Découvrir <span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION MOT DU FONDATEUR */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-sm w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white p-1">
                <img 
                  src="/more-info.jpg" 
                  alt="Roch-Emmanuel MVE-MBORO - Fondateur" 
                  className="w-full h-auto rounded-2xl object-contain"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002366] text-xs font-semibold uppercase tracking-wider border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                Notre Fondateur
              </div>

              <h2 className="font-serif text-3xl font-extrabold text-[#002366]">
                Roch-Emmanuel <em>MVE-MBORO</em>
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify font-bold italic text-blue-900">
                “Gagner grâce aux Achats et à la Logistique”
              </p>

              <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed text-justify">
                <p>
                  Dans le contexte économique actuel, la performance de la chaîne d'approvisionnement et l'optimisation des achats sont devenus des leviers stratégiques majeurs pour la compétitivité et la rentabilité des entreprises.
                </p>
                <p>
                  Notre accompagnement est conçu pour structurer, professionnaliser et optimiser vos services Achats et Logistique afin de libérer de la valeur et d'avoir un impact direct et mesurable sur vos résultats financiers.
                </p>
                <p>
                  Grâce à notre expertise unique, nous aidons vos collaborateurs à acquérir des compétences clés et à adopter des outils et processus d'excellence opérationnelle.
                </p>
              </div>

              <div 
                onClick={() => setIsCertificateModalOpen(true)}
                className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-700 cursor-pointer hover:border-blue-800 hover:bg-blue-50/40 transition-all shadow-sm group/cert"
                title="Cliquer pour afficher la certification PNUD"
              >
                <Award className="w-5 h-5 text-[#002366] shrink-0 group-hover/cert:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-[#002366] underline group-hover/cert:text-blue-800">Certification PNUD</span> de niveau international, assurant rigueur et conformité. <span className="text-[10px] text-slate-400 font-semibold">(Cliquez pour afficher)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION TÉMOIGNAGES */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest inline-block">
              Témoignages
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#002366] leading-tight">
              Ce que disent nos clients
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Découvrez les retours d'expérience des leaders sectoriels accompagnés par le Cabinet RE2M.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testi, idx) => (
              <div 
                key={idx} 
                className="corporate-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow duration-300"
              >
                <span className="absolute top-4 right-6 font-serif text-6xl text-slate-100 select-none pointer-events-none group-hover:text-blue-50 transition-colors">
                  ”
                </span>

                <div className="space-y-4 relative z-10">
                  <p className="text-slate-600 text-sm italic leading-relaxed text-justify">
                    {testi.text}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-100 relative z-10">
                  <img 
                    src={testi.logo} 
                    alt={`${testi.company} logo`}
                    className="w-12 h-12 rounded-xl object-contain border border-slate-100 p-1 bg-white shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#002366]">{testi.company}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{testi.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SECTION IL NOUS FONT CONFIANCE */}
      <section className="py-12 bg-white overflow-hidden border-b border-slate-100">
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

      {/* Demo Call to action */}
      <section className="bg-[#002366] text-white py-12 text-center rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="font-serif text-2xl font-bold">Cabinet Connected & PWA</h3>
          <p className="text-xs text-slate-300">
            En complément de nos services d'audit, explorez notre système de cartes membres dématérialisées virtuelles.
          </p>
          <button
            onClick={onStartDemo}
            className="bg-white text-[#002366] font-bold px-6 py-2.5 rounded-xl hover:bg-slate-100 transition-colors text-xs cursor-pointer"
          >
            Lancer la démo des Cartes Virtuelles
          </button>
        </div>
      </section>

      {/* Certificate Modal */}
      {isCertificateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl relative border border-slate-200 space-y-4 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#002366]">
                Aperçu du Certificat Officiel
              </h3>
              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 cursor-pointer"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center bg-slate-50 rounded-2xl p-2 border border-slate-100 overflow-hidden">
              <img
                src="/undp_certificate.png"
                alt="UNDP Procurement Certificate - Roch-Emmanuel MVE-MBORO"
                className="w-full h-auto object-contain max-h-[60vh] rounded-xl"
              />
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Certification de Réussite délivrée à Roch-Emmanuel MVE-MBORO en Novembre 2009 à New York,<br />
              par le Directeur du Bureau de Gestion du Programme des Nations Unies pour le Développement (PNUD).
            </p>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Fermer l'aperçu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default AccueilView;
