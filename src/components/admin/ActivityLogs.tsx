import React, { useState } from 'react';
import { ActivityLog } from '../../types/member';
import { FileSpreadsheet, Search, ShieldCheck } from 'lucide-react';

interface ActivityLogsProps {
  logs: ActivityLog[];
}

export const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('Tous');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetMember && log.targetMember.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = actionFilter === 'Tous' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Date Timestamp', 'Utilisateur', 'Action', 'Target Member', 'Détails', 'Adresse IP'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.user}"`,
      l.action,
      `"${l.targetMember || ''}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal_activite_re2m_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Section 5.5 — Journal d'Activité & Audit Log
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Traçabilité & Historique des Interactions
          </h2>
          <p className="text-xs text-slate-300">
            Enregistrement sécurisé de la création de cartes, des scans QR, des modifications et des exports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl border border-slate-700 hover:border-sky-500/40 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-sky-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans les logs (utilisateur, action, IP...)"
            className="w-full bg-slate-900 text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:border-sky-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-sky-400 focus:outline-none cursor-pointer"
          >
            <option value="Tous" className="bg-slate-900">Action: Toutes</option>
            <option value="CREATE" className="bg-slate-900">Création (CREATE)</option>
            <option value="UPDATE" className="bg-slate-900">Modification (UPDATE)</option>
            <option value="DELETE" className="bg-slate-900">Suppression (DELETE)</option>
            <option value="SCAN" className="bg-slate-900">Scan QR (SCAN)</option>
            <option value="BATCH_EXPORT" className="bg-slate-900">Export par lot (BATCH_EXPORT)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-3xl border-sky-500/30 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-sky-300 font-serif border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Horodatage (UTC)</th>
                <th className="py-4 px-4">Utilisateur / Origine</th>
                <th className="py-4 px-4">Type d'Action</th>
                <th className="py-4 px-4">Target Membre</th>
                <th className="py-4 px-4">Détails de l'Événement</th>
                <th className="py-4 px-4 text-right">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    Aucun log trouvé correspondant au filtre.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {log.user}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        log.action === 'UPDATE' ? 'bg-amber-500/10 text-amber-300 border-sky-500/30' :
                        log.action === 'DELETE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        log.action === 'SCAN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-sky-200">
                      {log.targetMember || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-500">
                      {log.ipAddress || '197.221.14.10'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
