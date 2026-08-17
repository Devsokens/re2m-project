import React, { useState } from 'react';
import { Send, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { requestsStore, RequestType } from '../../data/requests';
import { ApiError } from '../../lib/apiClient';

const TYPE_OPTIONS: RequestType[] = ['Audit & Conseil', 'Formation', 'Partenariat', 'Autre'];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  type: '' as RequestType | '',
  message: ''
};

export const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || submitting) return;
    setSubmitting(true);
    setError('');
    requestsStore
      .create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        type: formData.type,
        message: formData.message
      })
      .then(() => {
        setSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Échec de l'envoi. Veuillez réessayer.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="corporate-card p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden bg-white text-[#0f172a]">

      {/* Title */}
      <div className="space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#002366] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Formulaire de Message
        </div>
        <h3 className="font-serif text-xl font-bold text-[#002366]">
          Écrire au Cabinet RE2M
        </h3>
      </div>

      {submitted ? (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-[#002366] border border-blue-200 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#002366]">Message Transmis avec Succès</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Merci {formData.name}. Le Cabinet RE2M a bien reçu votre message et notre secrétariat vous répondra sous 24 heures.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData(emptyForm);
            }}
            className="text-xs text-blue-800 font-semibold underline hover:text-[#002366] cursor-pointer pt-2"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Nom & Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Jean DUPONT"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Adresse Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@entreprise.com"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+241 XX XX XX XX"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Type de demande *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RequestType })}
                className="w-full bg-slate-50 text-slate-900 rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] text-xs focus:outline-none cursor-pointer"
              >
                <option value="" disabled>Sélectionnez un type</option>
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
              Société / Organisation
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="ex: SEEG, COLAS Gabon, CDC..."
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
              Votre Message *
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Saisissez la nature de votre demande ou votre projet d'audit/formation..."
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#002366] text-xs focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#002366] hover:bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Envoi en cours...' : 'Envoyer le Message'}</span>
          </button>
        </form>
      )}

    </div>
  );
};
export default ContactForm;
