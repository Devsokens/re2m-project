import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft, Globe, Smile, Send, UserCircle2, MessageCircle } from 'lucide-react';
import { LikeButton } from './LikeButton';
import { ShareButton } from './ShareButton';
import { CommentSection } from './CommentSection';
import { addComment, getComments, EngagementTargetType } from '../../utils/engagementStore';
import { stripHtml, getInitials } from '../../utils/text';

const VISITOR_NAME_KEY = 're2m_visitor_name';
const VISITOR_NAME_SET_KEY = 're2m_visitor_name_set';

const QUICK_EMOJIS = ['😀', '😂', '😍', '👏', '🙏', '👍', '🔥', '❤️', '🎉', '😢', '😮', '🤔', '💯', '🙌', '✨', '😅', '😎', '👌'];

export interface PostModalItem {
  id: string;
  targetType: EngagementTargetType;
  author: string;
  authorIcon: React.ElementType;
  date: string; // ISO
  text: string; // HTML
  image: string;
  tag?: string;
}

interface PostModalProps {
  item: PostModalItem | null;
  otherItems: PostModalItem[];
  mode: 'actualite' | 'blog';
  onClose: () => void;
  onSelectItem: (item: PostModalItem) => void;
  onCommentPosted?: () => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const PostModal: React.FC<PostModalProps> = ({ item, otherItems, mode, onClose, onSelectItem, onCommentPosted }) => {
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem(VISITOR_NAME_KEY) || '');
  const [hasChosenName, setHasChosenName] = useState(() => localStorage.getItem(VISITOR_NAME_SET_KEY) === '1');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [commentText, setCommentText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCommentText('');
  }, [item?.id]);

  useEffect(() => {
    if (!item || mode !== 'blog') return;
    getComments(item.targetType, item.id)
      .then((comments) => setCommentCount(comments.length))
      .catch((err) => console.error('Impossible de charger les commentaires :', err));
  }, [item, mode, refreshKey]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  if (!item) return null;
  const AuthorIcon = item.authorIcon;
  const initials = getInitials(visitorName);

  const finalizeSend = (name: string) => {
    if (!commentText.trim()) return;
    addComment(item.targetType, item.id, name.trim() || 'Anonyme', commentText.trim())
      .then(() => {
        setCommentText('');
        setRefreshKey((k) => k + 1);
        onCommentPosted?.();
      })
      .catch((err) => console.error('Échec de l\'envoi du commentaire :', err));
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    if (!hasChosenName) {
      setNameInput(visitorName);
      setIsEditingName(true);
      return;
    }
    finalizeSend(visitorName);
  };

  const handleConfirmName = () => {
    const trimmed = nameInput.trim();
    localStorage.setItem(VISITOR_NAME_KEY, trimmed);
    localStorage.setItem(VISITOR_NAME_SET_KEY, '1');
    setVisitorName(trimmed);
    setHasChosenName(true);
    setIsEditingName(false);
    finalizeSend(trimmed);
  };

  const handleEditName = () => {
    setNameInput(visitorName);
    setIsEditingName(true);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-stretch sm:items-center justify-center sm:p-4 bg-slate-900/50 sm:backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-[#0f172a] w-full h-full sm:h-auto sm:max-h-[88vh] sm:max-w-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 sm:px-5 py-3.5 border-b border-slate-200 shrink-0">
          <button onClick={onClose} className="sm:hidden text-slate-600 cursor-pointer p-1.5 -ml-1 shrink-0" aria-label="Retour">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="flex-1 text-center sm:text-left font-bold text-sm text-[#0f172a] truncate">
            Publication de {item.author}
          </h3>
          <button onClick={onClose} className="hidden sm:flex text-slate-400 hover:text-slate-600 cursor-pointer p-1 shrink-0" aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-5 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <AuthorIcon className="w-5 h-5 text-[#002366]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0f172a] truncate">{item.author}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  {formatDate(item.date)} <Globe className="w-3 h-3" />
                </p>
              </div>
            </div>
            <div
              className="text-sm text-slate-700 leading-relaxed [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          </div>

          {item.image && (
            <div className="w-full bg-slate-100 border-y border-slate-100">
              <img src={item.image} alt={item.author} className="w-full max-h-[420px] object-contain" />
            </div>
          )}

          <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-4">
              <LikeButton targetType={item.targetType} targetId={item.id} size="md" />
              <ShareButton targetType={item.targetType} targetId={item.id} title={stripHtml(item.text).slice(0, 80)} size="md" />
              {mode === 'blog' && (
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                  <MessageCircle className="w-4 h-4" /> {commentCount}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">{formatDate(item.date)}</span>
          </div>

          {mode === 'blog' && (
            <div className="px-4 sm:px-5">
              <CommentSection key={`${item.id}-${refreshKey}`} targetType={item.targetType} targetId={item.id} hideForm />
            </div>
          )}

          {otherItems.length > 0 && (
            <div className="px-4 sm:px-5 py-5 border-t border-slate-100 mt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                {mode === 'blog' ? 'Autres articles' : 'Autres actualités'}
              </p>
              <div className="space-y-3 pb-2">
                {otherItems.map((other) => (
                  <button
                    key={other.id}
                    onClick={() => onSelectItem(other)}
                    className="w-full flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={other.image} alt={other.author} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#002366] leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {stripHtml(other.text).slice(0, 90)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(other.date)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed comment composer - stays put while the body above scrolls */}
        {mode === 'blog' && (
          <div className="border-t border-slate-200 bg-white px-3 sm:px-5 py-3 shrink-0">
            {isEditingName && (
              <div className="mb-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-2">
                <p className="text-[11px] font-bold text-[#002366]">Quel est votre nom ?</p>
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmName();
                    }}
                    placeholder="Votre nom (facultatif)"
                    className="flex-1 min-w-0 bg-white text-xs rounded-full px-3 py-2 border border-slate-200 focus:border-[#002366] focus:outline-none"
                  />
                  <button
                    onClick={handleConfirmName}
                    className="px-3.5 py-2 rounded-full bg-[#002366] hover:bg-blue-900 text-white text-[11px] font-bold cursor-pointer shrink-0 transition-colors"
                  >
                    Publier
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Laissez vide pour commenter en tant qu'Anonyme.</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                {initials ? (
                  <span className="text-[11px] font-bold text-[#002366]">{initials}</span>
                ) : (
                  <UserCircle2 className="w-5 h-5 text-[#002366]" />
                )}
              </div>
              <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-full px-3 py-2 min-w-0">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendComment();
                  }}
                  placeholder="Écrire un commentaire..."
                  className="flex-1 min-w-0 bg-transparent text-xs text-[#0f172a] focus:outline-none"
                />
                <div className="relative shrink-0" ref={emojiPickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((v) => !v)}
                    className="text-slate-400 hover:text-[#002366] cursor-pointer"
                    aria-label="Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-8 right-0 bg-white border border-slate-200 rounded-xl shadow-xl p-2 grid grid-cols-6 gap-0.5 w-48 z-10">
                      {QUICK_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setCommentText((t) => t + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-base hover:bg-slate-100 rounded-md p-1 cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleSendComment}
                disabled={!commentText.trim()}
                className="w-8 h-8 rounded-full bg-[#002366] hover:bg-blue-900 flex items-center justify-center text-white shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {hasChosenName && !isEditingName && (
              <p className="text-[10px] text-slate-400 mt-1.5 ml-10">
                Vous commentez en tant que <span className="font-semibold text-slate-500">{visitorName || 'Anonyme'}</span> ·{' '}
                <button onClick={handleEditName} className="font-bold text-[#002366] hover:underline cursor-pointer">
                  Modifier
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PostModal;
