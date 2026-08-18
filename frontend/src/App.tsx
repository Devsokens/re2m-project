import React, { useState, useEffect } from 'react';
import { Member, ActivityLog, UserRole } from './types/member';
import { INITIAL_MEMBERS, INITIAL_LOGS } from './data/mockMembers';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { BackToTop } from './components/layout/BackToTop';
import { InstallPrompt } from './components/layout/InstallPrompt';
import { AccueilView } from './components/landing/AccueilView';
import { QuiNousSommesView } from './components/landing/QuiNousSommesView';
import { NosServicesView } from './components/landing/NosServicesView';
import { BlogView } from './components/landing/BlogView';
import { ActualitesView } from './components/landing/ActualitesView';
import { ContactView } from './components/landing/ContactView';
import { TestimonialSubmissionForm } from './components/landing/TestimonialSubmissionForm';
import { MemberCardPublic } from './components/card/MemberCardPublic';
import { MemberViewModal } from './components/card/MemberViewModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin, AuthenticatedAdmin } from './components/admin/AdminLogin';
import { QRCodeModal } from './components/card/QRCodeModal';
import { PrintCardView } from './components/card/PrintCardView';
import { PageSlug, CMSBlock } from './types/cms';
import { cmsStorage } from './utils/cmsStorage';
import { apiClient, authToken } from './lib/apiClient';
import { getVisitorKey } from './utils/engagementStore';
import { PageLoader } from './components/layout/PageLoader';

const PAGE_SLUGS: PageSlug[] = ['accueil', 'qui-nous-sommes', 'nos-services', 'contact'];

export function App() {
  // CMS Preview States
  const [activePreviewSlug, setActivePreviewSlug] = useState<PageSlug | null>(null);
  const [previewBlocks, setPreviewBlocks] = useState<Record<PageSlug, CMSBlock[] | null>>({
    'accueil': null,
    'qui-nous-sommes': null,
    'nos-services': null,
    'contact': null
  });

  const handleTogglePreview = (slug: PageSlug, blocks: CMSBlock[] | null) => {
    setPreviewBlocks((prev) => ({
      ...prev,
      [slug]: blocks
    }));
    setActivePreviewSlug(blocks ? slug : null);
  };

  // API-backed members state (GET /api/members is public, writes require admin auth)
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  // Published CMS content for the public site — one fetch per page slug.
  const [publishedBlocks, setPublishedBlocks] = useState<Record<PageSlug, CMSBlock[]>>({
    'accueil': [],
    'qui-nous-sommes': [],
    'nos-services': [],
    'contact': []
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Member[]>('/api/members')
      .then(setMembers)
      .catch((err) => console.error('Impossible de charger les membres :', err));
  }, []);

  useEffect(() => {
    Promise.all(PAGE_SLUGS.map((slug) => cmsStorage.getPublishedLayout(slug).then((blocks) => [slug, blocks] as const)))
      .then((entries) => {
        setPublishedBlocks(Object.fromEntries(entries) as Record<PageSlug, CMSBlock[]>);
      })
      .catch((err) => console.error('Impossible de charger le contenu du site :', err))
      .finally(() => setIsInitialLoading(false));
  }, []);

  // View state: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login'
  const [currentView, setCurrentView] = useState<'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login'>('accueil');
  const [previousView, setPreviousView] = useState<'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login'>('accueil');

  const handleNavigate = (view: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login') => {
    if (currentView !== 'profile') {
      setPreviousView(currentView);
    }
    setCurrentView(view);
    apiClient.post('/api/analytics/pageviews', { path: `/${view}`, visitorKey: getVisitorKey() }).catch(() => {});
  };

  // Selected member for profile view
  const [selectedMember, setSelectedMember] = useState<Member>(INITIAL_MEMBERS[0]);

  // Authenticated admin (set on real login via /api/auth/login — replaces the old hardcoded gate)
  const [currentAdmin, setCurrentAdmin] = useState<AuthenticatedAdmin | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('CONSULTANT');

  const handleLoginSuccess = (admin: AuthenticatedAdmin) => {
    apiClient.clearCache();
    setCurrentAdmin(admin);
    setActiveRole(admin.role);
    handleNavigate('admin');
  };

  const handleLogout = () => {
    authToken.clear();
    apiClient.clearCache();
    setCurrentAdmin(null);
    handleNavigate('accueil');
  };

  // Restores the admin session on a hard refresh — without this, a valid
  // token was still sitting in localStorage but currentAdmin/currentView
  // always reset to signed-out/public on mount, which looked exactly like
  // being logged out every time the admin panel was reloaded.
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  useEffect(() => {
    const token = authToken.get();
    if (!token) {
      setIsAuthChecking(false);
      return;
    }
    apiClient
      .get<{ user: AuthenticatedAdmin }>('/api/auth/me')
      .then(({ user }) => {
        setCurrentAdmin(user);
        setActiveRole(user.role);
        setCurrentView('admin');
      })
      .catch(() => authToken.clear())
      .finally(() => setIsAuthChecking(false));
  }, []);

  useEffect(() => {
    apiClient.post('/api/analytics/pageviews', { path: '/accueil', visitorKey: getVisitorKey() }).catch(() => {});
  }, []);

  // Modal states for global quick triggers
  const [qrModalMember, setQrModalMember] = useState<Member | null>(null);
  const [printModalMember, setPrintModalMember] = useState<Member | null>(null);
  const [viewModalMember, setViewModalMember] = useState<Member | null>(null);

  // PWA Install Event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const refreshActivityLogs = () => {
    apiClient
      .get<ActivityLog[]>('/api/activity-logs')
      .then(setLogs)
      .catch((err) => console.error('Impossible de charger le journal d\'activité :', err));
  };

  useEffect(() => {
    if (currentView === 'admin') refreshActivityLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Reveal page sections as the user scrolls, on every public view
  useEffect(() => {
    if (currentView === 'admin') return;

    const sections = Array.from(document.querySelectorAll('main section')) as HTMLElement[];
    sections.forEach((el) => el.classList.add('reveal-init'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    sections.forEach((el) => observer.observe(el));

    // Safety net in case an element is never intersected (e.g. very short pages)
    const fallback = window.setTimeout(() => {
      sections.forEach((el) => el.classList.add('is-visible'));
    }, 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [currentView]);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Member CRUD actions — persisted through the API (backend/src/controllers/members.controller.ts
  // also writes the matching activity_logs row server-side, so we just refresh afterwards).
  const handleAddMember = (newMemberData: Member) => {
    apiClient
      .post<Member>('/api/members', newMemberData)
      .then((created) => {
        setMembers((prev) => [created, ...prev]);
        refreshActivityLogs();
      })
      .catch((err) => console.error('Impossible de créer le membre :', err));
  };

  const handleUpdateMember = (updatedMemberData: Member) => {
    apiClient
      .put<Member>(`/api/members/${updatedMemberData.id}`, updatedMemberData)
      .then((updated) => {
        setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        if (selectedMember.id === updated.id) {
          setSelectedMember(updated);
        }
        refreshActivityLogs();
      })
      .catch((err) => console.error('Impossible de mettre à jour le membre :', err));
  };

  const handleDeleteMember = (id: string) => {
    apiClient
      .delete(`/api/members/${id}`)
      .then(() => {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        refreshActivityLogs();
      })
      .catch((err) => console.error('Impossible de supprimer le membre :', err));
  };

  const handleOpenMemberProfile = (member: Member) => {
    apiClient
      .post<Member>(`/api/members/${member.id}/scan`)
      .then((updated) => {
        setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        setSelectedMember(updated);
      })
      .catch((err) => {
        console.error('Impossible d\'enregistrer la consultation :', err);
        setSelectedMember(member);
      });
    setPreviousView(currentView);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Public, unauthenticated testimonial submission link (?testimonial=TOKEN)
  const testimonialToken = new URLSearchParams(window.location.search).get('testimonial');
  if (testimonialToken) {
    return <TestimonialSubmissionForm token={testimonialToken} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f172a] font-sans selection:bg-[#002366] selection:text-white">
      
      {/* Offline PWA Notification Banner */}
      <OfflineBanner />

      {/* Persistent CMS Preview Warning Bar */}
      {activePreviewSlug && (
        <div className="bg-amber-600 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 flex items-center justify-center gap-4 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span>Mode Prévisualisation Actif (Page: <strong className="uppercase">{activePreviewSlug}</strong>) — Les modifications de brouillon sont affichées mais non publiées.</span>
          <button 
            onClick={() => handleTogglePreview(activePreviewSlug, null)}
            className="bg-white/25 hover:bg-white/40 px-3 py-1 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors"
          >
            Quitter l'Aperçu
          </button>
        </div>
      )}

      {/* Main Navbar */}
      {currentView !== 'admin' && currentView !== 'admin-login' && (
        <Navbar
          currentView={currentView}
          setCurrentView={handleNavigate}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
        />
      )}

      {/* View Switcher Router */}
      <main className="flex-1">
        {(isInitialLoading || isAuthChecking) && currentView !== 'admin' && currentView !== 'admin-login' ? (
          <PageLoader label="Chargement du site..." />
        ) : (
          <>
        {currentView === 'accueil' && (
          <AccueilView
            onStartDemo={() => handleOpenMemberProfile(members[0] || INITIAL_MEMBERS[0])}
            onNavigate={(view) => {
              handleNavigate(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            blocks={previewBlocks['accueil'] || publishedBlocks['accueil']}
            members={members}
          />
        )}

        {currentView === 'qui-nous-sommes' && (
          <QuiNousSommesView
            blocks={previewBlocks['qui-nous-sommes'] || publishedBlocks['qui-nous-sommes']}
            members={members}
          />
        )}

        {currentView === 'nos-services' && (
          <NosServicesView
            blocks={previewBlocks['nos-services'] || publishedBlocks['nos-services']}
          />
        )}

        {currentView === 'blog' && <BlogView />}

        {currentView === 'actualites' && <ActualitesView />}

        {currentView === 'contact' && (
          <ContactView
            blocks={previewBlocks['contact'] || publishedBlocks['contact']}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => handleNavigate('accueil')}
          />
        )}

        {currentView === 'profile' && (
          <MemberCardPublic
            member={selectedMember}
            onBackToHome={() => handleNavigate(previousView)}
          />
        )}

        {currentView === 'admin' && (
          <AdminLayout
            members={members}
            logs={logs}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onViewMember={(member) => setViewModalMember(member)}
            onViewQR={(member) => setQrModalMember(member)}
            onPrintCard={(member) => setPrintModalMember(member)}
            activeRole={activeRole}
            permissions={currentAdmin?.permissions}
            onTogglePreview={handleTogglePreview}
            activePreviewSlug={activePreviewSlug}
            onLogout={handleLogout}
          />
        )}
          </>
        )}
      </main>

      {/* Quick Modals */}
      {qrModalMember && (
        <QRCodeModal
          member={qrModalMember}
          isOpen={!!qrModalMember}
          onClose={() => setQrModalMember(null)}
        />
      )}

      {printModalMember && (
        <PrintCardView
          member={printModalMember}
          isOpen={!!printModalMember}
          onClose={() => setPrintModalMember(null)}
        />
      )}

      <MemberViewModal member={viewModalMember} onClose={() => setViewModalMember(null)} />

      {/* Main Footer */}
      {currentView !== 'admin' && currentView !== 'admin-login' && (
        <Footer setCurrentView={handleNavigate} />
      )}

      {/* Back to top */}
      {currentView !== 'admin' && currentView !== 'admin-login' && <BackToTop />}
      {currentView !== 'admin' && currentView !== 'admin-login' && (
        <InstallPrompt visible={Boolean(deferredPrompt)} onInstall={handleInstallPWA} />
      )}

    </div>
  );
}

export default App;
