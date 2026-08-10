import React, { useState } from 'react';
import { ShieldCheck, Key, Mail, Lock, BarChart3, Users, FileCheck2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('admin@cabinet-re2m.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@cabinet-re2m.com' && password === 'password123') {
      confetti({ particleCount: 50, spread: 60 });
      onLoginSuccess();
    } else {
      setError('Identifiants de connexion invalides pour le Cabinet RE2M.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-[#0f172a]">

      {/* Left panel: animated brand showcase */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-[#002366] items-center justify-center px-12">
        {/* Animated background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/3 right-10 w-52 h-52 rounded-full bg-white/5 blur-2xl animate-[pulse_5s_ease-in-out_infinite]" />

        {/* Floating grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-md text-white space-y-10">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 p-2.5 shadow-xl backdrop-blur-sm flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
            <img src="/logo1.png" alt="RE2M Logo" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-sky-200 bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 inline-block">
              Portail Back-Office
            </span>
            <h1 className="font-serif text-3xl font-extrabold leading-tight">
              Cabinet RE2M — Espace Administration
            </h1>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Pilotez les membres, les cotisations et les publications du Cabinet en toute sécurité.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite] [animation-delay:0.3s]">
              <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center shrink-0">
                <Users className="w-4.5 h-4.5 text-sky-200" />
              </div>
              <div>
                <p className="text-xs font-bold">Gestion des membres</p>
                <p className="text-[11px] text-blue-100/60">Profils, cartes & adhésions</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite] [animation-delay:0.6s]">
              <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4.5 h-4.5 text-sky-200" />
              </div>
              <div>
                <p className="text-xs font-bold">Statistiques en temps réel</p>
                <p className="text-[11px] text-blue-100/60">Suivi de l'activité du cabinet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite] [animation-delay:0.9s]">
              <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4.5 h-4.5 text-sky-200" />
              </div>
              <div>
                <p className="text-xs font-bold">Contenus & certifications</p>
                <p className="text-[11px] text-blue-100/60">Publication et validation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: login form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-6">

          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 shadow mx-auto flex items-center justify-center lg:hidden">
              <img src="/logo.png" alt="RE2M Logo" className="w-full h-full object-contain" />
            </div>
            {/* <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100 inline-flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Espace Sécurisé
            </span> */}
            <h2 className="font-serif text-2xl font-extrabold text-[#002366] mt-2">
              Connexion Back-Office
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Accès réservé aux administrateurs du Cabinet RE2M
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Identifiant (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 text-xs rounded-xl pl-9 pr-3 py-3 border border-slate-200 focus:border-[#002366] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 text-xs rounded-xl pl-9 pr-3 py-3 border border-slate-200 focus:border-[#002366] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#002366] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-xs"
              >
                
                <span>Se Connecter</span>
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-[#002366] hover:underline"
            >
              Retour au site
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
