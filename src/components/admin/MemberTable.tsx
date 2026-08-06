import React, { useState } from 'react';
import { Member, UserRole } from '../../types/member';
import { Search, Filter, Plus, Edit3, Trash2, Eye, QrCode, CreditCard, Printer, CheckCircle, XCircle } from 'lucide-react';
import { downloadVCard } from '../../utils/vcard';

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

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Action Header & Filters */}
      <div className="glass-panel p-6 rounded-3xl border-sky-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Gestion des Membres (CRUD)</h3>
            <p className="text-xs text-slate-400">
              Liste centralisée des consultants Cabinet RE2M et édition des cartes numériques.
            </p>
          </div>

          {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
            <button
              onClick={onAddMember}
              className="bg-gradient-to-r from-blue-900 via-sky-800 to-sky-600 hover:from-sky-700 hover:to-sky-500 text-white font-bold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs ice-glow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Membre</span>
            </button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-sky-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher nom, fonction, email..."
              className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-3 py-2.5 border border-slate-800 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-sky-400 focus:outline-none cursor-pointer"
            >
              {departments.map((dept, idx) => (
                <option key={idx} value={dept} className="bg-slate-900">
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
              className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-sky-400 focus:outline-none cursor-pointer"
            >
              <option value="Tous" className="bg-slate-900">Statut: Tous</option>
              <option value="active" className="bg-slate-900">Actif</option>
              <option value="pending" className="bg-slate-900">En attente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-3xl border-sky-500/30 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-sky-300 font-serif border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Membre & Identité</th>
                <th className="py-4 px-4">Département</th>
                <th className="py-4 px-4">Coordonnées</th>
                <th className="py-4 px-4 text-center">Scans</th>
                <th className="py-4 px-4 text-center">Statut</th>
                <th className="py-4 px-4 text-right">Actions Rapides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    Aucun membre trouvé dans la base de données.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* Identity */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-950 border border-sky-500/30 flex items-center justify-center font-serif font-bold text-sky-200 shrink-0">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-white text-sm">
                            {member.civility} {member.firstName} {member.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400">{member.title}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4">
                      <span className="bg-blue-950 text-sky-200 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-sky-500/20 uppercase">
                        {member.department}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 space-y-0.5 text-[11px]">
                      <p className="text-slate-200">{member.email}</p>
                      <p className="text-slate-400">{member.mobile}</p>
                    </td>

                    {/* Scans Count */}
                    <td className="py-4 px-4 text-center font-bold text-sky-300 text-sm">
                      {member.scanCount}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        member.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                      }`}>
                        {member.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {member.status === 'active' ? 'Actif' : 'En attente'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* View Card */}
                        <button
                          onClick={() => onViewMember(member)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors"
                          title="Voir la carte publique"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* QR Code */}
                        <button
                          onClick={() => onViewQR(member)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors"
                          title="Voir QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Download vCard */}
                        <button
                          onClick={() => downloadVCard(member)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors"
                          title="Télécharger vCard 4.0"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>

                        {/* Print Card */}
                        <button
                          onClick={() => onPrintCard(member)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors"
                          title="Imprimer carte HD 85x54mm"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
                          <button
                            onClick={() => onEditMember(member)}
                            className="p-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-sky-200 transition-colors border border-sky-500/30"
                            title="Éditer le membre"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        {userRole === 'SUPER_ADMIN' && (
                          <button
                            onClick={() => onDeleteMember(member.id)}
                            className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 transition-colors border border-rose-500/30 ml-1"
                            title="Supprimer le membre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
