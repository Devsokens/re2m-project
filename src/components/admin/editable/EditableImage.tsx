import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { useIsEditMode } from '../../../contexts/EditModeContext';

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (src: string) => void | Promise<void>;
  className?: string;
  /** Sizing/positioning for the wrapper — override when the image must fill an
   * absolutely-positioned parent (e.g. a full-bleed hero background). */
  containerClassName?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onSave,
  className = '',
  containerClassName
}) => {
  const isEditMode = useIsEditMode();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isEditMode) {
    if (containerClassName) {
      return (
        <div className={containerClassName}>
          <img src={src} alt={alt} className={className} />
        </div>
      );
    }
    return <img src={src} alt={alt} className={className} />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await onSave(reader.result as string);
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => setIsUploading(false);
    reader.readAsDataURL(file);
  };

  return (
    <div className={containerClassName || 'relative group/field w-full'}>
      <label className="relative cursor-pointer w-full h-full block" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <img src={src} alt={alt} className={className} />
        <div className="absolute inset-0 rounded-[inherit] bg-black/0 group-hover/field:bg-black/60 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover/field:opacity-100 transition-opacity text-white text-xs font-bold flex items-center gap-2">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-4 h-4" /> Changer l'image
              </>
            )}
          </span>
        </div>
      </label>
    </div>
  );
};

export default EditableImage;
