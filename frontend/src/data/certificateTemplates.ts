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
    description: "Cadre orné doré/gris, sceau circulaire — le modèle officiel du Cabinet RE2M."
  },
  {
    id: 'moderne',
    name: 'Moderne',
    description: 'Bandeau bleu marine épuré, typographie contemporaine, sans fioritures.'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: "Bordure fine, ruban d'accent doré, mise en page sobre et institutionnelle."
  }
];
