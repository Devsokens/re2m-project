import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle } from 'lucide-react';
import { partners } from '../../data/partners';

export const QuiNousSommesView: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-12 bg-white text-[#0f172a] pb-16">

      {/* Header Banner Section with Background Image (Raised Position) */}
      <div 
        className="relative w-full py-24 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: "url('/qui_nous_sommes_bg.jpg')",
          backgroundPosition: 'center 15%' 
        }}
      >
        {/* Diluted overlay (25% in center to show faces clearly, 55% at ends for text contrast) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#002366]/55 via-[#002366]/25 to-[#002366]/55" />

        {/* Header content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-sky-200 bg-[#002366]/70 px-3.5 py-1 rounded-full border border-sky-500/40 uppercase tracking-widest inline-block shadow-sm">
              Qui Sommes-Nous
            </span>

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

          {/* Vision & Values card */}
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

      {/* SECTION MESSAGE DU DIRECTEUR (VERBATIM FROM SITE) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366]">
              Mot du <em>Directeur</em>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Bienvenue au Cabinet RE2M, votre partenaire stratégique</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Verbatim Text */}
            <div className="lg:col-span-8 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              <h3 className="font-serif text-base font-bold text-[#002366]">
                Bienvenue au Cabinet RE2M, votre partenaire stratégique
              </h3>
              <p>Chers visiteurs, clients et partenaires,</p>
              <p>
                C'est avec un grand plaisir que je vous accueille sur le site web du Cabinet RE2M. Je tiens à remercier chaleureusement nos clients fidèles pour la confiance qu'ils nous témoignent depuis maintenant cinq (5) ans, une confiance qui est le moteur de notre engagement quotidien.
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
                N'hésitez pas à nous contacter pour échanger sur vos projets. Votre opinion nous est précieuse et nous permettra d'effectuer les ajustements nécessaires pour vous offer un service d'une qualité optimale.
              </p>
              <p>Au plaisir de collaborer prochainement,</p>

              <div className="pt-4 text-right">
                <strong className="block text-sm font-serif text-[#002366]">Roch-Emmanuel MVE-MBORO</strong>
                <span className="text-[11px] text-slate-500">Directeur Général, Cabinet RE2M</span>
              </div>
            </div>

            {/* Right: Director Photo */}
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

      {/* SECTION COLLABORATIONS (LOGOS DÉFILANTS - EXTENSION DE BOUT EN BOUT) */}
      <section className="py-12 bg-white overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-[#002366]">
            Ils nous font confiance
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Des entreprises leaders de leur secteur partenaires du Cabinet RE2M
          </p>
        </div>

        {/* Scrolling Marquee Container */}
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

export default QuiNousSommesView;
