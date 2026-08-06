import React, { useState } from 'react';
import { ShieldCheck, Key, Mail, Sparkles } from 'lucide-react';
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white text-[#0f172a] py-12">
      <div className="max-w-md w-full corporate-card rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
        
        {/* Header Logo & Brand */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 shadow mx-auto flex items-center justify-center">
            <img src="/logo.png" alt="RE2M Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
              Espace Sécurisé
            </span>
            <h2 className="font-serif text-2xl font-extrabold text-[#002366] mt-2">
              Connexion Back-Office
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Accès réservé aux administrateurs du Cabinet RE2M
            </p>
          </div>
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
              <ShieldCheck className="w-4 h-4" />
              <span>Se Connecter au Portail Admin</span>
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
  );
};
