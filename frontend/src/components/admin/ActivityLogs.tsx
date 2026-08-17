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
    <div className="space-y-6 animate-fadeIn text-[#0f172a]">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Journal d'Activité & Audit
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#002366]">
            Traçabilité & Historique
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enregistrement sécurisé de la création de cartes, des scans QR, des modifications et des exports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap-3 shadow-sm">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans les logs (utilisateur, action, IP...)"
            className="w-full bg-slate-50 text-slate-700 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-blue-900 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-blue-900 focus:bg-white focus:outline-none cursor-pointer transition-colors"
          >
            <option value="Tous">Action: Toutes</option>
            <option value="CREATE">Création (CREATE)</option>
            <option value="UPDATE">Modification (UPDATE)</option>
            <option value="DELETE">Suppression (DELETE)</option>
            <option value="SCAN">Scan QR (SCAN)</option>
            <option value="BATCH_EXPORT">Export par lot (BATCH_EXPORT)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5">Horodatage (UTC)</th>
                <th className="py-4 px-5">Utilisateur / Origine</th>
                <th className="py-4 px-5">Type d'Action</th>
                <th className="py-4 px-5">Target Membre</th>
                <th className="py-4 px-5">Détails de l'Événement</th>
                <th className="py-4 px-5 text-right">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    Aucun log trouvé correspondant au filtre.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-450 font-medium">
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#002366]">
                      {log.user}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        log.action === 'UPDATE' ? 'bg-amber-50 text-amber-800 border-amber-100' :
                        log.action === 'DELETE' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        log.action === 'SCAN' ? 'bg-blue-50 text-blue-800 border-blue-100' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-blue-900">
                      {log.targetMember || 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 font-medium">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono text-[10px] text-slate-450 font-medium">
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
