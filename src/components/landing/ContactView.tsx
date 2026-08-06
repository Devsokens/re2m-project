import React from 'react';
import { ContactForm } from './ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn space-y-12 bg-white text-[#0f172a]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
          Nous Contacter
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#002366]">
          Prenez Contact avec le Cabinet RE2M
        </h1>
        <p className="text-slate-500 text-sm">
          Nos conseillers sont disponibles pour répondre à toutes vos interrogations d'audit logistique ou de formation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#002366] mb-4">Coordonnées du Siège</h3>

          <div className="space-y-4">
            
            {/* Address */}
            <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <MapPin className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500">Adresse Physique</h4>
                <p className="text-sm text-[#002366] font-semibold mt-1">93 rue Albert AKOULOU OSSE</p>
                <p className="text-xs text-slate-500">BP 1.357 Libreville, Gabon</p>
              </div>
            </div>

            {/* Phones */}
            <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <Phone className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500">Téléphones Directs</h4>
                <p className="text-sm text-[#002366] font-semibold mt-1">+241 77 17 11 77</p>
                <p className="text-xs text-slate-500">+241 65 06 25 26</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <Mail className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500">Messagerie</h4>
                <p className="text-sm text-blue-800 font-semibold mt-1 underline">remvemboro@outlook.fr</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <Clock className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500">Heures d'Ouverture</h4>
                <p className="text-sm text-[#002366] font-semibold mt-1">Lundi - Vendredi</p>
                <p className="text-xs text-slate-500">08:00 - 17:00</p>
              </div>
            </div>

          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-500">
            <span>RCCM: RG.LBV.2017A41250</span>
            <span>NIF: 482.914Y</span>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

      </div>

    </div>
  );
};
export default ContactView;
