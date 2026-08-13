import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck, KeyRound, Eye, PencilLine } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { UserAccount, accounts as initialAccounts, PERMISSION_MODULES, ModulePermission } from '../../../data/accounts';
import { UserRole } from '../../../types/member';

const emptyDraft: UserAccount = {
  id: '',
  name: '',
  email: '',
  role: 'CONSULTANT',
  status: 'active',
  createdAt: new Date().toISOString().slice(0, 10)
};

const inputClass = 'w-full bg-slate-50 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CONSULTANT: 'Consultant'
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Accès total : gestion des comptes, contenu, équipe, paramètres.',
  ADMIN: 'Gestion du contenu, de l\'équipe et des demandes, sans gérer les comptes.',
  CONSULTANT: 'Accès restreint en lecture et à ses propres informations.'
};

export const AccountsAdmin: React.FC = () => {
  const [items, setItems] = useState<UserAccount[]>(initialAccounts);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<UserAccount>(emptyDraft);

  const openCreate = () => {
    setEditingIndex(null);
    setDraft({ ...emptyDraft, id: `ACC-${String(items.length + 1).padStart(3, '0')}` });
    setIsOpen(true);
  };

  const openEdit = (idx: number) => {
    setEditingIndex(idx);
    setDraft(items[idx]);
    setIsOpen(true);
  };

  const handleDelete = (idx: number) => {
    if (window.confirm('Supprimer ce compte ?')) {
      setItems((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSave = () => {
    if (!draft.name.trim() || !draft.email.trim()) return;
    if (editingIndex === null) {
      setItems((prev) => [draft, ...prev]);
    } else {
      setItems((prev) => prev.map((a, i) => (i === editingIndex ? draft : a)));
    }
    setIsOpen(false);
  };

  const togglePermission = (moduleKey: string, action: keyof ModulePermission) => {
    const current: ModulePermission = draft.permissions?.[moduleKey as keyof typeof draft.permissions] || { read: false, edit: false };
    const nextValue = !current[action];
    const nextPerm: ModulePermission = {
      ...current,
      [action]: nextValue,
      // Editing a module implies being able to read it
      read: action === 'edit' && nextValue ? true : current.read
    };
    setDraft({
      ...draft,
      permissions: { ...draft.permissions, [moduleKey]: nextPerm }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#002366]">Gestion des utilisateurs</h2>
          <p className="text-xs text-slate-500">Comptes d'accès au back-office et attribution des rôles</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nouveau compte
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Utilisateur</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Rôle</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Statut</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((account, idx) => (
              <tr key={account.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#002366] truncate">{account.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{account.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[10px] font-extrabold text-[#002366] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {ROLE_LABELS[account.role]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                    account.status === 'active' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-slate-500 bg-slate-100 border border-slate-200'
                  }`}>
                    {account.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(idx)}
                      className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
            <KeyRound className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-400">Aucun compte pour le moment.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingIndex === null ? 'Nouveau compte' : 'Modifier le compte'}
        subtitle="Accès back-office"
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
            >
              Enregistrer
            </button>
          </>
        }
      >
        <div>
          <label className={labelClass}>Nom complet</label>
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Prénom Nom"
          />
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={inputClass}
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            placeholder="nom@cabinet-re2m.com"
          />
        </div>

        <div>
          <label className={labelClass}>Rôle</label>
          <div className="space-y-2">
            {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setDraft({ ...draft, role })}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  draft.role === role ? 'border-[#002366] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="text-xs font-bold text-[#002366]">{ROLE_LABELS[role]}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{ROLE_DESCRIPTIONS[role]}</p>
              </button>
            ))}
          </div>
        </div>

        {draft.role === 'ADMIN' && (
          <div>
            <label className={labelClass}>Modules & permissions</label>
            <div className="space-y-2">
              {PERMISSION_MODULES.map((mod) => {
                const perm = draft.permissions?.[mod.key] || { read: false, edit: false };
                return (
                  <div key={mod.key} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-[#002366]">{mod.label}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePermission(mod.key, 'read')}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          perm.read ? 'bg-blue-50 text-[#002366] border border-blue-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }`}
                      >
                        <Eye className="w-3 h-3" /> Lire
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePermission(mod.key, 'edit')}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          perm.edit ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }`}
                      >
                        <PencilLine className="w-3 h-3" /> Éditer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>Statut</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft({ ...draft, status: 'active' })}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                draft.status === 'active' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'
              }`}
            >
              Actif
            </button>
            <button
              type="button"
              onClick={() => setDraft({ ...draft, status: 'inactive' })}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                draft.status === 'inactive' ? 'border-slate-400 bg-slate-100 text-slate-600' : 'border-slate-200 text-slate-500'
              }`}
            >
              Inactif
            </button>
          </div>
        </div>
      </SlideOver>
    </div>
  );
};

export default AccountsAdmin;
