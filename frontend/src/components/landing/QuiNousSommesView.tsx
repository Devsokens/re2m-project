import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle, Plus, X } from 'lucide-react';
import { partners } from '../../data/partners';
import { CMSBlock } from '../../types/cms';
import { TeamSection } from './TeamSection';
import { Member } from '../../types/member';
import { EditableText } from '../admin/editable/EditableText';
import { EditableImage } from '../admin/editable/EditableImage';
import { apiClient, ApiError } from '../../lib/apiClient';

interface QuiNousSommesViewProps {
  blocks?: CMSBlock[];
  onSelectBlock?: (blockId: string) => void;
  selectedBlockId?: string | null;
  renderBlockEditor?: (block: CMSBlock) => React.ReactNode;
  onUpdateBlockSetting?: (blockId: string, key: string, value: any) => void;
  members?: Member[];
}

export const QuiNousSommesView: React.FC<QuiNousSommesViewProps> = ({ blocks, onSelectBlock, selectedBlockId, renderBlockEditor, onUpdateBlockSetting, members = [] }) => {
  if (blocks && blocks.length > 0) {
    return (
      <div className="animate-fadeIn space-y-12 bg-white text-[#0f172a] pb-16">
        {blocks.map((block) => {
          if (!onSelectBlock && !block.enabled) return null;

          const renderBlockContent = () => {
            switch (block.type) {
              case 'HeaderBanner':
                return (
                  <div className="relative w-full py-24 overflow-hidden">
                    <EditableImage
                      src={block.settings.backgroundImage || '/qui_nous_sommes_bg.jpg'}
                      alt="Bannière"
                      onSave={(v) => onUpdateBlockSetting?.(block.id, 'backgroundImage', v)}
                      containerClassName="absolute inset-0 w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#002366]/55 via-[#002366]/25 to-[#002366]/55 pointer-events-none" />
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      <div className="max-w-3xl mx-auto space-y-4">
                        <EditableText
                          as="h1"
                          label="Titre"
                          value={block.settings.title}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                          className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,35,102,0.8)]"
                        />
                        <EditableText
                          as="p"
                          label="Description"
                          multiline
                          value={block.settings.description}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'description', v)}
                          className="text-slate-100 text-sm sm:text-base leading-relaxed drop-shadow-[0_1px_4px_rgba(0,35,102,0.9)] font-medium"
                        />
                      </div>
                    </div>
                  </div>
                );
              case 'PresentationGrid': {
                const commitments = block.settings.commitments || [];
                return (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                      <div className="space-y-6">
                        <EditableText
                          as="h2"
                          label="Titre"
                          value={block.settings.title}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'title', v)}
                          className="font-serif text-2xl font-bold text-[#002366]"
                        />
                        <EditableText
                          as="p"
                          label="Paragraphe 1"
                          multiline
                          value={block.settings.desc1}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'desc1', v)}
                          className="text-slate-600 text-sm leading-relaxed"
                        />
                        <EditableText
                          as="p"
                          label="Paragraphe 2"
                          multiline
                          value={block.settings.desc2}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'desc2', v)}
                          className="text-slate-600 text-sm leading-relaxed"
                        />
                      </div>
                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 space-y-6">
                        <EditableText
                          as="h3"
                          label="Titre des engagements"
                          value={block.settings.commitmentsTitle || "Nos Engagements Clés"}
                          onSave={(v) => onUpdateBlockSetting?.(block.id, 'commitmentsTitle', v)}
                          className="font-serif text-xl font-bold text-[#002366]"
                        />
                        <div className="space-y-4">
                          {commitments.map((comm: any, cIdx: number) => (
                            <div key={cIdx} className="flex gap-3">
                              <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <EditableText
                                  as="h4"
                                  label={`Engagement ${cIdx + 1} — titre`}
                                  value={comm.title}
                                  onSave={(v) => {
                                    const updated = [...commitments];
                                    updated[cIdx] = { ...updated[cIdx], title: v };
                                    onUpdateBlockSetting?.(block.id, 'commitments', updated);
                                  }}
                                  className="font-bold text-sm text-[#002366]"
                                />
                                <EditableText
                                  as="p"
                                  label={`Engagement ${cIdx + 1} — description`}
                                  value={comm.desc}
                                  onSave={(v) => {
                                    const updated = [...commitments];
                                    updated[cIdx] = { ...updated[cIdx], desc: v };
                                    onUpdateBlockSetting?.(block.id, 'commitments', updated);
                                  }}
                                  className="text-xs text-slate-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              case 'DirectorMessage': {
                const directorParagraphs: string[] = block.settings.paragraphs || [];
                return (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg space-y-8">
                      <div className="border-b border-slate-200 pb-4">
                        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366]">
                          Mot du <em>Directeur</em>
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-8 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
                          <EditableText
                            as="h3"
                            label="Sous-titre"
                            value={block.settings.subtitle || "Bienvenue au Cabinet RE2M, votre partenaire stratégique"}
                            onSave={(v) => onUpdateBlockSetting?.(block.id, 'subtitle', v)}
                            className="font-serif text-base font-bold text-[#002366]"
                          />
                          {directorParagraphs.map((p: string, pIdx: number) => (
                            <EditableText
                              key={pIdx}
                              as="p"
                              label={`Paragraphe ${pIdx + 1}`}
                              multiline
                              value={p}
                              onSave={(v) => {
                                const updated = [...directorParagraphs];
                                updated[pIdx] = v;
                                onUpdateBlockSetting?.(block.id, 'paragraphs', updated);
                              }}
                            />
                          ))}
                          <div className="pt-4 text-right">
                            <EditableText
                              as="strong"
                              label="Nom du directeur"
                              value={block.settings.directorName || "Roch-Emmanuel MVE-MBORO"}
                              onSave={(v) => onUpdateBlockSetting?.(block.id, 'directorName', v)}
                              className="block text-sm font-serif text-[#002366]"
                            />
                            <EditableText
                              as="span"
                              label="Fonction"
                              value={block.settings.directorTitle || "Directeur Général, Cabinet RE2M"}
                              onSave={(v) => onUpdateBlockSetting?.(block.id, 'directorTitle', v)}
                              className="text-[11px] text-slate-500"
                            />
                          </div>
                        </div>
                        <div className="lg:col-span-4 flex flex-col items-center">
                          <div className="p-1 rounded-2xl bg-white border border-slate-200 shadow-md max-w-[250px] w-full">
                            <EditableImage
                              src={block.settings.image || "/team_01.jpg"}
                              alt={`${block.settings.directorName || "Roch-Emmanuel MVE-MBORO"} - Directeur Général`}
                              onSave={(v) => onUpdateBlockSetting?.(block.id, 'image', v)}
                              className="w-full h-auto rounded-xl object-contain"
                            />
                          </div>
                          <div className="mt-3 text-center">
                            <p className="text-xs font-bold text-[#002366]">{block.settings.directorName || "Roch-Emmanuel MVE-MBORO"}</p>
                            <p className="text-[10px] text-slate-400 font-semibold italic">Directeur Général</p>
                          </div>
                        </div>
                      </div>
                    </section>
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
              {block.type === 'Collaborations' && <TeamSection members={members} />}
              {renderBlockContent()}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback Statique
  return (
    <div className="animate-fadeIn space-y-12 bg-white text-[#0f172a] pb-16">

      {/* Header Banner Section */}
      <div
        className="relative w-full py-24 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/qui_nous_sommes_bg.jpg')",
          backgroundPosition: 'center 15%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#002366]/55 via-[#002366]/25 to-[#002366]/55" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,35,102,0.8)]">
              Cabinet RE2M • L'Excellence Achats & Logistique
            </h1>

            <p className="text-slate-100 text-sm sm:text-base leading-relaxed drop-shadow-[0_1px_4px_rgba(0,35,102,0.9)] font-medium">
              Depuis 25 ans, nous accompagnons nos clients à Libreville, au Gabon et à l'international dans l'amélioration de leur performance achats.
            </p>
          </div>
        </div>
      </div>

      {/* Presentation Overview Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#002366]">Cabinet RE2M par Roch-Emmanuel MVE-MBORO</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Le <strong>Cabinet RE2M</strong> est un cabinet d'audit, de conseil, de formation, d'accompagnement et de coaching en Achats et Logistique. Nous intervenons dans l'organisation, la réorganisation et l'optimisation des fonctions Achats & Logistique des organisations.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Avec 25 ans de pratique et d'expérience dans le monde dont un accent particulier sur le local, nous garantissons des résultats probants dans des environnements et contextes variés.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#002366]">Nos Engagements Clés</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#002366]">Rigueur & Déontologie</h4>
                  <p className="text-xs text-slate-500">Respect des normes éthiques internationales.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#002366]">Résultats Mesurables</h4>
                  <p className="text-xs text-slate-500">Chaque audit débouche sur des économies concrètes.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#002366]">Proximité Locale</h4>
                  <p className="text-xs text-slate-500">Présence forte à Libreville pour un suivi direct.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION MESSAGE DU DIRECTEUR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366]">
              Mot du <em>Directeur</em>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Bienvenue au Cabinet RE2M, votre partenaire stratégique</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              <h3 className="font-serif text-base font-bold text-[#002366]">
                Bienvenue au Cabinet RE2M, votre partenaire stratégique
              </h3>
              <p>Chers visiteurs, clients et partenaires,</p>
              <p>
                C'est avec un grand plaisir que je vous accueille sur le site web du Cabinet RE2M. Je tiens à remercier chaleureusement nos clients fidèles pour la confiance qu'ils nous témoignent depuis maintenant temps, une confiance qui est le moteur de notre engagement quotidien.
              </p>
              <p>
                Dans un environnement professionnel en constante évolution, notre mission est claire : vous accompagner dans vos défis et ambitions afin de vous faire « gagner grâce aux Achats » en vous apportant des solutions de conseil sur mesure, innovantes et à forte valeur ajoutée.
              </p>
              <p>
                Au Cabinet RE2M, nous croyons fermement que le succès de nos clients est la mesure de notre propre réussite. Notre équipe de consultants expérimentés, hautement qualifiés dans leurs domaines respectifs, met à votre disposition une expertise solide et pertinente, forgée par vingt-cinq années de pratique sur le terrain.
              </p>
              <p>
                Nous privilégions une approche collaborative et humaine, où l'écoute active et la compréhension fine de vos enjeux spécifiques sont primordiales. Notre objectif est de construire un partenariat fort et durable, basé sur la transparence, l'excellence et des résultats tangibles.
              </p>
              <p>
                Je vous invite à parcourir les différentes sections de notre site pour découvrir l'étendue de nos services et nos domaines d'expertise. Que vous soyez une start-up, une PME ou un grand groupe, nous sommes prêts à relever vos défis à vos côtés.
              </p>
              <p>
                N'hésitez pas à nous contacter pour échanger sur vos projets. Votre opinion nous est précieuse et nous permettra d'effectuer les ajustements nécessaires pour vous offrir un service d'une qualité optimale.
              </p>
              <p>Au plaisir de collaborer prochainement,</p>

              <div className="pt-4 text-right">
                <strong className="block text-sm font-serif text-[#002366]">Roch-Emmanuel MVE-MBORO</strong>
                <span className="text-[11px] text-slate-500">Directeur Général, Cabinet RE2M</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="p-1 rounded-2xl bg-white border border-slate-200 shadow-md max-w-[250px] w-full">
                <img
                  src="/team_01.jpg"
                  alt="Roch-Emmanuel MVE-MBORO - Directeur Général"
                  className="w-full h-auto rounded-xl object-contain"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs font-bold text-[#002366]">Roch-Emmanuel MVE-MBORO</p>
                <p className="text-[10px] text-slate-400 font-semibold italic">Directeur Général</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <TeamSection members={members} />

      {/* SECTION IL NOUS FONT CONFIANCE */}
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
export default QuiNousSommesView;
