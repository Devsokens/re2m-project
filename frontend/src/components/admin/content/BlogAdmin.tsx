import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FileText, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { RichTextEditor } from '../RichTextEditor';
import { ImageUploadField } from '../ImageUploadField';
import { Article, ArticleInput, articlesStore } from '../../../data/articles';
import { EngagementComment, EngagementSummary, getComments, getEngagementSummary, replyToComment } from '../../../utils/engagementStore';
import { PageLoader } from '../../layout/PageLoader';

const emptyDraft: ArticleInput = {
  title: '',
  excerpt: '',
  content: '',
  author: 'Cabinet RE2M',
  date: new Date().toISOString().slice(0, 10),
  image: '/service_01.jpg',
  category: '',
  tags: []
};

const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const BlogAdmin: React.FC = () => {
  const [items, setItems] = useState<Article[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ArticleInput>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<EngagementSummary>({ likes: {}, comments: {}, shares: {} });

  const [commentsArticle, setCommentsArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<EngagementComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replySaving, setReplySaving] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([articlesStore.list().then(setItems), getEngagementSummary('article').then(setSummary)])
      .catch((err) => console.error('Impossible de charger les articles :', err))
      .finally(() => setIsLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setIsOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditingId(article.id);
    setDraft(article);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    articlesStore
      .remove(id)
      .then(() => setItems((prev) => prev.filter((a) => a.id !== id)))
      .catch((err) => console.error('Échec de la suppression :', err));
  };

  const handleSave = () => {
    if (!draft.title.trim() || saving) return;
    setSaving(true);
    const request = editingId === null ? articlesStore.create(draft) : articlesStore.update(editingId, draft);
    request
      .then((saved) => {
        setItems((prev) => (editingId === null ? [saved, ...prev] : prev.map((a) => (a.id === saved.id ? saved : a))));
        setIsOpen(false);
      })
      .catch((err) => console.error("Échec de l'enregistrement :", err))
      .finally(() => setSaving(false));
  };

  const openComments = (article: Article) => {
    setCommentsArticle(article);
    setCommentsLoading(true);
    setReplyDrafts({});
    getComments('article', article.id)
      .then(setComments)
      .catch((err) => console.error('Impossible de charger les commentaires :', err))
      .finally(() => setCommentsLoading(false));
  };

  const handleReply = (commentId: string) => {
    const reply = replyDrafts[commentId]?.trim();
    if (!reply || replySaving) return;
    setReplySaving(commentId);
    replyToComment(commentId, reply)
      .then((updated) => {
        setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setReplyDrafts((prev) => ({ ...prev, [commentId]: '' }));
      })
      .catch((err) => console.error('Échec de la réponse :', err))
      .finally(() => setReplySaving(null));
  };

  if (isLoading) return <PageLoader label="Chargement..." fullScreen={false} />;

  return (
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#002366]">Gestion du Blog</h2>
          <p className="text-xs text-slate-500">{items.length} article(s) publié(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm group flex flex-col"
          >
            <div className="w-full aspect-[37/25] overflow-hidden bg-slate-100 relative border-b border-slate-100">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[10px] font-bold text-[#002366] bg-white/90 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {article.category}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col">
              <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug line-clamp-2">{article.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-slate-400" /> {summary.likes[article.id] ?? 0}</span>
                <button
                  onClick={() => openComments(article)}
                  className="flex items-center gap-1 hover:text-[#002366] cursor-pointer transition-colors"
                  title="Voir et répondre aux commentaires"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-slate-400" /> {summary.comments[article.id] ?? 0}
                </button>
                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-slate-400" /> {summary.shares[article.id] ?? 0}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold">{article.author}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(article)}
                    className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#002366] flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-center gap-3 py-16 corporate-card rounded-3xl border border-dashed border-slate-300 bg-white">
            <FileText className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-400">Aucun article pour le moment.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId === null ? 'Nouvel article' : "Modifier l'article"}
        subtitle="Blog du Cabinet RE2M"
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        }
      >
        <div>
          <label className={labelClass}>Titre</label>
          <input
            className={inputClass}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Titre de l'article"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Catégorie</label>
            <input
              className={inputClass}
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="Achats & Logistique"
            />
          </div>
          <div>
            <label className={labelClass}>Auteur</label>
            <input
              className={inputClass}
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
            />
          </div>
        </div>

        <ImageUploadField
          label="Image de couverture"
          value={draft.image}
          onChange={(v) => setDraft({ ...draft, image: v })}
        />

        <div>
          <label className={labelClass}>Extrait</label>
          <textarea
            className={`${inputClass} resize-y`}
            rows={2}
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Contenu</label>
          <RichTextEditor
            value={draft.content}
            onChange={(html) => setDraft({ ...draft, content: html })}
            placeholder="Rédigez l'article..."
          />
        </div>

        <div>
          <label className={labelClass}>Tags (séparés par des virgules)</label>
          <input
            className={inputClass}
            value={draft.tags.join(', ')}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
          />
        </div>
      </SlideOver>

      <SlideOver
        isOpen={commentsArticle !== null}
        onClose={() => setCommentsArticle(null)}
        title="Commentaires"
        subtitle={commentsArticle?.title}
      >
        {commentsLoading && <p className="text-xs text-slate-400 text-center py-8">Chargement...</p>}

        {!commentsLoading && comments.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-8">Aucun commentaire pour cet article.</p>
        )}

        {!commentsLoading && (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#0f172a]">{c.author || 'Anonyme'}</p>
                  <p className="text-[10px] text-slate-400">{formatDate(c.date)}</p>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>

                {c.adminReply ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-2">
                    <p className="text-[10px] font-bold text-[#002366] uppercase mb-1">Votre réponse</p>
                    <p className="text-xs text-slate-700">{c.adminReply}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      value={replyDrafts[c.id] ?? ''}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleReply(c.id);
                      }}
                      placeholder="Répondre à ce commentaire..."
                      className="flex-1 min-w-0 bg-white text-xs rounded-lg px-3 py-2 border border-slate-200 focus:border-[#002366] focus:outline-none"
                    />
                    <button
                      onClick={() => handleReply(c.id)}
                      disabled={replySaving === c.id || !replyDrafts[c.id]?.trim()}
                      className="w-8 h-8 rounded-lg bg-[#002366] hover:bg-blue-900 text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SlideOver>
    </div>
  );
};

export default BlogAdmin;
