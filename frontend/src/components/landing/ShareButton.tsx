import React, { useEffect, useRef, useState } from 'react';
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

export const ShareButton: React.FC<ShareButtonProps> = ({ targetType, targetId, title, size = 'sm', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const track = () => recordShare(targetType, targetId).catch(() => {});

  const url = buildShareUrl(targetType, targetId);

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
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
        className={`inline-flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-[#002366] transition-colors ${className}`}
        title="Partager"
      >
        <Share2 className={isSmall ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-52 z-20 animate-scaleUp"
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
        </div>
      )}
    </div>
  );
};

export default ShareButton;
