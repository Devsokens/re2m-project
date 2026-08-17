export type CertificateTemplateId = 're2m-classique' | 'moderne' | 'corporate';

export interface Formation {
  id: string;
  title: string;
  date: string; // ISO
  location: string;
  description: string;
  templateId: CertificateTemplateId;
  signerName: string;
  signerTitle: string;
}

export interface Participant {
  id: string;
  formationId: string;
  fullName: string;
  email?: string;
  organization?: string;
  present: boolean;
}

const FORMATIONS_KEY = 're2m_formations';
const PARTICIPANTS_KEY = 're2m_participants';

const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

const seedFormations: Formation[] = [
  {
    id: 'FRM-001',
    title: 'Gestion optimisée des stocks et des approvisionnements',
    date: '2026-07-04',
    location: 'Libreville, Gabon',
    description: "Formation certifiante sur les techniques de gestion des stocks, la classification ABC et l'optimisation des approvisionnements.",
    templateId: 're2m-classique',
    signerName: 'Roch-Emmanuel MVE-MBORO',
    signerTitle: 'Directeur-Expert Consultant Formateur en Achats & Logistique certifié'
  }
];

const seedParticipants: Participant[] = [
  { id: 'PAR-001', formationId: 'FRM-001', fullName: 'Selma Maël ALLIMA LEKAMI', organization: 'Cabinet RE2M', present: true },
  { id: 'PAR-002', formationId: 'FRM-001', fullName: 'Jackie MOUBEYI', organization: 'Cabinet RE2M', present: true },
  { id: 'PAR-003', formationId: 'FRM-001', fullName: 'Aïcha MBADINGA', organization: 'Cabinet RE2M', present: false }
];

export const formationsStore = {
  getFormations(): Formation[] {
    return readJSON(FORMATIONS_KEY, seedFormations);
  },
  saveFormations(formations: Formation[]) {
    writeJSON(FORMATIONS_KEY, formations);
  },
  getParticipants(formationId?: string): Participant[] {
    const all = readJSON(PARTICIPANTS_KEY, seedParticipants);
    return formationId ? all.filter((p) => p.formationId === formationId) : all;
  },
  getAllParticipants(): Participant[] {
    return readJSON(PARTICIPANTS_KEY, seedParticipants);
  },
  saveAllParticipants(participants: Participant[]) {
    writeJSON(PARTICIPANTS_KEY, participants);
  }
};
