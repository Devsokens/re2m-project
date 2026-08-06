import React from 'react';
import { UserRole } from '../../types/member';

interface NavbarProps {
  currentView: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact' | 'profile' | 'admin' | 'admin-login';
  setCurrentView: (view: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact' | 'profile' | 'admin' | 'admin-login') => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeRole,
  setActiveRole
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#002366] text-white shadow-md border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Clickable Brand Logo redirects to Admin Login portal */}
        {/* Logo contains both the icon and text verbatim, styled with official proportions */}
        <div 
          onClick={() => setCurrentView('admin-login')}
          className="flex items-center cursor-pointer group"
          title="Accéder au Portail Administration Cabinet RE2M"
        >
          <img 
            src="/logo1.png" 
            alt="Cabinet RE2M Logo" 
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
          />
        </div>

        {/* Navigation Tabs (Only: Accueil, Qui nous sommes, Nos services, Contact) */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => setCurrentView('accueil')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'accueil'
                ? 'bg-white text-[#002366] shadow'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Accueil
          </button>

          <button
            onClick={() => setCurrentView('qui-nous-sommes')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'qui-nous-sommes'
                ? 'bg-white text-[#002366] shadow'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Qui nous sommes
          </button>

          <button
            onClick={() => setCurrentView('nos-services')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'nos-services'
                ? 'bg-white text-[#002366] shadow'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Nos services
          </button>

          <button
            onClick={() => setCurrentView('contact')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'contact'
                ? 'bg-white text-[#002366] shadow'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Small Admin claims switch switcher for testing */}
        <div className="flex items-center bg-white/15 border border-white/25 rounded-xl p-1">
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as UserRole)}
            className="bg-transparent text-[10px] font-bold text-white focus:outline-none px-2 py-0.5 cursor-pointer"
            title="Changer le rôle utilisateur"
          >
            <option value="SUPER_ADMIN" className="bg-[#002366] text-white">Super Admin</option>
            <option value="ADMIN" className="bg-[#002366] text-white">Admin</option>
            <option value="CONSULTANT" className="bg-[#002366] text-white">Consultant</option>
          </select>
        </div>

      </div>

      {/* Mobile Navigation Toolbar */}
      <div className="md:hidden flex items-center justify-around bg-blue-900 py-2 px-2 text-white text-[11px] font-semibold border-t border-blue-950">
        <button
          onClick={() => setCurrentView('accueil')}
          className={`py-1 px-3.5 rounded-lg ${currentView === 'accueil' ? 'bg-white text-[#002366]' : 'text-white/80'}`}
        >
          Accueil
        </button>
        <button
          onClick={() => setCurrentView('qui-nous-sommes')}
          className={`py-1 px-3.5 rounded-lg ${currentView === 'qui-nous-sommes' ? 'bg-white text-[#002366]' : 'text-white/80'}`}
        >
          Qui sommes-nous
        </button>
        <button
          onClick={() => setCurrentView('nos-services')}
          className={`py-1 px-3.5 rounded-lg ${currentView === 'nos-services' ? 'bg-white text-[#002366]' : 'text-white/80'}`}
        >
          Services
        </button>
        <button
          onClick={() => setCurrentView('contact')}
          className={`py-1 px-3.5 rounded-lg ${currentView === 'contact' ? 'bg-white text-[#002366]' : 'text-white/80'}`}
        >
          Contact
        </button>
      </div>
    </header>
  );
};
