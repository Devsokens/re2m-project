export type BlockType = 
  | 'Hero' 
  | 'CounterStats' 
  | 'ServicesPreview' 
  | 'FounderSection' 
  | 'Testimonials' 
  | 'Collaborations'
  | 'HeaderBanner'
  | 'PresentationGrid'
  | 'DirectorMessage'
  | 'ServicesList'
  | 'ContactDetails';

export interface CMSBlock {
  id: string;
  type: BlockType;
  order: number;
  enabled: boolean;
  settings: Record<string, any>;
}

export type PageSlug = 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact';

export interface PageLayout {
  id: string;
  slug: PageSlug;
  title: string;
  blocks: CMSBlock[];
  createdAt: string;
  updatedAt: string;
}
