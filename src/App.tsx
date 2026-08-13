import React, { useState, useEffect } from 'react';
import { Member, ActivityLog, UserRole } from './types/member';
import { INITIAL_MEMBERS, INITIAL_LOGS } from './data/mockMembers';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { BackToTop } from './components/layout/BackToTop';
import { AccueilView } from './components/landing/AccueilView';
import { QuiNousSommesView } from './components/landing/QuiNousSommesView';
import { NosServicesView } from './components/landing/NosServicesView';
import { BlogView } from './components/landing/BlogView';
import { ActualitesView } from './components/landing/ActualitesView';
import { ContactView } from './components/landing/ContactView';
import { TestimonialSubmissionForm } from './components/landing/TestimonialSubmissionForm';
import { MemberCardPublic } from './components/card/MemberCardPublic';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { QRCodeModal } from './components/card/QRCodeModal';
import { PrintCardView } from './components/card/PrintCardView';
import { PageSlug, CMSBlock } from './types/cms';
import { cmsStorage } from './utils/cmsStorage';

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

  // LocalStorage backed Members state
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('re2m_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  // LocalStorage backed Activity Logs state
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('re2m_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // View state: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login'
  const [currentView, setCurrentView] = useState<'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login'>('accueil');
  const [previousView, setPreviousView] = useState<'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login'>('accueil');

  const handleNavigate = (view: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'blog' | 'actualites' | 'contact' | 'profile' | 'admin' | 'admin-login') => {
    if (currentView !== 'profile') {
      setPreviousView(currentView);
    }
    setCurrentView(view);
  };

  // Selected member for profile view
  const [selectedMember, setSelectedMember] = useState<Member>(INITIAL_MEMBERS[0]);

  // Active Role state
  const [activeRole, setActiveRole] = useState<UserRole>('SUPER_ADMIN');

  // Modal states for global quick triggers
  const [qrModalMember, setQrModalMember] = useState<Member | null>(null);
  const [printModalMember, setPrintModalMember] = useState<Member | null>(null);

  // PWA Install Event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('re2m_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('re2m_logs', JSON.stringify(logs));
  }, [logs]);

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

  // Member CRUD actions
  const handleAddMember = (newMemberData: Member) => {
    setMembers([newMemberData, ...members]);
    const log: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: activeRole,
      action: 'CREATE',
      targetMember: newMemberData.id,
      details: `Création du membre ${newMemberData.firstName} ${newMemberData.lastName} (${newMemberData.title})`,
      ipAddress: '197.221.14.10'
    };
    setLogs([log, ...logs]);
  };

  const handleUpdateMember = (updatedMemberData: Member) => {
    setMembers(members.map(m => m.id === updatedMemberData.id ? updatedMemberData : m));
    if (selectedMember.id === updatedMemberData.id) {
      setSelectedMember(updatedMemberData);
    }
    const log: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: activeRole,
      action: 'UPDATE',
      targetMember: updatedMemberData.id,
      details: `Mise à jour des coordonnées & design de ${updatedMemberData.firstName} ${updatedMemberData.lastName}`,
      ipAddress: '197.221.14.10'
    };
    setLogs([log, ...logs]);
  };

  const handleDeleteMember = (id: string) => {
    const target = members.find(m => m.id === id);
    setMembers(members.filter(m => m.id !== id));
    const log: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: activeRole,
      action: 'DELETE',
      targetMember: id,
      details: `Suppression du membre ${target ? target.firstName + ' ' + target.lastName : id}`,
      ipAddress: '197.221.14.10'
    };
    setLogs([log, ...logs]);
  };

  const handleOpenMemberProfile = (member: Member) => {
    // Increment scan count simulation
    const updated = { ...member, scanCount: member.scanCount + 1 };
    handleUpdateMember(updated);
    setSelectedMember(updated);
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
        {currentView === 'accueil' && (
          <AccueilView
            onStartDemo={() => handleOpenMemberProfile(members[0] || INITIAL_MEMBERS[0])}
            onNavigate={(view) => {
              handleNavigate(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            blocks={previewBlocks['accueil'] || cmsStorage.getPublishedLayout('accueil')}
            members={members}
          />
        )}

        {currentView === 'qui-nous-sommes' && (
          <QuiNousSommesView
            blocks={previewBlocks['qui-nous-sommes'] || cmsStorage.getPublishedLayout('qui-nous-sommes')}
            members={members}
          />
        )}

        {currentView === 'nos-services' && (
          <NosServicesView 
            blocks={previewBlocks['nos-services'] || cmsStorage.getPublishedLayout('nos-services')}
          />
        )}

        {currentView === 'blog' && <BlogView />}

        {currentView === 'actualites' && <ActualitesView />}

        {currentView === 'contact' && (
          <ContactView
            blocks={previewBlocks['contact'] || cmsStorage.getPublishedLayout('contact')}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={() => handleNavigate('admin')}
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
            onViewMember={handleOpenMemberProfile}
            onViewQR={(member) => setQrModalMember(member)}
            onPrintCard={(member) => setPrintModalMember(member)}
            activeRole={activeRole}
            onTogglePreview={handleTogglePreview}
            activePreviewSlug={activePreviewSlug}
            onLogout={() => handleNavigate('accueil')}
          />
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

      {/* Main Footer */}
      {currentView !== 'admin' && currentView !== 'admin-login' && (
        <Footer setCurrentView={handleNavigate} />
      )}

      {/* Back to top */}
      {currentView !== 'admin' && currentView !== 'admin-login' && <BackToTop />}

    </div>
  );
}

export default App;
