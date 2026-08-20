import React, { useEffect, useState } from 'react';
import { Hero } from './Hero';
import { Award, CheckCircle, Sparkles, TrendingUp, ArrowRight, Plus, MessageSquareQuote, X } from 'lucide-react';
import { partners } from '../../data/partners';
import { Article, articlesStore } from '../../data/articles';
import { NewsItem, newsStore } from '../../data/news';
import { CMSBlock } from '../../types/cms';
import { cmsStorage } from '../../utils/cmsStorage';
import { EditableText } from '../admin/editable/EditableText';
import { EditableImage } from '../admin/editable/EditableImage';
import { TeamSection } from './TeamSection';
import { Member } from '../../types/member';
import { PublicTestimonialModal } from './PublicTestimonialModal';
import { apiClient, ApiError } from '../../lib/apiClient';
import { testimonialsStore, Testimonial } from '../../utils/testimonialsStore';
import { LikeButton } from './LikeButton';
import { ShareButton } from './ShareButton';
import { AutoScrollRow } from './AutoScrollRow';
import { NewsletterSignup } from './NewsletterSignup';
import { ServicesShowcase } from './ServicesShowcase';
import { BlogCarousel } from './BlogCarousel';

interface AccueilViewProps {
  onStartDemo: () => void;
  onNavigate: (view: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact') => void;
  blocks?: CMSBlock[];
  onSelectBlock?: (blockId: string) => void;
  selectedBlockId?: string | null;
  renderBlockEditor?: (block: CMSBlock) => React.ReactNode;
  onUpdateBlockSetting?: (blockId: string, key: string, value: any) => void;
  members?: Member[];
}

export const AccueilView: React.FC<AccueilViewProps> = ({
  onStartDemo,
  onNavigate,
  blocks,
  onSelectBlock,
  selectedBlockId,
  renderBlockEditor,
  onUpdateBlockSetting,
  members = []
}) => {
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // Published testimonials now live in their own table (see Témoignages admin
  // module) instead of being embedded in this CMS block's settings.items.
  const [publishedTestimonials, setPublishedTestimonials] = useState<Testimonial[]>([]);
  useEffect(() => {
    testimonialsStore
      .list()
      .then((rows) => setPublishedTestimonials(rows.filter((r) => r.status === 'publié')))
      .catch((err) => console.error('Impossible de charger les témoignages :', err));
  }, []);

  // Cross-page lookup: the "ServicesPreview" block pulls its services list
  // straight from the "nos-services" page's own ServicesList block. Edit mode
  // (onUpdateBlockSetting present) previews the draft; the public site reads
  // what's actually published, since there's no auth to fetch a draft there.
  const [servicesPageBlock, setServicesPageBlock] = useState<CMSBlock | undefined>(undefined);
  useEffect(() => {
    const load = onUpdateBlockSetting ? cmsStorage.getDraftLayout('nos-services') : cmsStorage.getPublishedLayout('nos-services');
    load
      .then((servicesBlocks) => setServicesPageBlock(servicesBlocks.find((b) => b.type === 'ServicesList')))
      .catch((err) => console.error('Impossible de charger les services :', err));
  }, [onUpdateBlockSetting]);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    newsStore.list().then(setNews).catch((err) => console.error('Impossible de charger les actualités :', err));
    articlesStore.list().then(setArticles).catch((err) => console.error('Impossible de charger les articles :', err));
  }, []);

  const stats = [
    { value: '25', label: "Ans d'Expérience" },
    { value: '16', label: 'Entreprises Formées' },
    { value: '42', label: 'Projets Réalisés' },
    { value: '23', label: 'Formations Certifiantes' }
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
                    onUpdateSlide={
                      onUpdateBlockSetting
                        ? (idx, key, v) => {
                            const heroSlides = [...(block.settings.slides || [])];
                            heroSlides[idx] = { ...heroSlides[idx], [key]: v };
                            onUpdateBlockSetting(block.id, 'slides', heroSlides);
                          }
                        : undefined
                    }
                  />
                );
              case 'CounterStats': {
                const csStats = block.settings.stats || stats;
                return (
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-6 space-y-6">
                        <EditableText
                          as="div"
                          label="Badge"
                          value={block.settings.badge || 'Notre valeur ajoutée'}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'badge', v)}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002366] text-xs font-semibold uppercase tracking-wider border border-blue-100"
                        />
                        <EditableText
                          as="h2"
                          label="Titre"
                          value={block.settings.title || 'Faire gagner votre entreprise'}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                          className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366] leading-tight"
                        />
                        <EditableText
                          as="p"
                          label="Description"
                          multiline
                          value={block.settings.description || "Notre expertise de 25 ans nous permet d'intervenir dans tous les secteurs d'activité avec des résultats concrets. Nous transformons vos fonctions Achats et Logistique en véritables leviers de performance."}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'description', v)}
                          className="text-slate-600 text-sm sm:text-base leading-relaxed"
                        />
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
                        {csStats.map((stat: any, index: number) => (
                          <div key={index} className="corporate-card rounded-2xl p-6 text-center space-y-2 border border-slate-100 bg-slate-50">
                            <EditableText
                              as="span"
                              label="Valeur"
                              value={stat.value}
                              onSave={(v) => {
                                const updated = [...csStats];
                                updated[index] = { ...updated[index], value: v };
                                onUpdateBlockSetting?.(block.id, 'stats', updated);
                              }}
                              className="font-serif text-4xl sm:text-5xl font-extrabold text-[#002366] block"
                            />
                            <EditableText
                              as="p"
                              label="Libellé"
                              value={stat.label}
                              onSave={(v) => {
                                const updated = [...csStats];
                                updated[index] = { ...updated[index], label: v };
                                onUpdateBlockSetting?.(block.id, 'stats', updated);
                              }}
                              className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                            />
                            <div className="w-8 h-1 bg-blue-800 mx-auto rounded-full mt-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }
              case 'ServicesPreview':
                const allServices = servicesPageBlock?.settings.items || [
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
                  <section className="bg-[#002366] py-16 border-y border-blue-900 animate-fadeIn overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                      <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-md space-y-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                            Nos services
                          </div>
                          <EditableText
                            as="h2"
                            label="Titre"
                            value={block.settings.title || "Quelques-uns de nos services"}
                            onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                            className="font-serif text-3xl font-extrabold text-white leading-tight block"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 max-w-xl">
                          <EditableText
                            as="p"
                            label="Description"
                            multiline
                            value={block.settings.description || "Des solutions sur mesure pour optimiser votre performance"}
                            onSave={(v) => onUpdateBlockSetting?.(block.id, 'description', v)}
                            className="text-blue-100/80 text-sm sm:text-base flex-1 min-w-[200px]"
                          />
                          <button
                            onClick={() => onNavigate('nos-services')}
                            className="shrink-0 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 group/btn cursor-pointer transition-colors"
                          >
                            Découvrir tous nos services <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>

                      <ServicesShowcase items={displayServices} onExplore={() => onNavigate('nos-services')} />
                    </div>
                  </section>
                );
              case 'FounderSection': {
                const founderImage = block.settings.image || "/team_01.jpg";
                const founderTitle = block.settings.title || "Notre valeur ajoutée";
                const founderSubtitle = block.settings.subtitle || "Pourquoi choisir le Cabinet RE2M ?";
                const founderQuote = block.settings.quote || "Gagner grâce aux Achats et à la Logistique";
                const founderParagraphs: string[] = block.settings.paragraphs || [];

                return (
                  <section className="bg-white py-16 border-b border-slate-200 animate-fadeIn">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        <div className="lg:col-span-5 flex justify-center">
                          <div className="relative max-w-sm w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white p-1">
                            <EditableImage
                              src={founderImage}
                              alt="Roch-Emmanuel MVE-MBORO - Fondateur"
                              onSave={(v) => onUpdateBlockSetting?.(block.id, 'image', v)}
                              className="w-full h-auto rounded-2xl object-contain"
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-7 space-y-5">
                          <EditableText
                            as="div"
                            label="Badge"
                            value={founderTitle}
                            onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002366] text-xs font-semibold uppercase tracking-wider border border-blue-100"
                          />

                          <EditableText
                            as="h2"
                            label="Titre"
                            value={founderSubtitle}
                            onSave={(v) => onUpdateBlockSetting?.(block.id, 'subtitle', v)}
                            className="font-serif text-3xl font-extrabold text-[#002366]"
                          />

                          <EditableText
                            as="p"
                            label="Citation"
                            value={founderQuote}
                            onSave={(v) => onUpdateBlockSetting?.(block.id, 'quote', v)}
                            className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify font-bold italic text-blue-900"
                          />

                          <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed text-justify">
                            {founderParagraphs.map((paragraph: string, pIdx: number) => (
                              <EditableText
                                key={pIdx}
                                as="p"
                                label={`Paragraphe ${pIdx + 1}`}
                                multiline
                                value={paragraph}
                                onSave={(v) => {
                                  const updated = [...founderParagraphs];
                                  updated[pIdx] = v;
                                  onUpdateBlockSetting?.(block.id, 'paragraphs', updated);
                                }}
                              />
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
              }
              case 'Testimonials': {
                const hasTestimonials = publishedTestimonials.length > 0;
                const repeatedTesti = [...publishedTestimonials, ...publishedTestimonials, ...publishedTestimonials];

                return (
                  <section className="bg-slate-50 py-16 border-y border-slate-200 animate-fadeIn">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                        <EditableText
                          as="h2"
                          label="Titre"
                          value={block.settings.title || "Ce que disent nos clients"}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                          className="font-serif text-3xl font-extrabold text-[#002366] leading-tight"
                        />
                        <EditableText
                          as="p"
                          label="Description"
                          multiline
                          value={block.settings.description || "Découvrez les retours d'expérience des leaders sectoriels accompagnés par le Cabinet RE2M."}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'description', v)}
                          className="text-slate-500 text-sm sm:text-base"
                        />
                      </div>

                      {onUpdateBlockSetting && (
                        <p className="text-center text-[11px] text-slate-400 mb-4">
                          Les témoignages se gèrent désormais depuis le module <strong className="text-[#002366]">Témoignages</strong> (barre latérale) — le titre et la description ci-dessus restent modifiables ici.
                        </p>
                      )}

                      {hasTestimonials ? (
                        <div className="relative w-full overflow-x-hidden py-4">
                          <div className="flex gap-6 animate-marquee-testimonials whitespace-nowrap">
                            {repeatedTesti.map((testi: any, tIdx: number) => (
                              <div
                                key={tIdx}
                                className="whitespace-normal shrink-0 w-80 sm:w-96 corporate-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow duration-300 min-h-[240px]"
                              >
                                <span className="absolute top-4 right-6 font-serif text-6xl text-slate-100 select-none pointer-events-none group-hover:text-blue-50 transition-colors">
                                  ”
                                </span>

                                <div className="space-y-4 relative z-10">
                                  <p className="text-slate-600 text-sm italic leading-relaxed text-justify">{testi.text}</p>
                                </div>

                                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-100 relative z-10">
                                  {testi.logo && (
                                    <img
                                      src={testi.logo}
                                      alt={`${testi.company} logo`}
                                      className="w-12 h-12 rounded-xl object-contain border border-slate-100 p-1 bg-white shrink-0"
                                    />
                                  )}
                                  <div>
                                    <h4 className="font-serif text-sm font-bold text-[#002366]">{testi.company}</h4>
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{testi.service}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        !onUpdateBlockSetting && (
                          <div className="max-w-xl mx-auto text-center corporate-card rounded-3xl p-10 sm:p-12 bg-white border border-dashed border-slate-300">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                              <MessageSquareQuote className="w-6 h-6 text-[#002366]" />
                            </div>
                            <p className="font-serif text-lg font-bold text-[#002366]">Aucun témoignage pour le moment</p>
                            <p className="text-sm text-slate-500 mt-2">
                              Vous avez travaillé avec le Cabinet RE2M ? Soyez le premier à partager votre expérience.
                            </p>
                          </div>
                        )
                      )}

                      {!onUpdateBlockSetting && (
                        <div className="relative z-10 flex justify-center mt-10">
                          <button
                            type="button"
                            onClick={() => setIsTestimonialModalOpen(true)}
                            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                          >
                            <MessageSquareQuote className="w-4 h-4 shrink-0" />
                            {hasTestimonials ? 'Partagez votre expérience' : 'Soyez le premier à témoigner'}
                            <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}

                    </div>
                  </section>
                );
              }
              case 'Collaborations':
                return (
                  <section className="py-12 bg-white overflow-hidden border-b border-slate-100 animate-fadeIn">
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
                      // Edit mode: static, manually-scrollable row (no auto-scroll) so each logo can be replaced or removed
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
                            return repeated.map((partner, idx) =>
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
                            );
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
              {block.type === 'FounderSection' && <TeamSection members={members} />}
              {block.type === 'ServicesPreview' && (
                <>
                  <section className="bg-white py-16 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                        <h2 className="font-serif text-3xl font-extrabold text-[#002366] leading-tight">
                          Actualités du Cabinet
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base">
                          Partenariats, formations, événements : les dernières sorties du Cabinet RE2M.
                        </p>
                      </div>

                      <AutoScrollRow className="sm:hidden -mx-4 px-4">
                        {news.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => onNavigate('actualites')}
                            className="corporate-card rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col cursor-pointer group hover:shadow-lg transition-all duration-300 shrink-0 w-72 snap-start"
                          >
                            <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <span className="absolute top-3 left-3 text-[10px] font-bold text-[#002366] bg-white/90 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {item.tag}
                              </span>
                            </div>
                            <div className="p-5 space-y-2 flex-1">
                              <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug line-clamp-2">{item.title}</h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed text-justify line-clamp-3" dangerouslySetInnerHTML={{ __html: item.excerpt }} />
                              <div className="flex items-center gap-3 pt-2 mt-auto border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                                <LikeButton targetType="news" targetId={item.id} />
                                <ShareButton targetType="news" targetId={item.id} title={item.title} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </AutoScrollRow>

                      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {news.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => onNavigate('actualites')}
                            className="corporate-card rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col cursor-pointer group hover:shadow-lg transition-all duration-300"
                          >
                            <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <span className="absolute top-3 left-3 text-[10px] font-bold text-[#002366] bg-white/90 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {item.tag}
                              </span>
                            </div>
                            <div className="p-5 space-y-2 flex-1 flex flex-col">
                              <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug line-clamp-2">{item.title}</h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed text-justify line-clamp-3" dangerouslySetInnerHTML={{ __html: item.excerpt }} />
                              <div className="flex items-center gap-3 pt-2 mt-auto border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                                <LikeButton targetType="news" targetId={item.id} />
                                <ShareButton targetType="news" targetId={item.id} title={item.title} />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => onNavigate('actualites')}
                          className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center gap-3 text-[#002366] transition-colors cursor-pointer min-h-[220px] group/more"
                        >
                          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center group-hover/more:bg-blue-100 transition-colors">
                            <ArrowRight className="w-5 h-5 group-hover/more:translate-x-0.5 transition-transform" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-center px-4">Voir toutes les actualités</span>
                        </button>
                      </div>

                      <button
                        onClick={() => onNavigate('actualites')}
                        className="sm:hidden mt-4 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-[#002366] transition-colors cursor-pointer py-3.5"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">Voir toutes les actualités</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </section>

                  <BlogCarousel
                    items={articles.slice(0, 3)}
                    onSelect={() => onNavigate('blog')}
                    onViewAll={() => onNavigate('blog')}
                  />
                </>
              )}
            </div>
          );
        })}

        {/* Newsletter */}
        {!onUpdateBlockSetting && <NewsletterSignup className="border-t border-slate-100 bg-slate-50" />}

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

        <PublicTestimonialModal isOpen={isTestimonialModalOpen} onClose={() => setIsTestimonialModalOpen(false)} />
      </div>
    );
  }

  // No published content yet for this page (e.g. nothing published from the
  // visual editor) — the public site never shows stale hardcoded content.
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white text-center px-4">
      <p className="text-sm text-slate-400">Cette page n'a pas encore de contenu publié.</p>
    </div>
  );
};
export default AccueilView;
