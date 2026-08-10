import { PageLayout, CMSBlock, PageSlug } from '../types/cms';
import { partners as defaultPartners } from '../data/partners';

// Default initial blocks for the Homepage (Accueil)
const defaultAccueilBlocks: CMSBlock[] = [
  {
    id: 'accueil_hero',
    type: 'Hero',
    order: 0,
    enabled: true,
    settings: {
      slides: [
        {
          title: "Audit & Conseil en Achats & Logistique",
          subtitle: "25 ans d'expertise",
          text: "Le Cabinet RE2M vous accompagne dans l'optimisation de vos fonctions Achats et Logistique. Avec plus de 25 ans d'expérience, nous vous garantissons des résultats probants et mesurables.",
          image: "/slide_01.jpg",
          cta: "Nous Contacter",
          targetView: 'contact'
        },
        {
          title: "Expertise & Transfert de Compétences",
          subtitle: "Formation certifiante",
          text: "Dirigé par Roch-Emmanuel MVE-MBORO, Expert-Consultant-Formateur certifié PNUD, notre cabinet vous forme aux meilleures pratiques des Achats et de la Logistique.",
          image: "/slide_02.jpg",
          cta: "Nos Services",
          targetView: 'nos-services'
        },
        {
          title: "Gagner Grâce aux Achats",
          subtitle: "Résultats garantis",
          text: "Notre mission : vous faire réaliser des économies significatives et améliorer votre productivité grâce à une gestion optimisée de vos achats et de votre supply chain.",
          image: "/slide_03.jpg",
          cta: "En Savoir Plus",
          targetView: 'qui-nous-sommes'
        }
      ]
    }
  },
  {
    id: 'accueil_stats',
    type: 'CounterStats',
    order: 1,
    enabled: true,
    settings: {
      badge: 'Notre valeur ajoutée',
      title: 'Faire gagner votre entreprise',
      description: "Notre expertise de 25 ans nous permet d'intervenir dans tous les secteurs d'activité avec des résultats concrets. Nous transformons vos fonctions Achats et Logistique en véritables leviers de performance.",
      stats: [
        { value: '25', label: "Ans d'Expérience" },
        { value: '16', label: 'Entreprises Formées' },
        { value: '42', label: 'Projets Réalisés' },
        { value: '23', label: 'Formations Certifiantes' }
      ]
    }
  },
  {
    id: 'accueil_services',
    type: 'ServicesPreview',
    order: 2,
    enabled: true,
    settings: {
      title: "Quelques-uns de nos services",
      description: "Le Cabinet RE2M offre une gamme complète de services d'audit, de conseil, de formation et d'accompagnement en Achats et Logistique.",
      limit: 3
    }
  },
  {
    id: 'accueil_testimonials',
    type: 'Testimonials',
    order: 3,
    enabled: true,
    settings: {
      title: "Ce que disent nos clients",
      description: "Découvrez les retours d'expérience des leaders sectoriels accompagnés par le Cabinet RE2M.",
      items: [
        {
          company: 'COLAS Gabon',
          service: 'Formation & Accompagnement',
          text: '“Le Cabinet RE2M nous a accompagnés dans la mise en place de notre gestion de la relation fournisseurs. Des résultats concrets et mesurables.”',
          logo: 'https://tse4.mm.bing.net/th/id/OIP.TeuJJGq0FrNo9cbaoSOijQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
          company: 'SEEG',
          service: 'Formation & Conseil',
          text: '“Expertise remarquable en gestion des stocks et relation fournisseurs. Une équipe professionnelle et réactive.”',
          logo: 'https://africannuaire.com/wp-content/uploads/2017/05/LOGO-SEEG-AA-17.jpg'
        },
        {
          company: 'SGEPP',
          service: 'Formation Achats',
          text: '“Des formations pratiques et opérationnelles qui ont directement impacté notre performance achats.”',
          logo: 'https://arda.africa/wp-content/uploads/2022/08/Arda_Member_Logos_SGEPP.png'
        },
        {
          company: 'PERENCO',
          service: 'Gestion des Inventaires',
          text: '“Un accompagnement de qualité pour l\'optimisation de notre gestion des inventaires. Recommandé.”',
          logo: 'https://th.bing.com/th/id/R.416f199d5a0200667f7e42d6df1e3241?rik=4M35Oghc52VHow&riu=http%3a%2f%2flogonoid.com%2fimages%2fperenco-logo.png&ehk=AX2r5xs6pgn5JJuZJsUs4dLRsQMfAVJthprTVaaeaE8%3d&risl=&pid=ImgRaw&r=0'
        }
      ]
    }
  },
  {
    id: 'accueil_founder',
    type: 'FounderSection',
    order: 4,
    enabled: true,
    settings: {
      title: "Notre Fondateur",
      subtitle: "Roch-Emmanuel MVE-MBORO",
      quote: "Expert-Consultant-Formateur en Achats & Logistique certifié par le Programme des Nations Unies pour le Développement (PNUD).",
      paragraphs: [
        "Fort de 25 ans d'expérience internationale, il a développé une expertise reconnue dans l'optimisation des fonctions Achats et Logistique. Sa certification UNDP Procurement Certification témoigne de son excellence professionnelle."
      ],
      image: "https://www.cabinet-re2m.com/assets/images/team_01.jpg"
    }
  },
  {
    id: 'accueil_partners',
    type: 'Collaborations',
    order: 5,
    enabled: true,
    settings: {
      title: "Ils nous font confiance",
      description: "Des entreprises leaders de leur secteur partenaires du Cabinet RE2M",
      items: defaultPartners
    }
  }
];

// Default initial blocks for the About page (Qui nous sommes)
const defaultAboutBlocks: CMSBlock[] = [
  {
    id: 'about_header',
    type: 'HeaderBanner',
    order: 0,
    enabled: true,
    settings: {
      badge: "Qui Sommes-Nous",
      title: "Cabinet RE2M • L'Excellence Achats & Logistique",
      description: "Cabinet d'audit, de conseil, de formation et d'accompagnement spécialisé en Supply Chain, Achats et Logistique.",
      backgroundImage: "/qui_nous_sommes_bg.jpg"
    }
  },
  {
    id: 'about_grid',
    type: 'PresentationGrid',
    order: 1,
    enabled: true,
    settings: {
      title: "Qui Sommes-Nous ?",
      desc1: "Le Cabinet RE2M est un cabinet d'audit, de conseil, de formation, d'accompagnement et de coaching en Achats et Logistique. Nous intervenons dans l'organisation, la réorganisation et l'optimisation des fonctions Achats & Logistique des organisations.",
      desc2: "Avec 25 ans de pratique et d'expérience dans le monde dont un accent particulier sur le local, nous garantissons des résultats probants dans des environnements et contextes variés.",
      commitmentsTitle: "Nos Engagements Clés",
      commitments: [
        { title: "Rigueur & Déontologie", desc: "Respect des normes éthiques internationales." },
        { title: "Résultats Mesurables", desc: "Chaque audit débouche sur des économies concrètes." },
        { title: "Proximité Locale", desc: "Présence forte à Libreville pour un suivi direct." }
      ]
    }
  },
  {
    id: 'about_director',
    type: 'DirectorMessage',
    order: 2,
    enabled: true,
    settings: {
      title: "Mot du Directeur",
      subtitle: "Bienvenue au Cabinet RE2M, votre partenaire stratégique",
      paragraphs: [
        "Chers visiteurs, clients et partenaires,",
        "C'est avec un grand plaisir que je vous accueille sur le site web du Cabinet RE2M. Je tiens à remercier chaleureusement nos clients fidèles pour la confiance qu'ils nous témoignent depuis maintenant cinq (5) ans, une confiance qui est le moteur de notre engagement quotidien.",
        "Dans un environnement professionnel en constante évolution, notre mission est claire : vous accompagner dans vos défis et ambitions afin de vous faire « gagner grâce aux Achats » en vous apportant des solutions de conseil sur mesure, innovantes et à forte valeur ajoutée.",
        "Au Cabinet RE2M, nous croyons fermement que le succès de nos clients est la mesure de notre propre réussite. Notre équipe de consultants expérimentés, hautement qualifiés dans leurs domaines respectifs, met à votre disposition une expertise solide et pertinente, forgée par vingt-cinq années de pratique sur le terrain.",
        "Nous privilégions une approche collaborative et humaine, où l'écoute active et la compréhension fine de vos enjeux spécifiques sont primordiales. Notre objectif est de construire un partenariat fort et durable, basé sur la transparence, l'excellence et des résultats tangibles.",
        "Je vous invite à parcourir les différentes sections de notre site pour découvrir l'étendue de nos services et nos domaines d'expertise. Que vous soyez une start-up, une PME ou un grand groupe, nous sommes prêts à relever vos défis à vos côtés.",
        "N'hésitez pas à nous contacter pour échanger sur vos projets. Votre opinion nous est précieuse et nous permettra d'effectuer les ajustements nécessaires pour vous offrir un service d'une qualité optimale.",
        "Au plaisir de collaborer prochainement,"
      ],
      directorName: "Roch-Emmanuel MVE-MBORO",
      directorTitle: "Directeur Général, Cabinet RE2M",
      image: "https://re-2-m-plateforme-marco-9167.vercel.app/more-info.jpg"
    }
  },
  {
    id: 'about_partners',
    type: 'Collaborations',
    order: 3,
    enabled: true,
    settings: {
      title: "Ils nous font confiance",
      description: "Des entreprises leaders de leur secteur partenaires du Cabinet RE2M",
      items: defaultPartners
    }
  }
];

// Default initial blocks for the Services page (Nos Services)
const defaultServicesBlocks: CMSBlock[] = [
  {
    id: 'services_header',
    type: 'HeaderBanner',
    order: 0,
    enabled: true,
    settings: {
      badge: "Nos Services",
      title: "Nos Domaines d'Expertise Stratégiques",
      description: "Des services structurés pour vous faire réaliser des économies substantielles et optimiser vos flux de stockage."
    }
  },
  {
    id: 'services_list',
    type: 'ServicesList',
    order: 1,
    enabled: true,
    settings: {
      items: [
        {
          iconName: 'ClipboardList',
          title: "Audit de la fonction Achats",
          desc: "Évaluation complète de votre organisation, de vos processus d'achats et de votre portefeuille de fournisseurs.",
          details: [
            "Analyse des dépenses et cartographie des achats",
            "Évaluation de la maturité de la fonction Achats",
            "Plan de progrès et pistes d'économies rapides (Quick wins)"
          ],
          image: "/single_service_01.jpg"
        },
        {
          iconName: 'GraduationCap',
          title: "Formation & Renforcement des capacités",
          desc: "Programmes professionnels certifiants PNUD ou personnalisés pour monter en compétences sur les pratiques achats.",
          details: [
            "Préparation aux certifications Achats internationales",
            "Négociation commerciale et gestion des contrats",
            "Gestion opérationnelle des stocks et des approvisionnements"
          ],
          image: "/single_service_02.jpg"
        },
        {
          iconName: 'UsersRound',
          title: "Accompagnement opérationnel",
          desc: "Soutien direct de nos experts pour réaliser vos projets complexes et structurer vos outils au quotidien.",
          details: [
            "Coaching individuel des acheteurs et managers",
            "Externalisation partielle ou assistance sur appel d'offres",
            "Mise en place de tableaux de bord de performance (KPIs)"
          ],
          image: "/single_service_03.jpg"
        },
        {
          iconName: 'Workflow',
          title: "Gestion des Flux Physiques & Financiers",
          desc: "Audit, réorganisation et pilotage optimisé des stocks, flux logistiques et processus transactionnels.",
          details: [
            "Optimisation des surfaces et processus d'entreposage",
            "Déploiement de SI dédiés (SAP, Oracle, Sage X3)",
            "Mesure de la performance achats et fournisseurs"
          ],
          image: "/single_service_04.jpg"
        }
      ]
    }
  },
  {
    id: 'services_partners',
    type: 'Collaborations',
    order: 2,
    enabled: true,
    settings: {
      title: "Ils nous font confiance",
      description: "Des entreprises leaders de leur secteur partenaires du Cabinet RE2M",
      items: defaultPartners
    }
  }
];

// Default initial blocks for the Contact page
const defaultContactBlocks: CMSBlock[] = [
  {
    id: 'contact_details',
    type: 'ContactDetails',
    order: 0,
    enabled: true,
    settings: {
      badge: "Nous Contacter",
      title: "Prenez Contact avec le Cabinet RE2M",
      description: "Nos conseillers sont disponibles pour répondre à toutes vos demandes.",
      addressTitle: "Adresse Physique",
      addressLine1: "93 rue Albert AKOULOU OSSE",
      addressLine2: "BP 1.357 Libreville, Gabon",
      phoneTitle: "Téléphones Directs",
      phone1: "+241 77 17 11 77",
      phone2: "+241 65 06 25 26",
      emailTitle: "Messagerie",
      email: "remvemboro@outlook.fr",
      hoursTitle: "Heures d'Ouverture",
      hoursLine1: "Lundi - Vendredi",
      hoursLine2: "08:00 - 17:00",
      rccm: "RCCM: RG.LBV.2017A41250",
      nif: "NIF: 482.914Y"
    }
  }
];

// Master default layouts map
const defaultLayouts: Record<PageSlug, CMSBlock[]> = {
  'accueil': defaultAccueilBlocks,
  'qui-nous-sommes': defaultAboutBlocks,
  'nos-services': defaultServicesBlocks,
  'contact': defaultContactBlocks
};

// Storage helper functions
const getStorageKey = (slug: PageSlug, isDraft: boolean) => {
  return `cms_layout_${slug}_${isDraft ? 'draft' : 'published'}`;
};

// Bump this whenever defaultLayouts block ORDER changes, so every browser
// automatically re-syncs instead of keeping stale block ordering forever
// (stored blocks otherwise keep their own `order`, see mergeDefaultSettings).
const CMS_SCHEMA_VERSION = '2';
const SCHEMA_VERSION_KEY = 'cms_schema_version';

function mergeDefaultSettings(storedBlocks: CMSBlock[], defaultBlocks: CMSBlock[]): CMSBlock[] {
  const mergedExisting = storedBlocks.map(stored => {
    const defBlock = defaultBlocks.find(d => d.id === stored.id);
    if (!defBlock) return stored;
    
    const mergedSettings = { ...defBlock.settings, ...stored.settings };
    
    // For any list-based block, if the stored list is undefined or empty/has only 1 item (recovering legacy wiped states), migrate it from default
    if (stored.type === 'Collaborations' && (stored.settings?.items === undefined || stored.settings.items.length <= 1)) {
      mergedSettings.items = defBlock.settings.items;
    }
    if (stored.type === 'Testimonials' && stored.settings?.items === undefined) {
      mergedSettings.items = defBlock.settings.items;
    }
    if (stored.type === 'Hero' && stored.settings?.slides === undefined) {
      mergedSettings.slides = defBlock.settings.slides;
    }
    if (stored.type === 'CounterStats' && stored.settings?.stats === undefined) {
      mergedSettings.stats = defBlock.settings.stats;
    }
    if (stored.type === 'ServicesList' && stored.settings?.items === undefined) {
      mergedSettings.items = defBlock.settings.items;
    }
    if (stored.type === 'PresentationGrid' && stored.settings?.commitments === undefined) {
      mergedSettings.commitments = defBlock.settings.commitments;
    }
    if (stored.type === 'ContactDetails' && stored.settings?.title === undefined) {
      Object.assign(mergedSettings, defBlock.settings);
    }
    if (stored.type === 'FounderSection') {
      if (stored.settings?.title === undefined || stored.settings.title === 'Notre valeur ajoutée') {
        Object.assign(mergedSettings, defBlock.settings);
      } else if (stored.settings.image === '/more-info.jpg' || stored.settings.image === '/team_01.jpg') {
        mergedSettings.image = defBlock.settings.image;
      }
    }
    if (stored.type === 'DirectorMessage') {
      if (stored.settings?.image === undefined || stored.settings.image === '/team_01.jpg' || stored.settings.image === '/more-info.jpg') {
        mergedSettings.image = defBlock.settings.image;
      }
    }
    
    return {
      ...stored,
      settings: mergedSettings
    };
  });

  const missingBlocks = defaultBlocks.filter(d => !storedBlocks.some(s => s.id === d.id));
  return [...mergedExisting, ...missingBlocks].sort((a, b) => a.order - b.order);
}

export const cmsStorage = {
  // Initialize default layout data in localStorage if it doesn't exist
  init() {
    if (localStorage.getItem(SCHEMA_VERSION_KEY) !== CMS_SCHEMA_VERSION) {
      (Object.keys(defaultLayouts) as PageSlug[]).forEach((slug) => {
        localStorage.removeItem(getStorageKey(slug, false));
        localStorage.removeItem(getStorageKey(slug, true));
      });
      localStorage.setItem(SCHEMA_VERSION_KEY, CMS_SCHEMA_VERSION);
    }

    (Object.keys(defaultLayouts) as PageSlug[]).forEach((slug) => {
      const pubKey = getStorageKey(slug, false);
      const draftKey = getStorageKey(slug, true);

      if (!localStorage.getItem(pubKey)) {
        localStorage.setItem(pubKey, JSON.stringify(defaultLayouts[slug]));
      } else {
        try {
          const parsed = JSON.parse(localStorage.getItem(pubKey) || '[]') as CMSBlock[];
          const migrated = mergeDefaultSettings(parsed, defaultLayouts[slug]);
          localStorage.setItem(pubKey, JSON.stringify(migrated));
        } catch(e) {}
      }
      
      if (!localStorage.getItem(draftKey)) {
        localStorage.setItem(draftKey, JSON.stringify(defaultLayouts[slug]));
      } else {
        try {
          const parsed = JSON.parse(localStorage.getItem(draftKey) || '[]') as CMSBlock[];
          const migrated = mergeDefaultSettings(parsed, defaultLayouts[slug]);
          localStorage.setItem(draftKey, JSON.stringify(migrated));
        } catch(e) {}
      }
    });
  },

  // Retrieve draft page layout config
  getDraftLayout(slug: PageSlug): CMSBlock[] {
    this.init();
    const data = localStorage.getItem(getStorageKey(slug, true));
    return data ? JSON.parse(data) : [];
  },

  // Retrieve published page layout config
  getPublishedLayout(slug: PageSlug): CMSBlock[] {
    this.init();
    const data = localStorage.getItem(getStorageKey(slug, false));
    return data ? JSON.parse(data) : [];
  },

  // Save changes to draft config
  saveDraftLayout(slug: PageSlug, blocks: CMSBlock[]) {
    localStorage.setItem(getStorageKey(slug, true), JSON.stringify(blocks));
  },

  // Publish draft config by copying to published key
  publishLayout(slug: PageSlug) {
    const draftData = localStorage.getItem(getStorageKey(slug, true));
    if (draftData) {
      localStorage.setItem(getStorageKey(slug, false), draftData);
    }
  },

  // Reset page layout to defaults
  resetToDefault(slug: PageSlug): CMSBlock[] {
    const defaults = defaultLayouts[slug];
    localStorage.setItem(getStorageKey(slug, true), JSON.stringify(defaults));
    localStorage.setItem(getStorageKey(slug, false), JSON.stringify(defaults));
    return defaults;
  }
};
