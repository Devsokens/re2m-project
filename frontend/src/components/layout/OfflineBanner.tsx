import React, { useState, useEffect } from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500/90 text-slate-950 font-medium px-4 py-2 text-sm flex items-center justify-center gap-2 shadow-lg backdrop-blur sticky top-0 z-50 animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span>
        <strong>Mode Hors-Ligne (PWA) :</strong> Vous consultez la version mise en cache. La recherche globale et le téléchargement direct de vCard nécessitent un accès réseau.
      </span>
      <AlertTriangle className="w-4 h-4 ml-auto hidden sm:block" />
    </div>
  );
};
