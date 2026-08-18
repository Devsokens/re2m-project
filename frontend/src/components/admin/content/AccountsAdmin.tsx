import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck, KeyRound, Eye, PencilLine, Copy, CheckCircle2 } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { UserAccount, accountsStore, PERMISSION_MODULES, ModulePermission } from '../../../data/accounts';
import { UserRole } from '../../../types/member';
import { PageLoader } from '../../layout/PageLoader';
import { ConfirmModal } from '../ConfirmModal';

interface Draft {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: 'active' | 'inactive';
  permissions: UserAccount['permissions'];
}

const emptyDraft: Draft = {
  name: '',
  email: '',
  password: '',
  role: 'CONSULTANT',
  status: 'active',
  permissions: {}
};

const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const disabledInputClass = 'w-full bg-slate-100 text-slate-400 text-xs rounded-xl px-3 py-2.5 border border-slate-200 cursor-not-allowed';
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
  const [items, setItems] = useState<UserAccount[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tempPassword, setTempPassword] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    accountsStore
      .list()
      .then(setItems)
      .catch((err) => console.error('Impossible de charger les comptes :', err))
      .finally(() => setIsLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setError('');
    setIsOpen(true);
  };

  const openEdit = (account: UserAccount) => {
    setEditingId(account.id);
    setDraft({ name: account.name, email: account.email, password: '', role: account.role, status: account.status, permissions: account.permissions ?? {} });
    setError('');
    setIsOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setDeletingAccount(true);
    accountsStore
      .remove(deleteTarget.id)
      .then(() => {
        setItems((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setDeleteTarget(null);
      })
      .catch((err) => alert(err instanceof Error ? err.message : 'Échec de la suppression.'))
      .finally(() => setDeletingAccount(false));
  };

  const handleSave = () => {
    if (!draft.name.trim() || !draft.email.trim() || saving) return;
    if (draft.password.trim() && draft.password.trim().length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setSaving(true);
    setError('');

    if (editingId === null) {
      accountsStore
        .create({ ...draft, password: draft.password.trim() || undefined })
        .then((created) => {
          const { tempPassword: pwd, ...account } = created;
          setItems((prev) => [...prev, account]);
          if (pwd) setTempPassword({ email: account.email, password: pwd });
          setIsOpen(false);
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Échec de la création.'))
        .finally(() => setSaving(false));
    } else {
      accountsStore
        .update(editingId, { name: draft.name, role: draft.role, status: draft.status, permissions: draft.permissions })
        .then((updated) => {
          setItems((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
          setIsOpen(false);
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Échec de la mise à jour.'))
        .finally(() => setSaving(false));
    }
  };

  const togglePermission = (moduleKey: string, action: keyof ModulePermission) => {
    const current: ModulePermission = draft.permissions?.[moduleKey as keyof typeof draft.permissions] || { read: false, edit: false };
    const nextValue = !current[action];
    const nextPerm: ModulePermission = { ...current, [action]: nextValue };
    // Editing a module implies being able to read it...
    if (action === 'edit' && nextValue) nextPerm.read = true;
    // ...and removing read access implies removing edit access too.
    if (action === 'read' && !nextValue) nextPerm.edit = false;
    setDraft({
      ...draft,
      permissions: { ...draft.permissions, [moduleKey]: nextPerm }
    });
  };

  const copyPassword = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword.password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (isLoading) return <PageLoader label="Chargement..." fullScreen={false} />;

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

      {tempPassword && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <KeyRound className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-900">
              Compte créé pour {tempPassword.email} — mot de passe temporaire à communiquer manuellement (affiché une seule fois) :
            </p>
            <div className="flex items-center gap-2 mt-2">
              <code className="bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-900">{tempPassword.password}</code>
              <button
                onClick={copyPassword}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-100 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié' : 'Copier'}
              </button>
              <button onClick={() => setTempPassword(null)} className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer ml-auto">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

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
            {items.map((account) => (
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
                      onClick={() => openEdit(account)}
                      className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(account)}
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
        title={editingId === null ? 'Nouveau compte' : 'Modifier le compte'}
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
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
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
          <label className={labelClass}>Email {editingId !== null && '(non modifiable)'}</label>
          <input
            type="email"
            disabled={editingId !== null}
            className={editingId !== null ? disabledInputClass : inputClass}
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            placeholder="nom@cabinet-re2m.com"
          />
        </div>

        {editingId === null && (
          <div>
            <label className={labelClass}>Mot de passe (optionnel)</label>
            <input
              type="text"
              className={inputClass}
              value={draft.password}
              onChange={(e) => setDraft({ ...draft, password: e.target.value })}
              placeholder="Laisser vide pour générer un mot de passe temporaire"
              autoComplete="off"
            />
            <p className="text-[10px] text-slate-400 mt-1.5">
              8 caractères minimum. Si laissé vide, un mot de passe temporaire sera généré et affiché une seule fois après la création.
            </p>
          </div>
        )}

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

        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
      </SlideOver>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Supprimer ce compte ?"
        message={deleteTarget ? `${deleteTarget.name} (${deleteTarget.email}) perdra son accès au back-office ; la connexion associée sera aussi supprimée.` : ''}
        loading={deletingAccount}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AccountsAdmin;
