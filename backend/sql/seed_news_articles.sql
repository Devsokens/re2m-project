-- RE2M — seed data for Actualités & Blog (Phase 3).
-- Run once in the Supabase SQL editor, after schema.sql. Reproduces the
-- content that used to live in src/data/news.ts and src/data/articles.ts.

insert into news (title, excerpt, date, image, tag) values
  ('Le Cabinet RE2M signe un nouveau partenariat avec COLAS Gabon', 'Un accompagnement renforcé sur la gestion de la relation fournisseurs et l''optimisation des achats de chantier.', '2026-07-20', '/service_01.jpg', 'Partenariat'),
  ('Cycle de formations certifiantes : session de rentrée 2026', 'Ouverture des inscriptions pour la nouvelle session de formations en gestion des achats et de la logistique.', '2026-06-30', '/service_02.jpg', 'Formation'),
  ('RE2M au Forum Économique de Libreville', 'Le Cabinet RE2M est intervenu sur la performance des chaînes logistiques dans les économies émergentes.', '2026-05-15', '/service_03.jpg', 'Événement'),
  ('Renouvellement de la certification PNUD du Cabinet', 'Le Cabinet RE2M confirme son niveau d''exigence international en matière de gestion des achats publics.', '2026-04-18', '/service_01.jpg', 'Certification'),
  ('Ouverture d''une antenne conseil à Port-Gentil', 'Le Cabinet RE2M renforce sa présence auprès des acteurs industriels de la zone économique de Port-Gentil.', '2026-03-05', '/service_02.jpg', 'Développement'),
  ('Table ronde sur la résilience des chaînes logistiques', 'Nos experts ont partagé leur retour d''expérience sur la sécurisation des approvisionnements en zone CEMAC.', '2026-02-11', '/service_03.jpg', 'Événement');

insert into articles (title, excerpt, content, author, date, image, category, tags) values
(
  '5 leviers pour optimiser votre chaîne d''approvisionnement',
  'Découvrez les bonnes pratiques que nos consultants mettent en œuvre pour réduire les coûts d''achats et sécuriser les délais de livraison.',
  '<p>Dans un contexte économique marqué par la volatilité des prix et la fragilité des circuits d''approvisionnement, structurer sa chaîne logistique n''est plus une option mais une nécessité stratégique.</p><p>Nos consultants identifient systématiquement cinq leviers d''action prioritaires : la rationalisation du panel fournisseurs, la digitalisation des processus de commande, l''optimisation des stocks de sécurité, la contractualisation des conditions d''achat et le pilotage par la donnée.</p><p>La rationalisation du panel fournisseurs permet de concentrer les volumes sur des partenaires fiables et d''obtenir de meilleures conditions tarifaires, tout en réduisant le risque de rupture. La digitalisation, quant à elle, fluidifie les échanges et réduit les délais de traitement des commandes de manière significative.</p><p>Enfin, un pilotage rigoureux par des indicateurs de performance (taux de service, délai moyen de livraison, coût logistique par unité) permet de détecter rapidement les dérives et d''ajuster la stratégie d''approvisionnement en continu.</p>',
  'Roch-Emmanuel MVE-MBORO', '2026-06-12', '/service_01.jpg', 'Achats & Logistique', array['Achats','Logistique']
),
(
  'Digitalisation des achats : par où commencer ?',
  'Un guide pratique pour engager la transformation digitale de votre fonction Achats sans bouleverser vos équipes.',
  '<p>La digitalisation de la fonction Achats est souvent perçue comme un projet lourd et coûteux. Notre expérience terrain montre qu''une démarche progressive, centrée sur les irritants du quotidien, donne des résultats bien plus durables.</p><p>La première étape consiste à cartographier les processus existants pour identifier les tâches répétitives à faible valeur ajoutée : ressaisie de bons de commande, relances fournisseurs manuelles, reporting Excel chronophage.</p><p>Une fois ces irritants identifiés, il devient possible de prioriser les outils à déployer : un système de e-procurement pour les achats récurrents, un tableau de bord automatisé pour le suivi des indicateurs, ou encore une plateforme collaborative pour la gestion des appels d''offres.</p><p>L''accompagnement au changement reste le facteur clé de succès : sans adhésion des équipes, même le meilleur outil restera sous-exploité.</p>',
  'Cabinet RE2M', '2026-05-28', '/service_02.jpg', 'Transformation Digitale', array['Digital','Achats']
),
(
  'Gestion des stocks : les erreurs qui coûtent cher',
  'Les erreurs les plus fréquentes observées lors de nos audits et comment les corriger durablement.',
  '<p>Au fil de nos missions d''audit, certaines erreurs de gestion des stocks reviennent systématiquement, quel que soit le secteur d''activité de nos clients.</p><p>La première est l''absence de classification ABC des articles, qui conduit à traiter avec la même rigueur des références stratégiques et des références marginales, diluant ainsi l''effort de gestion là où il compte le moins.</p><p>La deuxième erreur fréquente concerne le calcul des stocks de sécurité, souvent fixé de manière empirique plutôt que sur la base de la variabilité réelle de la demande et des délais fournisseurs, ce qui génère soit des surstocks coûteux, soit des ruptures récurrentes.</p><p>Enfin, l''absence d''inventaires tournants réguliers fausse la fiabilité des données de stock et complique toute prise de décision éclairée. Corriger ces trois points suffit, dans la majorité des cas, à améliorer sensiblement la performance logistique.</p>',
  'Cabinet RE2M', '2026-05-10', '/service_03.jpg', 'Gestion des Stocks', array['Stocks','Audit']
),
(
  'Négociation fournisseurs : les clés pour créer un rapport de force favorable',
  'Nos consultants partagent leurs méthodes pour préparer et mener des négociations fournisseurs à forte valeur ajoutée.',
  '<p>Une négociation fournisseur réussie se prépare bien avant de s''asseoir à la table des discussions. La qualité de la préparation détermine dans une large mesure le résultat final.</p><p>Cette préparation passe par une connaissance fine du marché fournisseur, une analyse du rapport de dépendance mutuelle entre les deux parties, et la définition claire d''objectifs hiérarchisés : prix, délais, qualité, conditions de paiement.</p><p>Nos consultants recommandent également de toujours disposer d''une alternative crédible avant d''entamer la négociation, ce qui renforce naturellement la position de l''acheteur sans nécessiter d''agressivité excessive.</p><p>Enfin, la formalisation rigoureuse des accords obtenus, dans un contrat clair et équilibré, garantit la pérennité des bénéfices négociés sur la durée de la relation commerciale.</p>',
  'Roch-Emmanuel MVE-MBORO', '2026-04-22', '/service_01.jpg', 'Négociation', array['Négociation','Fournisseurs']
);
