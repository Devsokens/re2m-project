export interface NewsItem {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  tag: string;
}

export const news: NewsItem[] = [
  {
    title: 'Le Cabinet RE2M signe un nouveau partenariat avec COLAS Gabon',
    excerpt: "Un accompagnement renforcé sur la gestion de la relation fournisseurs et l'optimisation des achats de chantier.",
    date: '2026-07-20',
    image: '/service_01.jpg',
    tag: 'Partenariat'
  },
  {
    title: 'Cycle de formations certifiantes : session de rentrée 2026',
    excerpt: "Ouverture des inscriptions pour la nouvelle session de formations en gestion des achats et de la logistique.",
    date: '2026-06-30',
    image: '/service_02.jpg',
    tag: 'Formation'
  },
  {
    title: 'RE2M au Forum Économique de Libreville',
    excerpt: "Le Cabinet RE2M est intervenu sur la performance des chaînes logistiques dans les économies émergentes.",
    date: '2026-05-15',
    image: '/service_03.jpg',
    tag: 'Événement'
  },
  {
    title: 'Renouvellement de la certification PNUD du Cabinet',
    excerpt: "Le Cabinet RE2M confirme son niveau d'exigence international en matière de gestion des achats publics.",
    date: '2026-04-18',
    image: '/service_01.jpg',
    tag: 'Certification'
  },
  {
    title: 'Ouverture d\'une antenne conseil à Port-Gentil',
    excerpt: "Le Cabinet RE2M renforce sa présence auprès des acteurs industriels de la zone économique de Port-Gentil.",
    date: '2026-03-05',
    image: '/service_02.jpg',
    tag: 'Développement'
  },
  {
    title: 'Table ronde sur la résilience des chaînes logistiques',
    excerpt: "Nos experts ont partagé leur retour d'expérience sur la sécurisation des approvisionnements en zone CEMAC.",
    date: '2026-02-11',
    image: '/service_03.jpg',
    tag: 'Événement'
  }
];
