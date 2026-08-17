import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageSquareQuote, Send, CheckCircle2 } from 'lucide-react';
import { testimonialsStore } from '../../utils/testimonialsStore';
import { ImageUploadField } from '../admin/ImageUploadField';

interface PublicTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass = 'w-full bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-3 border border-slate-200 focus:border-[#002366] focus:bg-white focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase mb-1.5';

export const PublicTestimonialModal: React.FC<PublicTestimonialModalProps> = ({ isOpen, onClose }) => {
  const [company, setCompany] = useState('');
  const [service, setService] = useState('');
  const [text, setText] = useState('');
  const [logo, setLogo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setCompany('');
      setService('');
      setText('');
      setLogo('');
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    testimonialsStore.submitPublic({ company, service, text, logo });
    setSubmitted(true);
  };

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn"
    >
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative animate-scaleUp">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center space-y-3 py-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#002366]">Merci pour votre témoignage !</h3>
            <p className="text-xs text-slate-500">Il a bien été transmis au Cabinet RE2M et sera publié après validation.</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2 mb-6">
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100 inline-flex items-center gap-1.5">
                <MessageSquareQuote className="w-3 h-3" /> Partagez votre expérience
              </span>
              <h3 className="font-serif text-xl font-extrabold text-[#002366]">Laisser un témoignage</h3>
              <p className="text-xs text-slate-500">Votre avis sera examiné par le Cabinet RE2M avant publication.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Entreprise</label>
                <input required value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} placeholder="Nom de votre entreprise" />
              </div>
              <div>
                <label className={labelClass}>Service concerné</label>
                <input required value={service} onChange={(e) => setService(e.target.value)} className={inputClass} placeholder="Ex : Formation Achats" />
              </div>
              <ImageUploadField label="Logo de l'entreprise (optionnel)" value={logo} onChange={setLogo} />
              <div>
                <label className={labelClass}>Votre témoignage</label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`${inputClass} resize-y`}
                  placeholder="Partagez votre expérience avec le Cabinet RE2M..."
                />
              </div>
              <button
                type="submit"
                className="group w-full bg-[#002366] hover:bg-blue-900 text-white font-bold py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Envoyer mon témoignage</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PublicTestimonialModal;
