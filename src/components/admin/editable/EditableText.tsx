import React, { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useIsEditMode } from '../../../contexts/EditModeContext';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void | Promise<void>;
  multiline?: boolean;
  label?: string;
  as?: React.ElementType;
  className?: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const SAVE_DEBOUNCE_MS = 900;
const SAVED_BADGE_MS = 1800;

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  multiline,
  label,
  as: Tag = 'div',
  className = ''
}) => {
  const isEditMode = useIsEditMode();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const debounceRef = useRef<number | null>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); }, []);

  if (!isEditMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((o) => !o);
  };

  const scheduleSave = (next: string) => {
    setDraft(next);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setStatus('saving');
      try {
        await onSave(next);
        setStatus('saved');
        window.setTimeout(() => setStatus((s) => (s === 'saved' ? 'idle' : s)), SAVED_BADGE_MS);
      } catch {
        setStatus('error');
      }
    }, SAVE_DEBOUNCE_MS);
  };

  return (
    <div className="relative group/field">
      <Tag
        onClick={toggleOpen}
        className={`${className} cursor-pointer rounded-md outline-dashed outline-1 outline-offset-4 outline-transparent group-hover/field:outline-[#002366]/50 transition-all`}
      >
        {value}
      </Tag>

      <button
        onClick={toggleOpen}
        className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#002366] text-white flex items-center justify-center shadow opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer z-20"
        aria-label={label ? `Modifier : ${label}` : 'Modifier'}
      >
        <Pencil className="w-2.5 h-2.5" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 space-y-2 animate-scaleUp"
        >
          {label && <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</p>}

          {multiline ? (
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => scheduleSave(e.target.value)}
              rows={4}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:border-[#002366] focus:outline-none resize-y text-[#0f172a]"
            />
          ) : (
            <input
              autoFocus
              value={draft}
              onChange={(e) => scheduleSave(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:border-[#002366] focus:outline-none text-[#0f172a]"
            />
          )}

          <div className="flex items-center justify-between pt-1">
            <span
              className={`text-[10px] font-bold transition-opacity ${status === 'idle' ? 'opacity-0' : 'opacity-100'} ${
                status === 'error' ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {status === 'saving' && 'Enregistrement...'}
              {status === 'saved' && 'Enregistré'}
              {status === 'error' && 'Erreur'}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold text-[#002366] hover:text-blue-900 px-2 py-1 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableText;
