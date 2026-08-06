import React from 'react';
import { ClipboardList, GraduationCap, UsersRound, CheckCircle } from 'lucide-react';

export const NosServicesView: React.FC = () => {
  const list = [
    {
      icon: ClipboardList,
      title: "Audit & Conseil en Approvisionnements",
      desc: "Nous analysons en profondeur vos processus achats, vos contrats, vos coûts et vos relations fournisseurs. Nos audits vous aident à restructurer votre supply chain et à éliminer les gaspillages.",
      details: ["Diagnostic de la fonction achats", "Cartographie des dépenses et des risques", "Optimisation des processus et flux physiques", "Assistance au sourcing de fournisseurs stratégiques"]
    },
    {
      icon: GraduationCap,
      title: "Formation Professionnelle Certifiante",
      desc: "Parce que la performance repose sur l'humain, nous dispensons des modules de formation pour vos collaborateurs, validés par notre expertise PNUD.",
      details: ["Gestion opérationnelle des stocks et inventaires", "Techniques de négociation commerciale complexes", "Gestion des contrats d'approvisionnement", "Ethique et lutte contre la fraude achats"]
    },
    {
      icon: UsersRound,
      title: "Accompagnement Opérationnel & Coaching",
      desc: "Nous ne vous laissons pas seuls avec nos rapports. Nos consultants vous accompagnent sur le terrain pour la mise en œuvre effective de nos plans d'actions.",
      details: ["Coaching de managers logistiques", "Mise en place d'outils digitaux d'évaluation", "Suivi des indicateurs de performance (KPI)", "Accompagnement à la conduite du changement"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn space-y-12 bg-white text-[#0f172a]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
          Nos Services
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366]">
          Nos Domaines d'Expertise Stratégiques
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Des services structurés pour vous faire réaliser des économies substantielles et optimiser vos flux de stockage.
        </p>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {list.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div key={idx} className="corporate-card rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366]">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#002366]">{srv.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{srv.desc}</p>
                </div>

                <ul className="space-y-2 border-t border-slate-100 pt-4">
                  {srv.details.map((det, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                      <span>{det}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <span className="text-[11px] font-bold text-[#002366]">Expertise Cabinet RE2M</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
export default NosServicesView;
