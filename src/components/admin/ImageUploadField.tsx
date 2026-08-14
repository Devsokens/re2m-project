import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2, X } from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (dataUrlOrPath: string) => void;
  label?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ value, onChange, label }) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => setIsUploading(false);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <p className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</p>}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
          <img src={value} alt="Aperçu" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white text-[#002366] text-[11px] font-bold cursor-pointer flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Changer
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="w-7 h-7 rounded-lg bg-white text-rose-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl py-8 text-slate-400 hover:bg-slate-100 hover:text-slate-500 cursor-pointer transition-colors"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
          <span className="text-xs font-semibold">Cliquez pour choisir une image</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
};

export default ImageUploadField;
