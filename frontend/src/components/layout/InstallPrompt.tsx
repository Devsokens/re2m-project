import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

interface InstallPromptProps {
  visible: boolean;
  onInstall: () => void;
}

// Shows a real UI for the captured `beforeinstallprompt` event — without
// this, the browser suppresses its native install banner (we called
// preventDefault on the event) but nothing ever calls .prompt() in return,
// so the app becomes silently uninstallable.
export const InstallPrompt: React.FC<InstallPromptProps> = ({ visible, onInstall }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-xs bg-white border border-slate-200 shadow-xl rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
        <Download className="w-4.5 h-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#0f172a]">Installer l'application</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Accédez au Cabinet RE2M depuis votre écran d'accueil, hors ligne.</p>
        <button
          onClick={onInstall}
          className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#002366] hover:bg-blue-900 text-white text-[11px] font-bold cursor-pointer transition-colors"
        >
          Installer
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer"
        className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default InstallPrompt;
