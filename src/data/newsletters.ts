export interface Newsletter {
  id: string;
  subject: string;
  bodyHtml: string;
  attachment?: string;
  recipients: number;
  status: 'sent' | 'draft';
  sentAt: string;
}

export const newsletters: Newsletter[] = [
  {
    id: 'NL-001',
    subject: 'Bilan 2025 & perspectives Achats-Logistique 2026',
    bodyHtml: '<p>Retour sur une année riche en accompagnements pour le Cabinet RE2M.</p>',
    recipients: 312,
    status: 'sent',
    sentAt: '2026-07-02'
  },
  {
    id: 'NL-002',
    subject: 'Nouvelle session de formation certifiante — inscriptions ouvertes',
    bodyHtml: '<p>Découvrez notre nouveau cycle de formation en gestion des achats.</p>',
    recipients: 298,
    status: 'sent',
    sentAt: '2026-06-15'
  },
  {
    id: 'NL-003',
    subject: 'Partenariat COLAS Gabon : les coulisses du projet',
    bodyHtml: '<p>Zoom sur notre accompagnement auprès de COLAS Gabon.</p>',
    recipients: 305,
    status: 'sent',
    sentAt: '2026-05-20'
  }
];
