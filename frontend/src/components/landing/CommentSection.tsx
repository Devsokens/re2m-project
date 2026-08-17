import React, { useEffect, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { EngagementComment, EngagementTargetType, addComment, getComments } from '../../utils/engagementStore';
import { getInitials } from '../../utils/text';

interface CommentSectionProps {
  targetType: EngagementTargetType;
  targetId: string;
  hideForm?: boolean;
}

const formatRelative = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const CommentSection: React.FC<CommentSectionProps> = ({ targetType, targetId, hideForm = false }) => {
  const [comments, setComments] = useState<EngagementComment[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    getComments(targetType, targetId)
      .then(setComments)
      .catch((err) => console.error('Impossible de charger les commentaires :', err));
  }, [targetType, targetId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    addComment(targetType, targetId, author.trim(), text.trim())
      .then((comment) => {
        setComments((prev) => [...prev, comment]);
        setText('');
      })
      .catch((err) => console.error('Échec de l\'envoi du commentaire :', err));
  };

  return (
    <div className="pt-10 mt-10 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-4 h-4 text-[#002366]" />
        <h3 className="font-serif text-sm font-bold text-[#002366]">
          {comments.length} commentaire{comments.length !== 1 ? 's' : ''}
        </h3>
      </div>

      {!hideForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mb-8">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Votre nom"
            required
            className="w-full bg-white text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:outline-none"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Partagez votre avis sur cet article..."
            required
            rows={3}
            className="w-full bg-white text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:outline-none resize-y"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Publier
            </button>
          </div>
        </form>
      )}

      {comments.length > 0 ? (
        <div className="space-y-3">
          {[...comments].reverse().map((c) => {
            const initials = getInitials(c.author);
            return (
              <div key={c.id} className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-[#002366]">{initials || 'A'}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="bg-slate-100 rounded-2xl px-3.5 py-2.5 inline-block max-w-full">
                    <p className="text-xs font-bold text-[#0f172a]">{c.author || 'Anonyme'}</p>
                    <p className="text-xs text-slate-800 leading-relaxed mt-0.5 break-words">{c.text}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 ml-3.5">{formatRelative(c.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-4">Soyez le premier à commenter cet article.</p>
      )}
    </div>
  );
};

export default CommentSection;
