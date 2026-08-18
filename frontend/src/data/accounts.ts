import { UserRole } from '../types/member';
import { apiClient } from '../lib/apiClient';

export interface ModulePermission {
  read: boolean;
  edit: boolean;
}

export const PERMISSION_MODULES = [
  { key: 'content', label: 'Gestion de contenu' },
  { key: 'team', label: "Gestion de l'équipe" },
  { key: 'testimonials', label: 'Témoignages' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'requests', label: 'Demandes' },
  { key: 'settings', label: 'Paramètres' }
] as const;

export type PermissionModuleKey = typeof PERMISSION_MODULES[number]['key'];

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
  permissions?: Partial<Record<PermissionModuleKey, ModulePermission>>;
}

export type AccountInput = Pick<UserAccount, 'name' | 'email' | 'role' | 'status' | 'permissions'>;
export type AccountUpdateInput = Pick<UserAccount, 'name' | 'role' | 'status' | 'permissions'>;

export interface CreatedAccount extends UserAccount {
  tempPassword: string;
}

// Backed by the RE2M API (backend/src/routes/accounts.routes.ts), SUPER_ADMIN
// only. Creating an account also creates a real Supabase Auth login — the
// returned tempPassword must be shared with the new user out of band.
export const accountsStore = {
  list: (): Promise<UserAccount[]> => apiClient.get<UserAccount[]>('/api/accounts'),
  create: (input: AccountInput): Promise<CreatedAccount> => apiClient.post<CreatedAccount>('/api/accounts', input),
  update: (id: string, input: AccountUpdateInput): Promise<UserAccount> => apiClient.put<UserAccount>(`/api/accounts/${id}`, input),
  remove: (id: string): Promise<void> => apiClient.delete(`/api/accounts/${id}`)
};
