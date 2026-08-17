import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Member } from '../../types/member';
import { MemberCardPublic } from './MemberCardPublic';

interface MemberViewModalProps {
  member: Member | null;
  onClose: () => void;
}

export const MemberViewModal: React.FC<MemberViewModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:max-w-2xl animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:-top-3 sm:-right-3 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
        <div className="sm:max-h-[90vh] overflow-y-auto sm:rounded-3xl bg-slate-50">
          <MemberCardPublic member={member} compact />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MemberViewModal;
