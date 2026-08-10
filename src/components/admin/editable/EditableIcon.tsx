import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useIsEditMode } from '../../../contexts/EditModeContext';
import { iconMap, getIcon } from './iconMap';

interface EditableIconProps {
  value: string | undefined;
  onSave: (iconName: string) => void | Promise<void>;
  className?: string;
  iconClassName?: string;
}

export const EditableIcon: React.FC<EditableIconProps> = ({ value, onSave, className = '', iconClassName = 'w-5 h-5' }) => {
  const isEditMode = useIsEditMode();
  const [isOpen, setIsOpen] = useState(false);
  const Icon = getIcon(value);

  if (!isEditMode) {
    return (
      <div className={className}>
        <Icon className={iconClassName} />
      </div>
    );
  }

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((o) => !o);
  };

  return (
    <div className="relative group/field inline-block">
      <div
        onClick={toggleOpen}
        className={`${className} cursor-pointer outline-dashed outline-1 outline-offset-4 outline-transparent group-hover/field:outline-[#002366]/50 transition-all`}
      >
        <Icon className={iconClassName} />
      </div>

      <button
        onClick={toggleOpen}
        className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#002366] text-white flex items-center justify-center shadow opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer z-20"
        aria-label="Changer l'icône"
      >
        <Pencil className="w-2.5 h-2.5" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 space-y-2 animate-scaleUp"
        >
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Choisir une icône</p>
          <div className="grid grid-cols-5 gap-1.5">
            {Object.entries(iconMap).map(([name, IconOption]) => (
              <button
                key={name}
                onClick={async () => {
                  await onSave(name);
                  setIsOpen(false);
                }}
                title={name}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                  value === name
                    ? 'bg-[#002366] border-[#002366] text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-[#002366] hover:text-[#002366]'
                }`}
              >
                <IconOption className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableIcon;
