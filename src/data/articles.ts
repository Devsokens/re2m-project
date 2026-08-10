export interface Article {
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  image: string;
  category: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    title: "5 leviers pour optimiser votre chaîne d'approvisionnement",
    excerpt: "Découvrez les bonnes pratiques que nos consultants mettent en œuvre pour réduire les coûts d'achats et sécuriser les délais de livraison.",
    content: [
      "Dans un contexte économique marqué par la volatilité des prix et la fragilité des circuits d'approvisionnement, structurer sa chaîne logistique n'est plus une option mais une nécessité stratégique.",
      "Nos consultants identifient systématiquement cinq leviers d'action prioritaires : la rationalisation du panel fournisseurs, la digitalisation des processus de commande, l'optimisation des stocks de sécurité, la contractualisation des conditions d'achat et le pilotage par la donnée.",
      "La rationalisation du panel fournisseurs permet de concentrer les volumes sur des partenaires fiables et d'obtenir de meilleures conditions tarifaires, tout en réduisant le risque de rupture. La digitalisation, quant à elle, fluidifie les échanges et réduit les délais de traitement des commandes de manière significative.",
      "Enfin, un pilotage rigoureux par des indicateurs de performance (taux de service, délai moyen de livraison, coût logistique par unité) permet de détecter rapidement les dérives et d'ajuster la stratégie d'approvisionnement en continu."
    ],
    author: 'Roch-Emmanuel MVE-MBORO',
    date: '2026-06-12',
    image: '/service_01.jpg',
    category: 'Achats & Logistique',
    tags: ['Achats', 'Logistique']
  },
  {
    title: 'Digitalisation des achats : par où commencer ?',
    excerpt: "Un guide pratique pour engager la transformation digitale de votre fonction Achats sans bouleverser vos équipes.",
    content: [
      "La digitalisation de la fonction Achats est souvent perçue comme un projet lourd et coûteux. Notre expérience terrain montre qu'une démarche progressive, centrée sur les irritants du quotidien, donne des résultats bien plus durables.",
      "La première étape consiste à cartographier les processus existants pour identifier les tâches répétitives à faible valeur ajoutée : ressaisie de bons de commande, relances fournisseurs manuelles, reporting Excel chronophage.",
      "Une fois ces irritants identifiés, il devient possible de prioriser les outils à déployer : un système de e-procurement pour les achats récurrents, un tableau de bord automatisé pour le suivi des indicateurs, ou encore une plateforme collaborative pour la gestion des appels d'offres.",
      "L'accompagnement au changement reste le facteur clé de succès : sans adhésion des équipes, même le meilleur outil restera sous-exploité."
    ],
    author: 'Cabinet RE2M',
    date: '2026-05-28',
    image: '/service_02.jpg',
    category: 'Transformation Digitale',
    tags: ['Digital', 'Achats']
  },
  {
    title: "Gestion des stocks : les erreurs qui coûtent cher",
    excerpt: 'Les erreurs les plus fréquentes observées lors de nos audits et comment les corriger durablement.',
    content: [
      "Au fil de nos missions d'audit, certaines erreurs de gestion des stocks reviennent systématiquement, quel que soit le secteur d'activité de nos clients.",
      "La première est l'absence de classification ABC des articles, qui conduit à traiter avec la même rigueur des références stratégiques et des références marginales, diluant ainsi l'effort de gestion là où il compte le moins.",
      "La deuxième erreur fréquente concerne le calcul des stocks de sécurité, souvent fixé de manière empirique plutôt que sur la base de la variabilité réelle de la demande et des délais fournisseurs, ce qui génère soit des surstocks coûteux, soit des ruptures récurrentes.",
      "Enfin, l'absence d'inventaires tournants réguliers fausse la fiabilité des données de stock et complique toute prise de décision éclairée. Corriger ces trois points suffit, dans la majorité des cas, à améliorer sensiblement la performance logistique."
    ],
    author: 'Cabinet RE2M',
    date: '2026-05-10',
    image: '/service_03.jpg',
    category: 'Gestion des Stocks',
    tags: ['Stocks', 'Audit']
  },
  {
    title: 'Négociation fournisseurs : les clés pour créer un rapport de force favorable',
    excerpt: "Nos consultants partagent leurs méthodes pour préparer et mener des négociations fournisseurs à forte valeur ajoutée.",
    content: [
      "Une négociation fournisseur réussie se prépare bien avant de s'asseoir à la table des discussions. La qualité de la préparation détermine dans une large mesure le résultat final.",
      "Cette préparation passe par une connaissance fine du marché fournisseur, une analyse du rapport de dépendance mutuelle entre les deux parties, et la définition claire d'objectifs hiérarchisés : prix, délais, qualité, conditions de paiement.",
      "Nos consultants recommandent également de toujours disposer d'une alternative crédible avant d'entamer la négociation, ce qui renforce naturellement la position de l'acheteur sans nécessiter d'agressivité excessive.",
      "Enfin, la formalisation rigoureuse des accords obtenus, dans un contrat clair et équilibré, garantit la pérennité des bénéfices négociés sur la durée de la relation commerciale."
    ],
    author: 'Roch-Emmanuel MVE-MBORO',
    date: '2026-04-22',
    image: '/service_01.jpg',
    category: 'Négociation',
    tags: ['Négociation', 'Fournisseurs']
  }
];
