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
                <th className="py-4 px-5 text-right">Actions Rapides</th>
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
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Card */}
                        <button
                          onClick={() => onViewMember(member)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/40 transition-all cursor-pointer"
                          title="Voir la carte publique"
                        >
                          <Eye className="w-4 h-4 shrink-0" />
                        </button>

                        {/* QR Code */}
                        <button
                          onClick={() => onViewQR(member)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/40 transition-all cursor-pointer"
                          title="Voir QR Code"
                        >
                          <QrCode className="w-4 h-4 shrink-0" />
                        </button>

                        {/* Download vCard */}
                        <button
                          onClick={() => downloadVCard(member)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/40 transition-all cursor-pointer"
                          title="Télécharger vCard 4.0"
                        >
                          <CreditCard className="w-4 h-4 shrink-0" />
                        </button>

                        {/* Print Card */}
                        <button
                          onClick={() => onPrintCard(member)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/40 transition-all cursor-pointer"
                          title="Imprimer carte HD 85x54mm"
                        >
                          <Printer className="w-4 h-4 shrink-0" />
                        </button>

                        {/* Edit */}
                        {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
                          <button
                            onClick={() => onEditMember(member)}
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-100 transition-all cursor-pointer"
                            title="Éditer le membre"
                          >
                            <Edit3 className="w-4 h-4 shrink-0" />
                          </button>
                        )}

                        {/* Delete */}
                        {userRole === 'SUPER_ADMIN' && (
                          <button
                            onClick={() => onDeleteMember(member.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 transition-all cursor-pointer"
                            title="Supprimer le membre"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
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
