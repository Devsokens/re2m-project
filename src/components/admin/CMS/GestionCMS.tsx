import React, { useState, useEffect } from 'react';
import { PageSlug, CMSBlock } from '../../../types/cms';
import { cmsStorage } from '../../../utils/cmsStorage';
import { BlockFormModal } from './BlockFormModal';
import { BlockListEditor } from './BlockListEditor';
import { AccueilView } from '../../landing/AccueilView';
import { QuiNousSommesView } from '../../landing/QuiNousSommesView';
import { NosServicesView } from '../../landing/NosServicesView';
import { ContactView } from '../../landing/ContactView';
import { Globe, RefreshCw, Check, ListOrdered } from 'lucide-react';

interface GestionCMSProps {
  onTogglePreview: (slug: PageSlug, blocks: CMSBlock[] | null) => void;
  activePreviewSlug: PageSlug | null;
}

export const GestionCMS: React.FC<GestionCMSProps> = ({
  onTogglePreview,
  activePreviewSlug
}) => {
  const [selectedPage, setSelectedPage] = useState<PageSlug>('accueil');
  const [draftBlocks, setDraftBlocks] = useState<CMSBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<CMSBlock | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showPublishAlert, setShowPublishAlert] = useState(false);

  // Load layout on page change
  useEffect(() => {
    const blocks = cmsStorage.getDraftLayout(selectedPage);
    setDraftBlocks(blocks);
  }, [selectedPage]);

  // Handle re-ordering or toggling of blocks
  const handleUpdateBlocks = (updated: CMSBlock[]) => {
    setDraftBlocks(updated);
    cmsStorage.saveDraftLayout(selectedPage, updated);
    
    // Update live preview in real-time
    if (activePreviewSlug === selectedPage) {
      onTogglePreview(selectedPage, updated);
    }
  };

  const handleEditBlock = (block: CMSBlock) => {
    setEditingBlock(block);
    setIsFormOpen(true);
  };

  const handleSaveBlockSettings = (updatedBlock: CMSBlock) => {
    const updated = draftBlocks.map((b) =>
      b.id === updatedBlock.id ? updatedBlock : b
    );
    handleUpdateBlocks(updated);
    
    // Show success banner
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 2000);
    setIsFormOpen(false);
    setEditingBlock(null);
  };

  const handlePublish = () => {
    cmsStorage.publishLayout(selectedPage);
    
    // Deactivate preview if it was on
    onTogglePreview(selectedPage, null);
    
    // Show success banner
    setShowPublishAlert(true);
    setTimeout(() => setShowPublishAlert(false), 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser cette page aux valeurs par défaut d'usine ? Toutes vos modifications non publiées et publiées seront écrasées.")) {
      const defaults = cmsStorage.resetToDefault(selectedPage);
      setDraftBlocks(defaults);
      onTogglePreview(selectedPage, null);
      setEditingBlock(null);
      setIsFormOpen(false);
    }
  };

  // Click handler from preview page sections
  const handleSelectBlockFromPreview = (blockId: string) => {
    const block = draftBlocks.find(b => b.id === blockId);
    if (block) {
      handleEditBlock(block);
    }
  };

  return (
    <div className="space-y-6 text-[#0f172a] bg-[#FAF9F5] p-6 sm:p-10 rounded-3xl border border-[#E5DFD0] shadow-sm relative animate-fadeIn">
      
      {/* WordPress-style Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD0] pb-6">
        <div className="space-y-1">
          <h2 className="font-serif text-3xl font-extrabold text-[#002366] leading-tight">
            Éditeur visuel
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Cliquez directement sur un texte, une image ou une icône ci-dessous pour le modifier.
          </p>
        </div>
        
        {/* Top Control Links */}
        <div className="flex items-center gap-6">
          {/* Section structure view (Wordpress Outline style) */}
          <button
            onClick={() => setShowStructureModal(true)}
            className="text-xs font-bold text-[#6e5d3d] hover:text-[#002366] tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ListOrdered className="w-4.5 h-4.5 shrink-0 text-[#C5A85C]" />
            <span>Organiser les Sections</span>
          </button>

          {/* Toggle Live Preview Link */}
          <button
            onClick={() => {
              if (activePreviewSlug === selectedPage) {
                onTogglePreview(selectedPage, null);
              } else {
                onTogglePreview(selectedPage, draftBlocks);
              }
            }}
            className="text-xs font-bold text-[#C5A85C] hover:text-[#B5933A] tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-4.5 h-4.5 shrink-0" />
            <span>
              {activePreviewSlug === selectedPage ? "Désactiver la prévisualisation" : "Voir cette page en ligne ↗"}
            </span>
          </button>
        </div>
      </div>

      {/* WordPress-style Page Selection Tab Bar (Pill Box) */}
      <div className="flex justify-center sm:justify-start">
        <div className="inline-flex gap-2 bg-[#EBE7DF]/60 p-1.5 rounded-2xl border border-[#D6CFBC]/60 shadow-inner">
          <button
            onClick={() => {
              setSelectedPage('accueil');
              setIsFormOpen(false);
              setEditingBlock(null);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedPage === 'accueil'
                ? 'bg-[#C5A85C] text-white shadow-md'
                : 'text-[#6e5d3d] hover:text-[#002366] hover:bg-slate-200/40'
            }`}
          >
            Accueil
          </button>
          
          <button
            onClick={() => {
              setSelectedPage('qui-nous-sommes');
              setIsFormOpen(false);
              setEditingBlock(null);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedPage === 'qui-nous-sommes'
                ? 'bg-[#C5A85C] text-white shadow-md'
                : 'text-[#6e5d3d] hover:text-[#002366] hover:bg-slate-200/40'
            }`}
          >
            Qui Nous Sommes
          </button>

          <button
            onClick={() => {
              setSelectedPage('nos-services');
              setIsFormOpen(false);
              setEditingBlock(null);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedPage === 'nos-services'
                ? 'bg-[#C5A85C] text-white shadow-md'
                : 'text-[#6e5d3d] hover:text-[#002366] hover:bg-slate-200/40'
            }`}
          >
            Nos Services
          </button>

          <button
            onClick={() => {
              setSelectedPage('contact');
              setIsFormOpen(false);
              setEditingBlock(null);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedPage === 'contact'
                ? 'bg-[#C5A85C] text-white shadow-md'
                : 'text-[#6e5d3d] hover:text-[#002366] hover:bg-slate-200/40'
            }`}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Alerts */}
      {showSaveAlert && (
        <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fadeIn shadow-sm">
          <Check className="w-4 h-4 shrink-0" />
          <span>Modifications du bloc enregistrées avec succès !</span>
        </div>
      )}

      {showPublishAlert && (
        <div className="p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fadeIn shadow-sm">
          <Globe className="w-4 h-4 shrink-0" />
          <span>La page a été publiée avec succès en ligne ! Les modifications sont visibles pour tous.</span>
        </div>
      )}

      {/* Full-Width Website Reproduction Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden relative min-h-[600px] w-full">
        {selectedPage === 'accueil' && (
          <AccueilView
            blocks={draftBlocks}
            onSelectBlock={handleSelectBlockFromPreview}
            onStartDemo={() => {}}
            onNavigate={() => {}}
          />
        )}

        {selectedPage === 'qui-nous-sommes' && (
          <QuiNousSommesView
            blocks={draftBlocks}
            onSelectBlock={handleSelectBlockFromPreview}
          />
        )}

         {selectedPage === 'nos-services' && (
          <NosServicesView
            blocks={draftBlocks}
            onSelectBlock={handleSelectBlockFromPreview}
          />
        )}

        {selectedPage === 'contact' && (
          <ContactView
            blocks={draftBlocks}
            onSelectBlock={handleSelectBlockFromPreview}
          />
        )}
      </div>

      {/* WordPress-style Floating Balloon Popover Editor */}
      {isFormOpen && editingBlock && (
        <BlockFormModal
          block={editingBlock}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBlock(null);
          }}
          onSave={handleSaveBlockSettings}
          onChange={(updatedBlock) => {
            // Instant Real-Time Preview Update on typing
            const updated = draftBlocks.map((b) =>
              b.id === updatedBlock.id ? updatedBlock : b
            );
            setDraftBlocks(updated);
            cmsStorage.saveDraftLayout(selectedPage, updated);
            if (activePreviewSlug === selectedPage) {
              onTogglePreview(selectedPage, updated);
            }
          }}
          inline={false}
        />
      )}

      {/* Floating Outline Structure Modal */}
      {showStructureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-slate-200 shadow-2xl relative space-y-4 animate-scaleUp text-[#0f172a]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-serif text-base font-bold text-[#002366] flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-[#C5A85C]" />
                <span>Structure des Sections</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowStructureModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            {/* Scrollable Outline Body */}
            <div className="max-h-[50vh] overflow-y-auto pr-1">
              <BlockListEditor
                blocks={draftBlocks}
                onUpdateBlocks={handleUpdateBlocks}
                onEditBlock={(block) => {
                  setShowStructureModal(false);
                  handleEditBlock(block);
                }}
              />
            </div>
            
            {/* Modal Footer */}
            <div className="text-right pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowStructureModal(false)}
                className="bg-[#002366] hover:bg-blue-900 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* WordPress-style Control Bar at the bottom */}
      <div className="bg-white border border-slate-250/80 p-4.5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <button
          onClick={handleResetToDefault}
          className="px-5 py-2.5 rounded-xl border border-rose-250 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all w-full sm:w-auto"
          title="Restaurer le contenu d'origine"
        >
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
          <span>Réinitialiser la Page</span>
        </button>

        <button
          onClick={handlePublish}
          className="px-6 py-3 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all w-full sm:w-auto"
          title="Publier les modifications en ligne"
        >
          <Globe className="w-4 h-4 text-sky-300" />
          <span>Publier les Modifications en Ligne</span>
        </button>
      </div>

    </div>
  );
};
export default GestionCMS;
