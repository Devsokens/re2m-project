export type Civility = 'M.' | 'Mme' | 'Dr' | 'Pr';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONSULTANT';

export type MemberStatus = 'active' | 'inactive' | 'pending';

export interface Member {
  id: string;
  civility: Civility;
  lastName: string;
  firstName: string;
  title: string;
  department: string;
  bio?: string;
  
  // Contact details
  email: string;
  mobile: string;
  phone?: string;
  address: string;
  linkedin?: string;
  website?: string;
  
  // Custom design specs
  qrColor: string;
  qrBackground: string;
  
  // Metrics & metadata
  status: MemberStatus;
  scanCount: number;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SCAN' | 'EXPORT_PDF' | 'EXPORT_VCARD' | 'BATCH_EXPORT';
  targetMember?: string;
  details: string;
  ipAddress?: string;
}

export interface DashboardMetrics {
  totalMembers: number;
  activeMembers: number;
  totalScans: number;
  cardsGenerated: number;
  adoptionRate: number; // e.g. 96.5%
}
