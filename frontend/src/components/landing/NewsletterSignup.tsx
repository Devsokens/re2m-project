import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { newsletterStore } from '../../data/newsletters';

interface NewsletterSignupProps {
  variant?: 'light' | 'dark';
  title?: string;
  description?: string;
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'light',
  title = 'Restez informé',
  description = 'Abonnez-vous pour recevoir nos analyses sur les Achats, la Logistique et la performance des organisations.',
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const isDark = variant === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribing) return;
    setSubscribing(true);
    setError('');
    newsletterStore
      .subscribe(email.trim())
      .then(() => {
        setSubscribed(true);
        setEmail('');
      })
      .catch(() => setError("Échec de l'inscription. Veuillez réessayer."))
      .finally(() => setSubscribing(false));
  };

  if (isDark) {
    return (
      <div className={className}>
        <h4 className="font-serif text-sm font-semibold text-white mb-1.5 tracking-wider uppercase text-sky-300 flex items-center gap-2">
          <Mail className="w-4 h-4" /> {title}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">{description}</p>
        {subscribed ? (
          <p className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-lg px-3 py-2.5">
            Merci ! Votre inscription est confirmée.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="min-w-0 flex-1 text-xs rounded-lg px-3 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="shrink-0 bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {subscribing ? '...' : "S'abonner"}
            </button>
          </form>
        )}
        {error && <p className="text-[11px] text-rose-400 font-semibold mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 text-center ${className}`}>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366]">{title}</h2>
          <p className="text-slate-500 text-sm">{description}</p>
        </div>

        {subscribed ? (
          <p className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 max-w-md mx-auto">
            Merci ! Votre inscription à la newsletter est confirmée.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              className="w-full text-xs rounded-xl px-4 py-3 border border-slate-200 focus:border-[#002366] focus:outline-none bg-white"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="w-full sm:w-auto shrink-0 bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {subscribing ? 'Inscription...' : "S'abonner"}
            </button>
          </form>
        )}
        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
      </div>
    </section>
  );
};

export default NewsletterSignup;
