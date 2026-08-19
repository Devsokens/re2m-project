import { CertificateTemplateId } from './formations';

export interface CertificateTemplateMeta {
  id: CertificateTemplateId;
  name: string;
  description: string;
}

export const CERTIFICATE_TEMPLATES: CertificateTemplateMeta[] = [
  {
    id: 're2m-classique',
    name: 'RE2M Classique',
    description: "Modèle officiel historique — cadre baroque orné, arabesques fines dorées et sceau circulaire vintage."
  },
  {
    id: 'moderne',
    name: 'Executive Moderne',
    description: 'Design contemporain haut de gamme — structure architecturale bleu nuit, accents or champagne et badge géométrique.'
  },
  {
    id: 'corporate',
    name: 'Prestige Institutionnel',
    description: "Diplôme d'excellence — double cadre guilloché impérial, blason aux lauriers dorés et grand médaillon d'honneur."
  }
];
