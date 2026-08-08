import React from 'react';
import { ShieldCheck, Award, QrCode, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact' | 'profile' | 'admin' | 'admin-login') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-slate-950 border-t border-sky-500/20 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand info */}
        <div className="space-y-4 md:col-span-2">
          
          {/* Clickable Brand Logo redirects to Admin Login portal */}
          {/* Rendered exactly like the header logo with same proportions and no white background wrapper */}
          <div 
            onClick={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center cursor-pointer group w-fit"
            title="Accéder au Portail Administration Cabinet RE2M"
          >
            <img 
              src="/logo1.png" 
              alt="Cabinet RE2M Logo" 
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </div>

          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Cabinet d'audit, de conseil, de formation, d'accompagnement et de coaching en Achats et Logistique. RCCM: RG.LBV.2017A41250 - NIF: 482.914Y.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300 flex-wrap">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-sky-300" /> WCAG 2.1 AA</span>
            <span className="flex items-center gap-1"><QrCode className="w-4 h-4 text-sky-300" /> QR Code vCard 4.0</span>
            <span className="flex items-center gap-1"><Award className="w-4 h-4 text-sky-300" /> Certifié PNUD</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-sm font-semibold text-white mb-3 tracking-wider uppercase text-sky-300">
            Navigation PWA
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button 
                onClick={() => { setCurrentView('accueil'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-sky-300 transition-colors text-left cursor-pointer font-semibold"
              >
                Accueil
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentView('qui-nous-sommes'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-sky-300 transition-colors text-left cursor-pointer font-semibold"
              >
                Qui sommes-nous
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentView('nos-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-sky-300 transition-colors text-left cursor-pointer font-semibold"
              >
                Nos Services
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-sky-300 transition-colors text-left cursor-pointer font-semibold"
              >
                Contactez-Nous
              </button>
            </li>
          </ul>
        </div>

        {/* Coordonnées Cabinet */}
        <div>
          <h4 className="font-serif text-sm font-semibold text-white mb-3 tracking-wider uppercase text-sky-300">
            Siège Social
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed text-xs font-semibold">
            93 rue Albert AKOULOU OSSE<br />
            BP 1.357 Libreville, Gabon<br />
            Tél: +241 77 17 11 77 / 65 06 25 26<br />
            Email: remvemboro@outlook.fr
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 Cabinet RE2M. Tous droits réservés. RCCM: RG.LBV.2017A41250 - NIF: 482.914Y.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0 text-sky-300/80 font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Conçu selon les normes internationales & professionnelles
        </p>
      </div>
    </footer>
  );
};
export default Footer;
