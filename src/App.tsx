import React, { useState, useEffect } from 'react';
import { Member, ActivityLog, UserRole } from './types/member';
import { INITIAL_MEMBERS, INITIAL_LOGS } from './data/mockMembers';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { AccueilView } from './components/landing/AccueilView';
import { QuiNousSommesView } from './components/landing/QuiNousSommesView';
import { NosServicesView } from './components/landing/NosServicesView';
import { ContactView } from './components/landing/ContactView';
import { MemberCardPublic } from './components/card/MemberCardPublic';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { QRCodeModal } from './components/card/QRCodeModal';
import { PrintCardView } from './components/card/PrintCardView';

export function App() {
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

  // View state: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact' | 'profile' | 'admin' | 'admin-login'
  const [currentView, setCurrentView] = useState<'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact' | 'profile' | 'admin' | 'admin-login'>('accueil');

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
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f172a] font-sans selection:bg-[#002366] selection:text-white">
      
      {/* Offline PWA Notification Banner */}
      <OfflineBanner />

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
      />

      {/* View Switcher Router */}
      <main className="flex-1">
        {currentView === 'accueil' && (
          <AccueilView
            onStartDemo={() => handleOpenMemberProfile(members[0] || INITIAL_MEMBERS[0])}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'qui-nous-sommes' && (
          <QuiNousSommesView />
        )}

        {currentView === 'nos-services' && (
          <NosServicesView />
        )}

        {currentView === 'contact' && (
          <ContactView />
        )}

        {currentView === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={() => setCurrentView('admin')}
            onCancel={() => setCurrentView('accueil')}
          />
        )}

        {currentView === 'profile' && (
          <MemberCardPublic
            member={selectedMember}
            onBackToHome={() => setCurrentView('accueil')}
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
      <Footer setCurrentView={setCurrentView} />

    </div>
  );
}

export default App;
