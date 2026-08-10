import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { useIsEditMode } from '../../../contexts/EditModeContext';

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (src: string) => void | Promise<void>;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({ src, alt, onSave, className = '' }) => {
  const isEditMode = useIsEditMode();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(src);

  if (!isEditMode) {
    return <img src={src} alt={alt} className={className} />;
  }

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(src);
    setIsOpen((o) => !o);
  };

  return (
    <div className="relative group/field w-full">
      <div onClick={toggleOpen} className="relative cursor-pointer">
        <img src={src} alt={alt} className={className} />
        <div className="absolute inset-0 rounded-[inherit] bg-black/0 group-hover/field:bg-black/60 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover/field:opacity-100 transition-opacity text-white text-xs font-bold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Changer l'image
          </span>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 top-3 right-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 space-y-2 animate-scaleUp"
        >
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">URL de l'image</p>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="/mon-image.jpg"
            className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:border-[#002366] focus:outline-none text-[#0f172a]"
          />
          {draft && <img src={draft} alt="Aperçu" className="w-full h-24 object-cover rounded-lg border border-slate-100" />}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-700 px-2 py-1.5 cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={async () => {
                await onSave(draft);
                setIsOpen(false);
              }}
              className="text-[10px] font-bold text-white bg-[#002366] hover:bg-blue-900 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableImage;
