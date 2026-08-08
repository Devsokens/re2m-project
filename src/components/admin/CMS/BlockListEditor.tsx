import React from 'react';
import { CMSBlock } from '../../../types/cms';
import { Edit, Eye, EyeOff, ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';

interface BlockListEditorProps {
  blocks: CMSBlock[];
  onUpdateBlocks: (updated: CMSBlock[]) => void;
  onEditBlock: (block: CMSBlock) => void;
}

export const BlockListEditor: React.FC<BlockListEditorProps> = ({
  blocks,
  onUpdateBlocks,
  onEditBlock
}) => {
  const handleToggleEnable = (blockId: string) => {
    const updated = blocks.map((b) =>
      b.id === blockId ? { ...b, enabled: !b.enabled } : b
    );
    onUpdateBlocks(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    
    // Re-index orders
    const reordered = updated.map((b, idx) => ({ ...b, order: idx }));
    onUpdateBlocks(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    
    // Re-index orders
    const reordered = updated.map((b, idx) => ({ ...b, order: idx }));
    onUpdateBlocks(reordered);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette section ? Cette action est irréversible et supprimera tout le contenu saisi.")) {
      const updated = blocks.filter((b) => b.id !== blockId);
      // Re-index orders
      const reordered = updated.map((b, idx) => ({ ...b, order: idx }));
      onUpdateBlocks(reordered);
    }
  };

  const handleAddBlock = (type: string) => {
    const defaultSettings: Record<string, any> = {
      'Hero': {
        slides: [
          {
            title: "Nouveau titre de diapositive",
            subtitle: "Sous-titre",
            text: "Description de la diapositive...",
            image: "/slide_01.jpg",
            cta: "Découvrir",
            targetView: "nos-services"
          }
        ]
      },
      'CounterStats': {
        stats: [
          { value: '10', label: 'Nouvel indicateur' }
        ]
      },
      'ServicesList': {
        items: [
          {
            title: "Nouveau Service",
            desc: "Description du service...",
            image: "/single_service_01.jpg",
            iconName: "ClipboardList",
            details: ["Détail du service 1"]
          }
        ]
      },
      'Collaborations': {
        title: "Nos Partenaires",
        description: "Ils nous font confiance",
        items: [
          { name: "Nouveau Partenaire", label: "Secteur", logo: "" }
        ]
      },
      'Testimonials': {
        title: "Témoignages",
        description: "Ce que disent nos clients",
        items: [
          { company: "Entreprise", service: "Service", text: "Témoignage", logo: "" }
        ]
      },
      'FounderSection': {
        title: "Notre valeur ajoutée",
        subtitle: "Qui sommes-nous ?",
        quote: "Devise du cabinet",
        paragraphs: ["Paragraphe 1"],
        image: "/team_01.jpg"
      },
      'HeaderBanner': {
        badge: "Nouveau Badge",
        title: "Nouveau Titre de Page",
        description: "Description de la page...",
        backgroundImage: "/qui_nous_sommes_bg.jpg"
      },
      'PresentationGrid': {
        title: "Nos Engagements",
        desc1: "Paragraphe 1",
        desc2: "Paragraphe 2",
        commitmentsTitle: "Engagements",
        commitments: [
          { title: "Engagement 1", desc: "Description..." }
        ]
      },
      'DirectorMessage': {
        title: "Mot du Directeur",
        subtitle: "Message de bienvenue",
        paragraphs: ["Paragraphe 1"],
        directorName: "Nom",
        directorTitle: "Titre",
        image: "/team_01.jpg"
      }
    };

    const newBlock: CMSBlock = {
      id: `${type.toLowerCase()}_${Date.now()}`,
      type: type as any,
      order: blocks.length,
      enabled: true,
      settings: defaultSettings[type] || {}
    };

    onUpdateBlocks([...blocks, newBlock]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-extrabold text-[#002366] uppercase tracking-wider">
          Structure des Blocs
        </h4>
        <span className="text-[10px] text-slate-400 font-semibold">
          Ajoutez, réorganisez ou masquez vos sections
        </span>
      </div>

      {/* Add Block Form */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <label className="text-[10px] font-bold text-[#6e5d3d] uppercase shrink-0">Ajouter une Section :</label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleAddBlock(e.target.value);
              e.target.value = '';
            }
          }}
          className="text-xs p-2 border border-[#D6CFBC] rounded-xl bg-white focus:outline-none focus:border-[#C5A85C] focus:ring-1 focus:ring-[#C5A85C] w-full sm:max-w-[220px]"
        >
          <option value="">-- Choisir le type --</option>
          <option value="Hero">Hero (Carrousel)</option>
          <option value="CounterStats">CounterStats (Chiffres)</option>
          <option value="ServicesList">ServicesList (Services)</option>
          <option value="Collaborations">Collaborations (Partenaires)</option>
          <option value="Testimonials">Testimonials (Témoignages)</option>
          <option value="FounderSection">FounderSection (Fondateur)</option>
          <option value="HeaderBanner">HeaderBanner (Bannière Entête)</option>
          <option value="PresentationGrid">PresentationGrid (Engagements)</option>
          <option value="DirectorMessage">DirectorMessage (Message Directeur)</option>
        </select>
      </div>

      <div className="space-y-3">
        {blocks.map((block, idx) => (
          <div
            key={block.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white ${
              block.enabled 
                ? 'border-slate-200 shadow-sm' 
                : 'border-slate-100 bg-slate-50/50 opacity-70'
            }`}
          >
            {/* Block Description */}
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center font-serif text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <div>
                <h5 className="font-serif text-sm font-bold text-[#002366]">
                  {block.type}
                </h5>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  ID: {block.id}
                </p>
              </div>
            </div>

            {/* Block Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
              {/* Move Buttons */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="p-2 hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="Déplacer vers le haut"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-slate-200" />
                <button
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === blocks.length - 1}
                  className="p-2 hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="Déplacer vers le bas"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggle Enable Button */}
              <button
                onClick={() => handleToggleEnable(block.id)}
                className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  block.enabled
                    ? 'border-green-100 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title={block.enabled ? "Masquer la section" : "Afficher la section"}
              >
                {block.enabled ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Actif</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Masqué</span>
                  </>
                )}
              </button>

              {/* Edit Button */}
              <button
                onClick={() => onEditBlock(block)}
                className="p-2 rounded-xl border border-blue-100 bg-blue-50 text-blue-800 hover:bg-blue-100 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Modifier le contenu du bloc"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteBlock(block.id)}
                className="p-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center justify-center cursor-pointer transition-all"
                title="Supprimer la section"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-[#D6CFBC] rounded-3xl text-slate-400 text-xs bg-white/50">
            Aucune section configurée pour cette page. Utilisez le sélecteur ci-dessus pour en ajouter une.
          </div>
        )}
      </div>
    </div>
  );
};
export default BlockListEditor;
