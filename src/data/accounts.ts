import { UserRole } from '../types/member';

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

export const accounts: UserAccount[] = [
  {
    id: 'ACC-001',
    name: 'Roch-Emmanuel MVE-MBORO',
    email: 'admin@cabinet-re2m.com',
    role: 'SUPER_ADMIN',
    status: 'active',
    createdAt: '2026-01-10'
  }
];
