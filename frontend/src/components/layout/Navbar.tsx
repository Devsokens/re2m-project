import React from 'react';
import { UserRole } from '../../types/member';

type ViewType = 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login';

interface NavbarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

const NAV_ITEMS: { view: ViewType; label: string }[] = [
  { view: 'accueil', label: 'Accueil' },
  { view: 'qui-nous-sommes', label: 'Qui nous sommes' },
  { view: 'nos-services', label: 'Nos services' },
  { view: 'blog', label: 'Blog' },
  { view: 'actualites', label: 'Actualités' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#002366] text-white shadow-md border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-2 lg:grid-cols-3 items-center">

        {/* Static Brand Logo (no redirection link) */}
        <div className="flex items-center justify-self-start">
          <img
            src="/logo1.png"
            alt="Cabinet RE2M Logo"
            className="h-11 w-auto object-contain"
          />
        </div>

        {/* Navigation Tabs - centered */}
        <nav className="hidden lg:flex items-center justify-center gap-1.5 justify-self-center">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentView === item.view
                  ? 'bg-white text-[#002366] shadow'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Contact CTA - far right */}
        <div className="flex items-center justify-self-end">
          <button
            onClick={() => setCurrentView('contact')}
            className="bg-white hover:bg-slate-100 text-[#002366] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow animate-cta-pulse"
          >
            Nous contacter
          </button>
        </div>

      </div>

      {/* Mobile Navigation Toolbar */}
      <div className="lg:hidden flex items-center justify-around bg-blue-900 py-2 px-2 text-white text-[11px] font-semibold border-t border-blue-950 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            onClick={() => { setCurrentView(item.view); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`py-1 px-3 rounded-lg cursor-pointer shrink-0 ${currentView === item.view ? 'bg-white text-[#002366]' : 'text-white/80'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
export default Navbar;
