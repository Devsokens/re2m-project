import React from 'react';
import { Target, Zap, Gauge, GraduationCap, Sparkles, CheckCircle2, Award, Users } from 'lucide-react';

export const Features: React.FC = () => {
  const stats = [
    {
      value: '25+',
      label: 'Ans d’Expérience',
      desc: 'Expertise internationale dans le conseil achats'
    },
    {
      value: '16',
      label: 'Entreprises Formées',
      desc: 'SEEG, COLAS, PERENCO, SGEPP, CDC...'
    },
    {
      value: '42',
      label: 'Projets Réalisés',
      desc: 'Diagnostics, audits et optimisations logistiques'
    },
    {
      value: '23',
      label: 'Formations Certifiantes',
      desc: 'Programmes opérationnels sur-mesure'
    }
  ];

  const services = [
    {
      title: 'Audit & Conseil',
      desc: 'Diagnostic complet de vos fonctions Achats et Logistique. Recommandations stratégiques pour l\'optimisation de vos processus, la réduction des coûts et l\'amélioration de votre performance.'
    },
    {
      title: 'Formation Certifiante',
      desc: 'Formations pratiques en gestion des achats, rédaction de contrats, gestion des stocks, techniques de négociation et relation fournisseurs avec transfert de compétences garanti.'
    },
    {
      title: 'Accompagnement & Coaching',
      desc: 'Accompagnement personnalisé pour la mise en œuvre de solutions innovantes. Suivi des indicateurs clés (KPI) et outils d\'amélioration continue pour consolider vos acquis.'
    }
  ];

  return (
    <div className="space-y-20 py-20">
      
      {/* SECTION: QUI NOUS SOMMES */}
      <section id="qui-nous-sommes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border-sky-500/30 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Founder Bio */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-sky-500/30 text-sky-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Qui sommes-nous • Cabinet RE2M
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              À propos de notre cabinet & <br />
              <span className="text-sky-300">Notre Fondateur</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Le <strong>Cabinet RE2M</strong> est un cabinet d'audit, de conseil, de formation et d'accompagnement en Achats et Logistique. Dirigé par <strong>Roch-Emmanuel MVE-MBORO</strong>, Expert-Consultant-Formateur certifié par le Programme des Nations Unies pour le Développement (PNUD).
            </p>

            <p className="text-slate-300 text-sm leading-relaxed">
              Fort de 25 ans d'expérience internationale, nous accompagnons les grandes entreprises et administrations d'Afrique centrale dans l'amélioration de leur chaîne d'approvisionnement et la rentabilisation de leurs dépenses.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Award className="w-5 h-5 text-sky-300 shrink-0" />
              <span className="text-xs font-semibold text-sky-200">
                UNDP Procurement Certification (Nations Unies)
              </span>
            </div>
          </div>

          {/* Facts grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="font-serif text-3xl font-extrabold text-white">{stat.value}</span>
                <p className="text-xs font-bold text-sky-300">{stat.label}</p>
                <p className="text-[10px] text-slate-400 leading-normal">{stat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION: NOS SERVICES */}
      <section id="nos-services" className="bg-slate-900/40 border-y border-sky-500/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-sky-500/30 text-sky-200 text-xs font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              Prestations Stratégiques
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Nos Domaines d'Intervention
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Des solutions sur-mesure pour transformer vos fonctions achats en leviers de rentabilité majeurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((srv, idx) => (
              <div 
                key={idx}
                className="glass-card rounded-3xl p-6 relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 border border-sky-500/30 flex items-center justify-center text-sky-300">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">{srv.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-sky-300">Expertise RE2M Connect</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
