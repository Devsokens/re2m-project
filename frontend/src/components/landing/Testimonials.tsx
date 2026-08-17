import React from 'react';
import { Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      quote: "Le Cabinet RE2M nous a accompagnés dans la mise en place de notre gestion de la relation fournisseurs. Des résultats concrets, mesurables et une méthodologie éprouvée.",
      author: "COLAS Gabon",
      role: "Formation & Accompagnement",
      org: "Libreville",
      rating: 5
    },
    {
      quote: "Une expertise remarquable en gestion des stocks et de la supply chain. Une équipe professionnelle, réactive et toujours à l'écoute de nos besoins spécifiques.",
      author: "SEEG",
      role: "Formation & Conseil",
      org: "Libreville",
      rating: 5
    },
    {
      quote: "Des formations pratiques et opérationnelles en négociation et relation fournisseurs qui ont directement impacté notre performance achats au quotidien.",
      author: "SGEPP",
      role: "Formation Achats",
      org: "Gabon",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            <Quote className="w-3.5 h-3.5" /> Témoignages & Retours Clients
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">
            Ils nous font confiance
          </h2>
          <p className="text-slate-400 text-sm">
            Des entreprises leaders de leur secteur partenaires du Cabinet RE2M.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-sky-300 gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-sky-300 text-sky-300" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  « {rev.quote} »
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-900 border border-sky-500/40 flex items-center justify-center font-serif text-sm font-bold text-sky-200">
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white">{rev.author}</h4>
                  <p className="text-[11px] text-sky-300 font-medium">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
