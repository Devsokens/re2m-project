import React, { useEffect, useRef, useState } from 'react';
import { Member, ActivityLog, UserRole } from '../../types/member';
import { DashboardStats } from './DashboardStats';
import { MemberTable } from './MemberTable';
import { MemberFormModal } from './MemberFormModal';
import {
  LayoutDashboard,
  Sliders,
  PenSquare,
  Newspaper,
  FileText,
  Mail,
  Inbox,
  Users,
  UserCog,
  MessageSquareQuote,
  Settings,
  LogOut,
  ChevronRight,
  User,
  CircleUserRound,
  Construction,
  Search,
  Bell
} from 'lucide-react';
import { GestionCMS } from './CMS/GestionCMS';
import { BlogAdmin } from './content/BlogAdmin';
import { ActualiteAdmin } from './content/ActualiteAdmin';
import { AccountsAdmin } from './content/AccountsAdmin';
import { TestimonialsAdmin } from './content/TestimonialsAdmin';
import { NewsletterAdmin } from './content/NewsletterAdmin';
import { RequestsAdmin } from './content/RequestsAdmin';
import { SettingsAdmin } from './content/SettingsAdmin';
import { PageSlug, CMSBlock } from '../../types/cms';

interface AdminLayoutProps {
  members: Member[];
  logs: ActivityLog[];
  onAddMember: (memberData: Member) => void;
  onUpdateMember: (memberData: Member) => void;
  onDeleteMember: (id: string) => void;
  onViewMember: (member: Member) => void;
  onViewQR: (member: Member) => void;
  onPrintCard: (member: Member) => void;
  activeRole: UserRole;
  onTogglePreview: (slug: PageSlug, blocks: CMSBlock[] | null) => void;
  activePreviewSlug: PageSlug | null;
  onLogout: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'content-editor'
  | 'content-news'
  | 'content-blog'
  | 'team'
  | 'testimonials'
  | 'newsletter'
  | 'requests'
  | 'accounts'
  | 'settings';

interface NavLeaf {
  tab: AdminTab;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  children: NavLeaf[];
}

const NAV_STRUCTURE: (NavLeaf | NavGroup)[] = [
  { tab: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  {
    label: 'Gestion de contenu',
    icon: Sliders,
    children: [
      { tab: 'content-editor', label: 'Éditeur visuel', icon: PenSquare },
      { tab: 'content-news', label: 'Actualité', icon: Newspaper },
      { tab: 'content-blog', label: 'Blog', icon: FileText }
    ]
  },
  { tab: 'team', label: "Gestion de l'équipe", icon: Users },
  { tab: 'testimonials', label: 'Témoignages', icon: MessageSquareQuote },
  { tab: 'newsletter', label: 'Newsletter', icon: Mail },
  { tab: 'requests', label: 'Demandes', icon: Inbox },
  { tab: 'accounts', label: 'Gestion des utilisateurs', icon: UserCog },
  { tab: 'settings', label: 'Paramètres', icon: Settings }
];

const isGroup = (item: NavLeaf | NavGroup): item is NavGroup => 'children' in item;

const NAV_LABELS: Record<AdminTab, string> = {
  'dashboard': 'Tableau de bord',
  'content-editor': 'Éditeur visuel',
  'content-news': 'Actualité',
  'content-blog': 'Blog',
  'team': "Gestion de l'équipe",
  'testimonials': 'Témoignages',
  'newsletter': 'Newsletter',
  'requests': 'Demandes',
  'accounts': 'Gestion des utilisateurs',
  'settings': 'Paramètres'
};

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CONSULTANT: 'Consultant'
};

const ComingSoon: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col items-center justify-center text-center gap-3 py-20 corporate-card rounded-3xl border border-slate-200 bg-white">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
      <Construction className="w-6 h-6 text-[#002366]" />
    </div>
    <div>
      <p className="font-serif text-base font-bold text-[#002366]">{label}</p>
      <p className="text-xs text-slate-500 mt-1">Ce module sera bientôt disponible.</p>
    </div>
  </div>
);

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onViewMember,
  onViewQR,
  onPrintCard,
  activeRole,
  onTogglePreview,
  activePreviewSlug,
  onLogout
}) => {
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isContentGroupOpen, setIsContentGroupOpen] = useState(
    adminTab === 'content-editor' || adminTab === 'content-news' || adminTab === 'content-blog'
  );
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAddForm = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (member: Member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleSaveForm = (memberData: Member) => {
    if (editingMember) {
      onUpdateMember(memberData);
    } else {
      onAddMember(memberData);
    }
  };

  const renderNavButton = (item: NavLeaf, extraClass = '') => {
    const Icon = item.icon;
    const isActive = adminTab === item.tab;
    return (
      <button
        key={item.tab}
        onClick={() => setAdminTab(item.tab)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${extraClass} ${
          isActive
            ? 'bg-white text-[#002366] shadow'
            : 'text-white/75 hover:text-white hover:bg-white/10'
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.tab === 'team' && (
          <span className={`ml-auto text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-blue-50 text-[#002366]' : 'bg-white/10 text-white/80'}`}>
            {members.length}
          </span>
        )}
      </button>
    );
  };

  const sidebarNav = (
    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
      {NAV_STRUCTURE.map((item, idx) => {
        if (isGroup(item)) {
          const GroupIcon = item.icon;
          return (
            <div key={idx}>
              <button
                onClick={() => setIsContentGroupOpen((o) => !o)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white/75 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <GroupIcon className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1 text-left">{item.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isContentGroupOpen ? 'rotate-90' : ''}`} />
              </button>
              {isContentGroupOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-blue-900 space-y-1">
                  {item.children.map((child) => renderNavButton(child))}
                </div>
              )}
            </div>
          );
        }
        return renderNavButton(item);
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* Sidebar - stays fixed while content scrolls */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#002366] text-white flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 border-b border-blue-900 shrink-0">
          <img src="/logo1.png" alt="Cabinet RE2M Logo" className="h-9 w-auto object-contain" />
        </div>

        {sidebarNav}

        {/* Account / profile - always visible at the bottom */}
        <div ref={accountMenuRef} className="relative border-t border-blue-900 p-3 shrink-0">
          <button
            onClick={() => setIsAccountMenuOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <CircleUserRound className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-bold text-white truncate">Administrateur</p>
              <p className="text-[10px] text-blue-200/80 truncate">{ROLE_LABELS[activeRole]}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-white/60 shrink-0 transition-transform ${isAccountMenuOpen ? '-rotate-90' : ''}`} />
          </button>

          {isAccountMenuOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-scaleUp">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-[#0f172a]">Mon compte</p>
              </div>
              <button
                onClick={() => setIsAccountMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#0f172a] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-[#002366]" />
                Profil
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Mobile top bar (sidebar collapses under lg) */}
        <div className="lg:hidden bg-[#002366] text-white px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto sticky top-0 z-30">
          <div className="flex items-center gap-1.5">
            {NAV_STRUCTURE.flatMap((item) => (isGroup(item) ? item.children : [item])).map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setAdminTab(item.tab)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive ? 'bg-white text-[#002366]' : 'text-white/75'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
          <button
            onClick={onLogout}
            className="shrink-0 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-5 bg-white border-b border-slate-200">
          <h1 className="font-serif text-lg font-bold text-[#002366] shrink-0">{NAV_LABELS[adminTab]}</h1>

          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un membre, un article, une demande..."
              className="w-full bg-slate-50 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            className="relative shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors ml-auto"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 text-[#002366]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border border-white" />
          </button>
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {adminTab === 'dashboard' && <DashboardStats members={members} />}

          {adminTab === 'content-editor' && (
            <GestionCMS
              onTogglePreview={onTogglePreview}
              activePreviewSlug={activePreviewSlug}
            />
          )}

          {adminTab === 'content-news' && <ActualiteAdmin />}

          {adminTab === 'content-blog' && <BlogAdmin />}

          {adminTab === 'team' && (
            <MemberTable
              members={members}
              onAddMember={handleOpenAddForm}
              onEditMember={handleOpenEditForm}
              onDeleteMember={onDeleteMember}
              onViewMember={onViewMember}
              onViewQR={onViewQR}
              onPrintCard={onPrintCard}
              userRole={activeRole}
            />
          )}

          {adminTab === 'testimonials' && <TestimonialsAdmin />}

          {adminTab === 'newsletter' && <NewsletterAdmin />}

          {adminTab === 'requests' && <RequestsAdmin />}

          {adminTab === 'accounts' && <AccountsAdmin />}

          {adminTab === 'settings' && <SettingsAdmin />}
        </main>
      </div>

      {/* Member Form Modal */}
      <MemberFormModal
        member={editingMember}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
      />

    </div>
  );
};
