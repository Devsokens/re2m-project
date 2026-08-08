import React, { useState } from 'react';
import { Member, ActivityLog, UserRole } from '../../types/member';
import { DashboardStats } from './DashboardStats';
import { MemberTable } from './MemberTable';
import { BatchGenerator } from './BatchGenerator';
import { ActivityLogs } from './ActivityLogs';
import { MemberFormModal } from './MemberFormModal';
import { LayoutDashboard, Users, Package, ShieldAlert, Sliders } from 'lucide-react';
import { GestionCMS } from './CMS/GestionCMS';
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
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  members,
  logs,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onViewMember,
  onViewQR,
  onPrintCard,
  activeRole,
  onTogglePreview,
  activePreviewSlug
}) => {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'members' | 'batch' | 'logs' | 'cms'>('dashboard');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'dashboard'
                ? 'bg-[#002366] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#002366] hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Tableau de Bord</span>
          </button>

          <button
            onClick={() => setAdminTab('members')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'members'
                ? 'bg-[#002366] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#002366] hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Gestion Membres ({members.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('batch')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'batch'
                ? 'bg-[#002366] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#002366] hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>Génération par Lot</span>
          </button>

          <button
            onClick={() => setAdminTab('logs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'logs'
                ? 'bg-[#002366] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#002366] hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Journal d'Activité</span>
          </button>

          <button
            onClick={() => setAdminTab('cms')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'cms'
                ? 'bg-[#002366] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#002366] hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span>Gestion CMS</span>
          </button>
        </div>

        {/* Role Indicator */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end px-2">
          <span className="text-[10px] font-extrabold text-[#002366] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">
            Rôle Actif: {activeRole}
          </span>
        </div>

      </div>

      {/* View Content */}
      {adminTab === 'dashboard' && <DashboardStats members={members} />}

      {adminTab === 'members' && (
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

      {adminTab === 'batch' && <BatchGenerator members={members} />}

      {adminTab === 'logs' && <ActivityLogs logs={logs} />}

      {adminTab === 'cms' && (
        <GestionCMS
          onTogglePreview={onTogglePreview}
          activePreviewSlug={activePreviewSlug}
        />
      )}

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
