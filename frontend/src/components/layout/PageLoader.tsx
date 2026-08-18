import React from 'react';

interface PageLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ label = 'Chargement...', fullScreen = true }) => (
  <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen' : 'py-24'} bg-white`}>
    <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-[#002366] animate-spin" />
    <p className="text-xs font-semibold text-slate-400">{label}</p>
  </div>
);

export default PageLoader;
