import React from 'react';
import { CMSBlock } from '../../../types/cms';
import { Edit, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-extrabold text-[#002366] uppercase tracking-wider">
          Structure des Blocs de la Page
        </h4>
        <span className="text-[10px] text-slate-400 font-semibold">
          Configurez l'ordre et l'activation des sections
        </span>
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
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Move Buttons */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden mr-2">
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
            </div>

          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs">
            Aucun bloc configuré pour cette page.
          </div>
        )}
      </div>
    </div>
  );
};
