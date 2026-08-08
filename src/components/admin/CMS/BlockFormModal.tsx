import React, { useState, useEffect } from 'react';
import { CMSBlock } from '../../../types/cms';
import { X, Trash2, Plus, Image } from 'lucide-react';

interface BlockFormModalProps {
  block: CMSBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBlock: CMSBlock) => void;
  onChange?: (updatedBlock: CMSBlock) => void;
  inline?: boolean;
}

export const BlockFormModal: React.FC<BlockFormModalProps> = ({
  block,
  isOpen,
  onClose,
  onSave,
  onChange,
  inline = false
}) => {
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    if (block) {
      setLocalSettings(JSON.parse(JSON.stringify(block.settings)));
    }
  }, [block, isOpen]);

  if (!isOpen || !block) return null;

  const handleFieldChange = (key: string, value: any) => {
    const updated = {
      ...localSettings,
      [key]: value
    };
    setLocalSettings(updated);
    
    onChange?.({
      ...block,
      settings: updated
    });
  };

  const handleSave = () => {
    onSave({
      ...block,
      settings: localSettings
    });
    onClose();
  };

  // Render sub-forms based on block type
  const renderFormFields = () => {
    switch (block.type) {
      case 'Hero':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Diapositives du Carousel</h4>
              <button
                type="button"
                onClick={() => {
                  const newSlides = [...(localSettings.slides || [])];
                  newSlides.push({
                    title: "Nouveau titre de diapositive",
                    subtitle: "Sous-titre",
                    text: "Description de la diapositive...",
                    image: "/slide_01.jpg",
                    cta: "Découvrir",
                    targetView: "nos-services"
                  });
                  handleFieldChange('slides', newSlides);
                }}
                className="px-3 py-1 bg-[#C5A85C] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#B5933A] cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Ajouter une Diapositive</span>
              </button>
            </div>
            
            {(localSettings.slides || []).map((slide: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative group/slide">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-[#002366]">Slide #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newSlides = [...localSettings.slides];
                      newSlides.splice(idx, 1);
                      handleFieldChange('slides', newSlides);
                    }}
                    className="text-rose-600 hover:text-rose-800 text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                    title="Supprimer cette diapositive"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Surtitre / Badge</label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => {
                        const newSlides = [...localSettings.slides];
                        newSlides[idx].subtitle = e.target.value;
                        handleFieldChange('slides', newSlides);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre de la Diapo</label>
                    <input
                      type="text"
                      value={slide.title || ''}
                      onChange={(e) => {
                        const newSlides = [...localSettings.slides];
                        newSlides[idx].title = e.target.value;
                        handleFieldChange('slides', newSlides);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Description / Texte</label>
                  <textarea
                    rows={2}
                    value={slide.text || ''}
                    onChange={(e) => {
                      const newSlides = [...localSettings.slides];
                      newSlides[idx].text = e.target.value;
                      handleFieldChange('slides', newSlides);
                    }}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Chemin Image (ou URL)</label>
                    <input
                      type="text"
                      value={slide.image || ''}
                      onChange={(e) => {
                        const newSlides = [...localSettings.slides];
                        newSlides[idx].image = e.target.value;
                        handleFieldChange('slides', newSlides);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Texte Bouton</label>
                    <input
                      type="text"
                      value={slide.cta || ''}
                      onChange={(e) => {
                        const newSlides = [...localSettings.slides];
                        newSlides[idx].cta = e.target.value;
                        handleFieldChange('slides', newSlides);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Vue de Redirection</label>
                    <select
                      value={slide.targetView || 'contact'}
                      onChange={(e) => {
                        const newSlides = [...localSettings.slides];
                        newSlides[idx].targetView = e.target.value;
                        handleFieldChange('slides', newSlides);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none"
                    >
                      <option value="accueil">Accueil</option>
                      <option value="qui-nous-sommes">Qui Nous Sommes</option>
                      <option value="nos-services">Nos Services</option>
                      <option value="contact">Contact</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'CounterStats':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statistiques Clés</h4>
              <button
                type="button"
                onClick={() => {
                  const newStats = [...(localSettings.stats || [])];
                  newStats.push({ value: '100', label: 'Nouveau indicateur' });
                  handleFieldChange('stats', newStats);
                }}
                className="px-3 py-1 bg-[#C5A85C] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#B5933A] cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Ajouter un indicateur</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {(localSettings.stats || []).map((stat: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative group/stat">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400">Statistique #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newStats = [...localSettings.stats];
                        newStats.splice(idx, 1);
                        handleFieldChange('stats', newStats);
                      }}
                      className="text-rose-600 hover:text-rose-800 text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      title="Supprimer cette statistique"
                    >
                      <Trash2 className="w-3 h-3" /> Supprimer
                    </button>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Valeur (Nombre/Texte)</label>
                    <input
                      type="text"
                      value={stat.value || ''}
                      onChange={(e) => {
                        const newStats = [...localSettings.stats];
                        newStats[idx].value = e.target.value;
                        handleFieldChange('stats', newStats);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Label / Description</label>
                    <input
                      type="text"
                      value={stat.label || ''}
                      onChange={(e) => {
                        const newStats = [...localSettings.stats];
                        newStats[idx].label = e.target.value;
                        handleFieldChange('stats', newStats);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ServicesPreview':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre de la Section</label>
              <input
                type="text"
                value={localSettings.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Description / Sous-titre</label>
              <textarea
                rows={3}
                value={localSettings.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Nombre maximal de services à afficher</label>
              <input
                type="number"
                value={localSettings.limit || 3}
                onChange={(e) => handleFieldChange('limit', parseInt(e.target.value) || 3)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
              />
            </div>
          </div>
        );

      case 'Collaborations':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre de la Section</label>
                <input
                  type="text"
                  value={localSettings.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Description / Sous-titre</label>
                <input
                  type="text"
                  value={localSettings.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Liste des Partenaires</h4>
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(localSettings.items || [])];
                  newItems.push({
                    name: "Nouveau Partenaire",
                    label: "Secteur",
                    logo: ""
                  });
                  handleFieldChange('items', newItems);
                }}
                className="px-3 py-1 bg-[#C5A85C] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#B5933A] cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Ajouter un Partenaire</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(localSettings.items || []).map((partner: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative group/partner">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                    <span className="text-[10px] font-bold text-slate-450">Partenaire #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = [...localSettings.items];
                        newItems.splice(idx, 1);
                        handleFieldChange('items', newItems);
                      }}
                      className="text-rose-700 hover:text-rose-900 text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      title="Supprimer ce partenaire"
                    >
                      <Trash2 className="w-3 h-3" /> Supprimer
                    </button>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Nom</label>
                    <input
                      type="text"
                      value={partner.name || ''}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].name = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-0.5 w-full text-xs p-1.5 border border-slate-200 rounded-lg focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Label / Secteur</label>
                    <input
                      type="text"
                      value={partner.label || ''}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].label = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-0.5 w-full text-xs p-1.5 border border-slate-200 rounded-lg focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">URL Logo (PNG)</label>
                    <input
                      type="text"
                      value={partner.logo || ''}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].logo = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-0.5 w-full text-xs p-1.5 border border-slate-200 rounded-lg focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'FounderSection':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre</label>
                <input
                  type="text"
                  value={localSettings.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Sous-titre</label>
                <input
                  type="text"
                  value={localSettings.subtitle || ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Citation Forte</label>
              <input
                type="text"
                value={localSettings.quote || ''}
                onChange={(e) => handleFieldChange('quote', e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Paragraphes de Biographie (Un par ligne)</label>
              <textarea
                rows={4}
                value={(localSettings.paragraphs || []).join('\n')}
                onChange={(e) => handleFieldChange('paragraphs', e.target.value.split('\n'))}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Photo (URL / public path)</label>
              <input
                type="text"
                value={localSettings.image || ''}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        );

      case 'HeaderBanner':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Badge de l'Entête</label>
                <input
                  type="text"
                  value={localSettings.badge || ''}
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Image de Fond (si disponible)</label>
                <input
                  type="text"
                  value={localSettings.backgroundImage || ''}
                  onChange={(e) => handleFieldChange('backgroundImage', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre Principal de la Page</label>
              <input
                type="text"
                value={localSettings.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Texte de Description</label>
              <textarea
                rows={3}
                value={localSettings.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        );

      case 'Testimonials':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre de la Section</label>
                <input
                  type="text"
                  value={localSettings.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Description / Texte d'aide</label>
                <input
                  type="text"
                  value={localSettings.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Liste des Témoignages</h4>
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(localSettings.items || [])];
                  newItems.push({
                    company: "Nouvelle Entreprise",
                    service: "Prestation logistique",
                    text: "“Un accompagnement sur-mesure...”",
                    logo: ""
                  });
                  handleFieldChange('items', newItems);
                }}
                className="px-3 py-1 bg-[#C5A85C] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#B5933A] cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Ajouter un Témoignage</span>
              </button>
            </div>
            
            {(localSettings.items || []).map((testi: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group/testi">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-[#002366]">Témoignage #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...localSettings.items];
                      newItems.splice(idx, 1);
                      handleFieldChange('items', newItems);
                    }}
                    className="text-rose-600 hover:text-rose-800 text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                    title="Supprimer ce témoignage"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Nom de l'Entreprise</label>
                    <input
                      type="text"
                      value={testi.company || ''}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].company = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Prestation reçue</label>
                    <input
                      type="text"
                      value={testi.service || ''}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].service = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Texte de la Citation</label>
                  <textarea
                    rows={2}
                    value={testi.text || ''}
                    onChange={(e) => {
                      const newItems = [...localSettings.items];
                      newItems[idx].text = e.target.value;
                      handleFieldChange('items', newItems);
                    }}
                    className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">URL Logo de l'Entreprise</label>
                  <input
                    type="text"
                    value={testi.logo || ''}
                    onChange={(e) => {
                      const newItems = [...localSettings.items];
                      newItems[idx].logo = e.target.value;
                      handleFieldChange('items', newItems);
                    }}
                    className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'PresentationGrid':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre Principal</label>
              <input
                type="text"
                value={localSettings.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Description Paragraphe 1</label>
                <textarea
                  rows={3}
                  value={localSettings.desc1 || ''}
                  onChange={(e) => handleFieldChange('desc1', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Description Paragraphe 2</label>
                <textarea
                  rows={3}
                  value={localSettings.desc2 || ''}
                  onChange={(e) => handleFieldChange('desc2', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engagements Clés</h5>
                <button
                  type="button"
                  onClick={() => {
                    const newComms = [...(localSettings.commitments || [])];
                    newComms.push({ title: "Nouvel Engagement", desc: "Description de l'engagement..." });
                    handleFieldChange('commitments', newComms);
                  }}
                  className="px-3 py-1 bg-[#C5A85C] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#B5933A] cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>Ajouter un Engagement</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4 pt-2">
                {(localSettings.commitments || []).map((comm: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group/comm">
                    <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                      <span className="text-[10px] font-bold text-slate-450">Engagement #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newComms = [...localSettings.commitments];
                          newComms.splice(idx, 1);
                          handleFieldChange('commitments', newComms);
                        }}
                        className="text-rose-600 hover:text-rose-800 text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                        title="Supprimer cet engagement"
                      >
                        <Trash2 className="w-3 h-3" /> Supprimer
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Titre</label>
                        <input
                          type="text"
                          value={comm.title || ''}
                          onChange={(e) => {
                            const newComms = [...localSettings.commitments];
                            newComms[idx].title = e.target.value;
                            handleFieldChange('commitments', newComms);
                          }}
                          className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Description</label>
                        <input
                          type="text"
                          value={comm.desc || ''}
                          onChange={(e) => {
                            const newComms = [...localSettings.commitments];
                            newComms[idx].desc = e.target.value;
                            handleFieldChange('commitments', newComms);
                          }}
                          className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'DirectorMessage':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre du Bloc</label>
                <input
                  type="text"
                  value={localSettings.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Sous-titre / Salutation</label>
                <input
                  type="text"
                  value={localSettings.subtitle || ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Paragraphes du Message (Un par ligne)</label>
              <textarea
                rows={5}
                value={(localSettings.paragraphs || []).join('\n')}
                onChange={(e) => handleFieldChange('paragraphs', e.target.value.split('\n'))}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Nom du Directeur</label>
                <input
                  type="text"
                  value={localSettings.directorName || ''}
                  onChange={(e) => handleFieldChange('directorName', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Poste / Titre Officiel</label>
                <input
                  type="text"
                  value={localSettings.directorTitle || ''}
                  onChange={(e) => handleFieldChange('directorTitle', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Photo Directeur (Chemin / URL)</label>
                <input
                  type="text"
                  value={localSettings.image || ''}
                  onChange={(e) => handleFieldChange('image', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        );

      case 'ServicesList':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Liste Complète des Services (Nos Services)</h4>
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(localSettings.items || [])];
                  newItems.push({
                    title: "Nouveau Service",
                    desc: "Description courte...",
                    image: "/single_service_01.jpg",
                    iconName: "ClipboardList",
                    details: ["Détail du service 1"]
                  });
                  handleFieldChange('items', newItems);
                }}
                className="px-3 py-1 bg-[#C5A85C] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#B5933A] cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Ajouter un Service</span>
              </button>
            </div>
            
            {(localSettings.items || []).map((srv: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group/srv">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-[#002366]">Service #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...localSettings.items];
                      newItems.splice(idx, 1);
                      handleFieldChange('items', newItems);
                    }}
                    className="text-rose-600 hover:text-rose-800 text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                    title="Supprimer ce service"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre du Service</label>
                    <input
                      type="text"
                      value={srv.title || ''}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].title = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Description Courte</label>
                    <input
                      type="text"
                      value={srv.desc || ''}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].desc = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Image Associée (URL)</label>
                    <input
                      type="text"
                      value={srv.image || ''}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].image = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Nom de l'Icône Lucide</label>
                    <select
                      value={srv.iconName || 'ClipboardList'}
                      onChange={(e) => {
                        const newItems = [...localSettings.items];
                        newItems[idx].iconName = e.target.value;
                        handleFieldChange('items', newItems);
                      }}
                      className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                    >
                      <option value="ClipboardList">ClipboardList (Audit)</option>
                      <option value="GraduationCap">GraduationCap (Formation)</option>
                      <option value="UsersRound">UsersRound (Accompagnement)</option>
                      <option value="Workflow">Workflow (Flux Physiques)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Points de Détail (Un par ligne)</label>
                  <textarea
                    rows={3}
                    value={(srv.details || []).join('\n')}
                    onChange={(e) => {
                      const newItems = [...localSettings.items];
                      newItems[idx].details = e.target.value.split('\n');
                      handleFieldChange('items', newItems);
                    }}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl font-mono text-[11px] focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'ContactDetails':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Badge de l'Entête</label>
                <input
                  type="text"
                  value={localSettings.badge || ''}
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Titre Principal</label>
                <input
                  type="text"
                  value={localSettings.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Description / Texte d'aide</label>
              <textarea
                rows={2}
                value={localSettings.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white font-medium"
              />
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adresse Physique</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Label de la Carte</label>
                  <input
                    type="text"
                    value={localSettings.addressTitle || ''}
                    onChange={(e) => handleFieldChange('addressTitle', e.target.value)}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Adresse Ligne 1</label>
                  <input
                    type="text"
                    value={localSettings.addressLine1 || ''}
                    onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Adresse Ligne 2</label>
                  <input
                    type="text"
                    value={localSettings.addressLine2 || ''}
                    onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Téléphones</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Label Téléphones</label>
                  <input
                    type="text"
                    value={localSettings.phoneTitle || ''}
                    onChange={(e) => handleFieldChange('phoneTitle', e.target.value)}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Téléphone 1</label>
                  <input
                    type="text"
                    value={localSettings.phone1 || ''}
                    onChange={(e) => handleFieldChange('phone1', e.target.value)}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Téléphone 2 (Optionnel)</label>
                  <input
                    type="text"
                    value={localSettings.phone2 || ''}
                    onChange={(e) => handleFieldChange('phone2', e.target.value)}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Messagerie</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Label Email</label>
                      <input
                        type="text"
                        value={localSettings.emailTitle || ''}
                        onChange={(e) => handleFieldChange('emailTitle', e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Adresse Email</label>
                      <input
                        type="text"
                        value={localSettings.email || ''}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Heures d'Ouverture</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Label Horaires</label>
                      <input
                        type="text"
                        value={localSettings.hoursTitle || ''}
                        onChange={(e) => handleFieldChange('hoursTitle', e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Horaires Ligne 1</label>
                      <input
                        type="text"
                        value={localSettings.hoursLine1 || ''}
                        onChange={(e) => handleFieldChange('hoursLine1', e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Horaires Ligne 2</label>
                      <input
                        type="text"
                        value={localSettings.hoursLine2 || ''}
                        onChange={(e) => handleFieldChange('hoursLine2', e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identifiants Légaux / Renseignements</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Numéro RCCM</label>
                  <input
                    type="text"
                    value={localSettings.rccm || ''}
                    onChange={(e) => handleFieldChange('rccm', e.target.value)}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Numéro NIF</label>
                  <input
                    type="text"
                    value={localSettings.nif || ''}
                    onChange={(e) => handleFieldChange('nif', e.target.value)}
                    className="mt-1 w-full text-xs p-2 border border-slate-200 rounded-xl focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-xs text-slate-500 py-4">
            Ce type de bloc ne possède pas de paramètres modifiables configurés.
          </div>
        );
    }
  };

  if (inline) {
    return (
      <div className="space-y-4 text-[#0f172a] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h4 className="font-serif text-sm font-bold text-[#002366]">
              Propriétés : {block.type}
            </h4>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">
              ID: {block.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-blue-800 hover:text-blue-950 cursor-pointer"
          >
            ← Retour
          </button>
        </div>
        {/* Form Fields */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {renderFormFields()}
        </div>
        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-[11px] cursor-pointer transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-[11px] cursor-pointer shadow-sm transition-all"
          >
            Enregistrer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-[#FAF9F5] rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-[#E5DFD0] animate-scaleUp text-[#0f172a]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5DFD0] bg-[#C5A85C] text-white">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold">
              Éditeur de Section : {block.type}
            </h3>
            <p className="text-[10px] text-white/90 font-semibold uppercase tracking-wider mt-0.5">
              Configuration de contenu en direct (Wordpress Style)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-100 font-bold p-1 cursor-pointer transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {renderFormFields()}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E5DFD0] bg-[#FAF9F5] flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#D6CFBC] hover:bg-[#EBE7DF]/30 text-[#6e5d3d] font-bold text-xs cursor-pointer transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#C5A85C] hover:bg-[#B5933A] text-white font-bold text-xs cursor-pointer shadow-md transition-all"
          >
            Valider les modifications
          </button>
        </div>

      </div>
    </div>
  );
};
