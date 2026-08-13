import React, { useState } from 'react';
import { MessageSquareQuote, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { testimonialsStore } from '../../utils/testimonialsStore';

interface TestimonialSubmissionFormProps {
  token: string;
}

export const TestimonialSubmissionForm: React.FC<TestimonialSubmissionFormProps> = ({ token }) => {
  const [company, setCompany] = useState('');
  const [service, setService] = useState('');
  const [text, setText] = useState('');
  const [logo, setLogo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isValid = testimonialsStore.isValidToken(token);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    testimonialsStore.addPending({ company, service, text, logo, token });
    setSubmitted(true);
  };

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-sm w-full text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-rose-600" />
          </div>
          <h1 className="font-serif text-lg font-bold text-[#002366]">Lien invalide ou expiré</h1>
          <p className="text-xs text-slate-500">Ce lien de témoignage n'est plus valide. Contactez le Cabinet RE2M pour en obtenir un nouveau.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-sm w-full text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="font-serif text-lg font-bold text-[#002366]">Merci pour votre témoignage !</h1>
          <p className="text-xs text-slate-500">Il a bien été transmis au Cabinet RE2M et sera publié après validation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 shadow mx-auto flex items-center justify-center">
            <img src="/logo.png" alt="RE2M Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100 inline-flex items-center gap-1.5">
            <MessageSquareQuote className="w-3 h-3" /> Espace Témoignage
          </span>
          <h1 className="font-serif text-2xl font-extrabold text-[#002366] mt-2">
            Partagez votre expérience
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Le Cabinet RE2M vous invite à partager votre retour d'expérience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Entreprise</label>
            <input
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-50 text-xs rounded-xl px-3 py-3 border border-slate-200 focus:border-[#002366] focus:outline-none"
              placeholder="Nom de votre entreprise"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Service concerné</label>
            <input
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-slate-50 text-xs rounded-xl px-3 py-3 border border-slate-200 focus:border-[#002366] focus:outline-none"
              placeholder="Ex : Formation Achats"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Logo de l'entreprise (URL, optionnel)</label>
            <input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full bg-slate-50 text-xs rounded-xl px-3 py-3 border border-slate-200 focus:border-[#002366] focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Votre témoignage</label>
            <textarea
              required
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-slate-50 text-xs rounded-xl px-3 py-3 border border-slate-200 focus:border-[#002366] focus:outline-none resize-y"
              placeholder="Partagez votre expérience avec le Cabinet RE2M..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#002366] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer mon témoignage</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialSubmissionForm;
