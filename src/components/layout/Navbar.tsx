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
    <header className="relative z-40 w-full bg-[#002366] text-white shadow-md border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Clickable Brand Logo redirects to Admin Login portal */}
        {/* Responsive heights to fit mobile screens elegantly */}
        <div 
          onClick={() => setCurrentView('admin-login')}
          className="flex items-center cursor-pointer group shrink-0"
          title="Accéder au Portail Administration Cabinet RE2M"
        >
          <img 
            src="/logo1.png" 
            alt="Cabinet RE2M Logo" 
            className="h-8 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
          />
        </div>

        {/* Navigation Tabs (Only: Accueil, Qui nous sommes, Nos services, Contact) */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => setCurrentView('accueil')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'accueil'
                ? 'bg-white text-[#002366] shadow'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Accueil
          </button>

          <button
            onClick={() => setCurrentView('qui-nous-sommes')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'qui-nous-sommes'
                ? 'bg-white text-[#002366] shadow'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Qui nous sommes
          </button>

          <button
            onClick={() => setCurrentView('nos-services')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'nos-services'
                ? 'bg-white text-[#002366] shadow'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Nos services
          </button>

          <button
            onClick={() => setCurrentView('contact')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'contact'
                ? 'bg-white text-[#002366] shadow'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Small Admin claims switcher - hidden on mobile to avoid layout crowding */}
        <div className="hidden sm:flex items-center bg-white/15 border border-white/25 rounded-xl p-1 shrink-0">
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

      {/* Mobile Navigation Toolbar - Pinned at the bottom of the viewport for app-like usability */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#002366] py-3.5 px-2 text-white text-[11px] font-bold border-t border-blue-900 shadow-2xl">
        <button
          onClick={() => { setCurrentView('accueil'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`py-1 px-3.5 rounded-lg cursor-pointer ${currentView === 'accueil' ? 'bg-white text-[#002366] shadow' : 'text-white/80'}`}
        >
          Accueil
        </button>
        <button
          onClick={() => { setCurrentView('qui-nous-sommes'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`py-1 px-3.5 rounded-lg cursor-pointer ${currentView === 'qui-nous-sommes' ? 'bg-white text-[#002366] shadow' : 'text-white/80'}`}
        >
          Qui sommes-nous
        </button>
        <button
          onClick={() => { setCurrentView('nos-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`py-1 px-3.5 rounded-lg cursor-pointer ${currentView === 'nos-services' ? 'bg-white text-[#002366] shadow' : 'text-white/80'}`}
        >
          Services
        </button>
        <button
          onClick={() => { setCurrentView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`py-1 px-3.5 rounded-lg cursor-pointer ${currentView === 'contact' ? 'bg-white text-[#002366] shadow' : 'text-white/80'}`}
        >
          Contact
        </button>
      </div>
    </header>
  );
};
export default Navbar;
