import React, { useState } from 'react';
import { Plus, Mail, Paperclip, Send, X, Users, CheckCircle2 } from 'lucide-react';
import { SlideOver } from '../SlideOver';
import { RichTextEditor } from '../RichTextEditor';
import { Newsletter, newsletters as initialNewsletters } from '../../../data/newsletters';

const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

export const NewsletterAdmin: React.FC = () => {
  const [items, setItems] = useState<Newsletter[]>(initialNewsletters);
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sent, setSent] = useState(false);

  const openCompose = () => {
    setSubject('');
    setBody('');
    setAttachment(null);
    setSent(false);
    setIsOpen(true);
  };

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) return;
    const newEntry: Newsletter = {
      id: `NL-${String(items.length + 1).padStart(3, '0')}`,
      subject,
      bodyHtml: body,
      attachment: attachment?.name,
      recipients: 312,
      status: 'sent',
      sentAt: new Date().toISOString().slice(0, 10)
    };
    setItems((prev) => [newEntry, ...prev]);
    setSent(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#002366]">Newsletter</h2>
          <p className="text-xs text-slate-500">{items.length} newsletter(s) envoyée(s)</p>
        </div>
        <button
          onClick={openCompose}
          className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Rédiger
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Objet</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Destinataires</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Statut</th>
              <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((nl) => (
              <tr key={nl.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-[#002366]">{nl.subject}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {nl.recipients}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    Envoyée
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-slate-400">{new Date(nl.sentAt).toLocaleDateString('fr-FR')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideOver
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Rédiger une newsletter"
        subtitle="Envoyée à tous les abonnés"
        footer={
          sent ? undefined : (
            <>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSend}
                className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-sm transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Envoyer
              </button>
            </>
          )
        }
      >
        {sent ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-serif text-base font-bold text-[#002366]">Newsletter envoyée !</p>
            <p className="text-xs text-slate-500">Elle a été transmise à tous les abonnés.</p>
          </div>
        ) : (
          <>
            <div>
              <label className={labelClass}>Objet</label>
              <input
                className={inputClass}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet de la newsletter"
              />
            </div>

            <div>
              <label className={labelClass}>Contenu</label>
              <RichTextEditor value={body} onChange={setBody} placeholder="Rédigez votre message..." />
            </div>

            <div>
              <label className={labelClass}>Pièce jointe</label>
              {attachment ? (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  <span className="text-xs text-slate-600 flex items-center gap-2 truncate">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{attachment.name}</span>
                  </span>
                  <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-rose-600 cursor-pointer shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl px-3 py-3 text-xs text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Paperclip className="w-3.5 h-3.5" />
                  Joindre un fichier
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  />
                </label>
              )}
            </div>
          </>
        )}
      </SlideOver>
    </div>
  );
};

export default NewsletterAdmin;
