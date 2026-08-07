import React from 'react';
import { Hero } from './Hero';
import { Award, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';

interface AccueilViewProps {
  onStartDemo: () => void;
  onNavigate: (view: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact') => void;
}

export const AccueilView: React.FC<AccueilViewProps> = ({ onStartDemo, onNavigate }) => {
  const stats = [
    { value: '25', label: "Ans d'Expérience" },
    { value: '16', label: 'Entreprises Formées' },
    { value: '42', label: 'Projets Réalisés' },
    { value: '23', label: 'Formations Certifiantes' }
  ];

  // Real clients from website with official logo links
  const partners = [
    { name: 'Olam', label: 'Agroalimentaire', logo: 'https://freepngdesign.com/content/uploads/images/p62-27-olam-4185985136.png' },
    { name: 'NSIA', label: 'Assurances & Banque', logo: 'https://nsiadirect.bj/images/nsia_30.jpg' },
    { name: 'COLAS Gabon', label: 'Infrastructures', logo: 'https://tse4.mm.bing.net/th/id/OIP.TeuJJGq0FrNo9cbaoSOijQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'BBS', label: 'Éducation & Formation', logo: 'https://www.orientation.ogooue-education.com/wp-content/uploads/listing-uploads/logo/2022/07/BBS-Logo.jpg' },
    { name: 'SGEPP', label: 'Hydrocarbures', logo: 'https://arda.africa/wp-content/uploads/2022/08/Arda_Member_Logos_SGEPP.png' },
    { name: 'BGFI', label: 'Banque', logo: 'https://madagascar.bgfi.com/media/logo-bgfibank.png' },
    { name: 'SEEG', label: 'Énergie & Eau', logo: 'https://africannuaire.com/wp-content/uploads/2017/05/LOGO-SEEG-AA-17.jpg' },
    { name: 'GAB\'OIL', label: 'Distribution Carburants', logo: 'https://th.bing.com/th/id/R.dc99f38bf45ca570c1044d1f6055bba4?rik=OmAxosCd9vLGXg&pid=ImgRaw&r=0' },
    { name: 'SCG-Ré', label: 'Réassurance', logo: 'https://tse4.mm.bing.net/th/id/OIP.Dnbzua-jcJZpJBXkcbe11wHaFF?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'NETIS', label: 'Télécoms & Énergie', logo: 'https://tse1.mm.bing.net/th/id/OIP.kgBF8e96fn7XuWW0SbADEQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'PERENCO', label: 'Pétrole & Gaz', logo: 'https://th.bing.com/th/id/R.416f199d5a0200667f7e42d6df1e3241?rik=4M35Oghc52VHow&riu=http%3a%2f%2flogonoid.com%2fimages%2fperenco-logo.png&ehk=AX2r5xs6pgn5JJuZJsUs4dLRsQMfAVJthprTVaaeaE8%3d&risl=&pid=ImgRaw&r=0' },
    { name: 'ULYSS', label: 'Logistique & Services', logo: 'https://tse3.mm.bing.net/th/id/OIP.fpqXN9RhpDnwMlnaHwKXbAHaCn?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'CDC', label: 'Caisse des Dépôts', logo: 'https://tse4.mm.bing.net/th/id/OIP.fA-62jeglLIOrrOowXTs2AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'YORHA consulting', label: 'Conseil & IT', logo: 'https://media.licdn.com/dms/image/v2/C5622AQFTtoGk3XjYTg/feedshare-shrink_800/feedshare-shrink_800/0/1577381524022?e=2147483647&v=beta&t=7YIqCOWbMGK_vwqU_27qf3uTKl8xoOjh-L4oy7xxy5w' },
    { name: 'AZUR', label: 'Télécoms', logo: 'https://fr.infosgabon.com/wp-content/uploads/2013/02/AZUR.jpg' }
  ];

  return (
    <div className="space-y-16 animate-fadeIn bg-white text-[#0f172a]">
      
      {/* Photo Slide Carousel */}
      <Hero onNavigate={onNavigate} />

      {/* 1. SECTION VALEUR AJOUTÉE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
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

          {/* Right Counter Cards */}
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

      {/* 2. SECTION FONDATEUR (VERBATIM FROM SITE OF CABINET RE2M WITH PHOTO IN ORIGINAL PROPORTIONS) */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image: more-info.jpg in original proportions */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-sm w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white p-1">
                <img
                  src="/more-info.jpg"
                  alt="Roch-Emmanuel MVE-MBORO - Fondateur"
                  className="w-full h-auto rounded-2xl object-contain"
                />
              </div>
            </div>

            {/* Right: Content Verbatim from the website */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002366] text-xs font-semibold uppercase tracking-wider border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                Notre Fondateur
              </div>

              <h2 className="font-serif text-3xl font-extrabold text-[#002366]">
                Roch-Emmanuel <em>MVE-MBORO</em>
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify">
                Expert-Consultant-Formateur en Achats & Logistique certifié par le Programme des Nations Unies pour le Développement (PNUD).
              </p>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify">
                Fort de 25 ans d'expérience internationale, il a développé une expertise reconnue dans l'optimisation des fonctions Achats et Logistique. Sa certification UNDP Procurement Certification témoigne de son excellence professionnelle.
              </p>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-700">
                <Award className="w-5 h-5 text-[#002366] shrink-0" />
                <span>Certification PNUD de niveau international, assurant rigueur et conformité.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION COLLABORATIONS (LOGOS DÉFILANTS) */}
      <section className="py-12 bg-white overflow-hidden">
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
            {/* Render twice for continuous loop */}
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

    </div>
  );
};
export default AccueilView;
