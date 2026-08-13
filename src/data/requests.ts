export type RequestType = 'Audit & Conseil' | 'Formation' | 'Partenariat' | 'Autre';
export type RequestStatus = 'pending' | 'scheduled' | 'refused';

export interface ServiceRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: RequestType;
  message: string;
  status: RequestStatus;
  receivedAt: string;
  meetingDate?: string;
}

export const requests: ServiceRequest[] = [
  {
    id: 'REQ-001',
    name: 'Sylvie NDONG',
    company: 'BGFI Bank Gabon',
    email: 'sylvie.ndong@bgfi.com',
    phone: '+241 74 12 34 56',
    type: 'Audit & Conseil',
    message: "Nous souhaitons un audit complet de notre fonction achats pour identifier des gisements d'économies.",
    status: 'pending',
    receivedAt: '2026-08-10'
  },
  {
    id: 'REQ-002',
    name: 'Jean-Paul MASSALA',
    company: 'Total Energies Gabon',
    email: 'jp.massala@totalenergies.com',
    phone: '+241 66 98 76 54',
    type: 'Formation',
    message: 'Nous aimerions organiser une formation sur la négociation fournisseurs pour 15 collaborateurs.',
    status: 'pending',
    receivedAt: '2026-08-09'
  },
  {
    id: 'REQ-003',
    name: 'Aïcha OYANE',
    company: 'Moov Africa',
    email: 'aicha.oyane@moov.ga',
    phone: '+241 62 45 78 90',
    type: 'Partenariat',
    message: 'Nous explorons une collaboration pour un accompagnement récurrent de nos équipes logistiques.',
    status: 'scheduled',
    receivedAt: '2026-08-05',
    meetingDate: '2026-08-18'
  },
  {
    id: 'REQ-004',
    name: 'Marc IBINGA',
    company: 'Groupe Ceca-Gadis',
    email: 'marc.ibinga@cecagadis.ga',
    phone: '+241 77 22 11 09',
    type: 'Audit & Conseil',
    message: "Demande d'audit de notre chaîne d'approvisionnement pour la distribution.",
    status: 'refused',
    receivedAt: '2026-07-28'
  },
  {
    id: 'REQ-005',
    name: 'Corinne MBADINGA',
    company: 'SEEG',
    email: 'corinne.mbadinga@seeg.ga',
    phone: '+241 65 33 22 11',
    type: 'Autre',
    message: 'Nous souhaitons en savoir plus sur vos prestations de coaching opérationnel.',
    status: 'pending',
    receivedAt: '2026-08-11'
  }
];
