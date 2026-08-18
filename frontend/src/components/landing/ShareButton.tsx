import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Link2, Check, Facebook, Linkedin, MessageCircle, Mail } from 'lucide-react';
import { EngagementTargetType, recordShare } from '../../utils/engagementStore';

interface ShareButtonProps {
  targetType: EngagementTargetType;
  targetId: string;
  title: string;
  size?: 'sm' | 'md';
  className?: string;
}

const buildShareUrl = (targetType: EngagementTargetType, targetId: string) => {
  const base = `${window.location.origin}/${targetType === 'news' ? 'actualites' : 'blog'}`;
  return `${base}#${targetId}`;
};

const MENU_WIDTH = 208;

export const ShareButton: React.FC<ShareButtonProps> = ({ targetType, targetId, title, size = 'sm', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const handleReposition = () => setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen]);

  const track = () => recordShare(targetType, targetId).catch(() => {});

  const url = buildShareUrl(targetType, targetId);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const left = Math.min(Math.max(rect.right - MENU_WIDTH, 8), window.innerWidth - MENU_WIDTH - 8);
      setMenuPosition({ top: rect.top - 8, left });
    }
    setIsOpen(true);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      track();
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1200);
    });
  };

  const openShareTarget = (e: React.MouseEvent, shareUrl: string) => {
    e.stopPropagation();
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
    track();
    setIsOpen(false);
  };

  const isSmall = size === 'sm';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className={`inline-flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-[#002366] transition-colors ${className}`}
        title="Partager"
      >
        <Share2 className={isSmall ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
      </button>

      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            style={{ top: menuPosition.top, left: menuPosition.left, width: MENU_WIDTH, transform: 'translateY(-100%)' }}
            className="fixed bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-[100] animate-scaleUp"
          >
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4 text-slate-400" />}
              {copied ? 'Lien copié !' : 'Copier le lien'}
            </button>
            <button
              onClick={(e) => openShareTarget(e, `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              WhatsApp
            </button>
            <button
              onClick={(e) => openShareTarget(e, `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </button>
            <button
              onClick={(e) => openShareTarget(e, `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Linkedin className="w-4 h-4 text-blue-700" />
              LinkedIn
            </button>
            <button
              onClick={(e) => openShareTarget(e, `mailto:?subject=${encodedTitle}&body=${encodedUrl}`)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              Email
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

export default ShareButton;
