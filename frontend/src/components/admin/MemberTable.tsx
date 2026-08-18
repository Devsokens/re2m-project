import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Member, UserRole } from '../../types/member';
import { Search, Plus, Edit3, Trash2, Eye, QrCode, CreditCard, Printer, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { downloadVCard } from '../../utils/vcard';
import { ConfirmModal } from './ConfirmModal';

interface MemberTableProps {
  members: Member[];
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onViewMember: (member: Member) => void;
  onViewQR: (member: Member) => void;
  onPrintCard: (member: Member) => void;
  userRole: UserRole;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onViewMember,
  onViewQR,
  onPrintCard,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleOpenMenu = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 208;
    setMenuPosition({ top: rect.bottom + 4, left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8) });
    setOpenMenuId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    onDeleteMember(deleteTarget.id);
    setDeleteTarget(null);
  };

  const departments = ['Tous', ...Array.from(new Set(members.map(m => m.department)))];

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'Tous' || member.department === departmentFilter;
    const matchesStatus = statusFilter === 'Tous' || member.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const menuMember = openMenuId ? members.find((m) => m.id === openMenuId) : null;

  return (
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">

      {/* Action Header & Filters */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#002366]">Base des Membres</h3>
            <p className="text-xs text-slate-500 font-medium">
              Liste centralisée des consultants Cabinet RE2M et édition des cartes numériques.
            </p>
          </div>

          {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
            <button
              onClick={onAddMember}
              className="bg-[#002366] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Nouveau Membre</span>
            </button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher nom, fonction, email..."
              className="w-full bg-slate-50 text-slate-700 placeholder-slate-400 text-xs rounded-xl pl-10 pr-3 py-2.5 border border-slate-200 focus:border-blue-900 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-blue-900 focus:bg-white focus:outline-none cursor-pointer transition-colors"
            >
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  Dept: {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-blue-900 focus:bg-white focus:outline-none cursor-pointer transition-colors"
            >
              <option value="Tous">Statut: Tous</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5">Membre & Identité</th>
                <th className="py-4 px-5">Département</th>
                <th className="py-4 px-5">Coordonnées</th>
                <th className="py-4 px-5 text-center">Scans</th>
                <th className="py-4 px-5 text-center">Statut</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    Aucun membre trouvé dans la base de données.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">

                    {/* Identity */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-serif font-bold text-blue-900 shrink-0">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-[#002366] text-sm">
                            {member.civility} {member.firstName} {member.lastName}
                          </p>
                          <p className="text-[11px] text-slate-450 font-medium">{member.title}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-5">
                      <span className="bg-blue-50 text-blue-900 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-wider">
                        {member.department}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-5 space-y-0.5 text-[11px] font-medium text-slate-600">
                      <p>{member.email}</p>
                      <p className="text-slate-400 font-semibold">{member.mobile}</p>
                    </td>

                    {/* Scans Count */}
                    <td className="py-4 px-5 text-center font-extrabold text-[#002366] text-sm">
                      {member.scanCount}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        member.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-blue-50 text-blue-800 border-blue-100'
                      }`}>
                        {member.status === 'active' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-blue-800" />}
                        {member.status === 'active' ? 'Actif' : 'En attente'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => handleOpenMenu(member.id, e)}
                        className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/40 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-all ml-auto"
                        title="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openMenuId &&
        menuPosition &&
        menuMember &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            className="fixed w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-[80] overflow-hidden animate-scaleUp"
          >
            <button
              onClick={() => { onViewMember(menuMember); setOpenMenuId(null); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" /> Voir la carte publique
            </button>
            <button
              onClick={() => { onViewQR(menuMember); setOpenMenuId(null); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" /> Voir QR Code
            </button>
            <button
              onClick={() => { downloadVCard(menuMember); setOpenMenuId(null); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" /> Télécharger vCard
            </button>
            <button
              onClick={() => { onPrintCard(menuMember); setOpenMenuId(null); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer la carte
            </button>
            {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
              <button
                onClick={() => { onEditMember(menuMember); setOpenMenuId(null); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#002366] hover:bg-blue-50 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Éditer le membre
              </button>
            )}
            {userRole === 'SUPER_ADMIN' && (
              <button
                onClick={() => { setDeleteTarget(menuMember); setOpenMenuId(null); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            )}
          </div>,
          document.body
        )}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Supprimer ce membre ?"
        message={deleteTarget ? `${deleteTarget.civility} ${deleteTarget.firstName} ${deleteTarget.lastName} sera définitivement retiré de la base des membres.` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};
