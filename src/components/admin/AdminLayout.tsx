import React, { useState } from 'react';
import { Member, ActivityLog, UserRole } from '../../types/member';
import { DashboardStats } from './DashboardStats';
import { MemberTable } from './MemberTable';
import { BatchGenerator } from './BatchGenerator';
import { ActivityLogs } from './ActivityLogs';
import { MemberFormModal } from './MemberFormModal';
import { LayoutDashboard, Users, Package, ShieldAlert } from 'lucide-react';

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
  activeRole
}) => {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'members' | 'batch' | 'logs'>('dashboard');
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-2 rounded-2xl border-sky-500/30">
        
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'dashboard'
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-sky-200 shadow border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-sky-300" />
            <span>Tableau de Bord</span>
          </button>

          <button
            onClick={() => setAdminTab('members')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'members'
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-sky-200 shadow border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-sky-300" />
            <span>Gestion Membres ({members.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('batch')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'batch'
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-sky-200 shadow border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-sky-300" />
            <span>Génération par Lot</span>
          </button>

          <button
            onClick={() => setAdminTab('logs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'logs'
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-sky-200 shadow border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-sky-300" />
            <span>Journal d'Activité</span>
          </button>
        </div>

        {/* Action Button & Role Indicator */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-[11px] font-semibold text-sky-200 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">
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
