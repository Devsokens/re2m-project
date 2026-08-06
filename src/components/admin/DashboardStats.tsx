import React from 'react';
import { Member, DashboardMetrics } from '../../types/member';
import { Users, QrCode, CreditCard, TrendingUp, Award, Activity, Sparkles } from 'lucide-react';

interface DashboardStatsProps {
  members: Member[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ members }) => {
  const activeCount = members.filter(m => m.status === 'active').length;
  const totalScans = members.reduce((acc, m) => acc + m.scanCount, 0);

  const metrics: DashboardMetrics = {
    totalMembers: members.length,
    activeMembers: activeCount,
    totalScans: totalScans,
    cardsGenerated: members.length,
    adoptionRate: Math.round((activeCount / Math.max(1, members.length)) * 100)
  };

  const sortedTopConsultants = [...members].sort((a, b) => b.scanCount - a.scanCount).slice(0, 4);

  // Calculate department distribution
  const deptCounts: Record<string, number> = {};
  members.forEach(m => {
    deptCounts[m.department] = (deptCounts[m.department] || 0) + 1;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-sky-500/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Back-Office Administration • Dashboard
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Tableau de Bord & Indicateurs Clefs
          </h2>
          <p className="text-xs text-slate-400">
            Vue synthétique des activités, scans QR codes et taux d'adoption du réseau RE2M Connect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <Activity className="w-4 h-4" /> PWA Synchro 100%
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Members */}
        <div className="glass-card rounded-2xl p-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Membres Total</span>
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-sky-500/30 flex items-center justify-center text-sky-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-white">{metrics.totalMembers}</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
              {metrics.activeMembers} actifs ({metrics.adoptionRate}% d'adoption)
            </p>
          </div>
        </div>

        {/* Total Scans */}
        <div className="glass-card rounded-2xl p-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scans QR Cumulés</span>
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-sky-500/30 flex items-center justify-center text-sky-300">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-white">{metrics.totalScans}</p>
            <p className="text-[11px] text-sky-300 mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18.4% ce mois-ci
            </p>
          </div>
        </div>

        {/* Cards Generated */}
        <div className="glass-card rounded-2xl p-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cartes Générées</span>
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-sky-500/30 flex items-center justify-center text-sky-300">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-white">{metrics.cardsGenerated}</p>
            <p className="text-[11px] text-slate-400 mt-1">100% vCard 4.0 Conforme</p>
          </div>
        </div>

        {/* Adoption Rate */}
        <div className="glass-card rounded-2xl p-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Objectif SMART</span>
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-sky-500/30 flex items-center justify-center text-sky-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-sky-300">{metrics.adoptionRate}%</p>
            <p className="text-[11px] text-slate-300 mt-1">Cible SMART &gt; 90% atteinte</p>
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Consultants by Scans */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border-sky-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Top Consultants les plus Consultés</h3>
              <p className="text-xs text-slate-400">Classement selon le volume de scans QR Code</p>
            </div>
            <Award className="w-5 h-5 text-sky-300" />
          </div>

          <div className="space-y-4">
            {sortedTopConsultants.map((consultant, index) => (
              <div
                key={consultant.id}
                className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-950 border border-sky-500/40 flex items-center justify-center font-bold text-xs text-sky-200">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-white">
                      {consultant.civility} {consultant.firstName} {consultant.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{consultant.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-sky-300">{consultant.scanCount} scans</span>
                  <p className="text-[10px] text-slate-500">{consultant.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border-sky-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Répartition par Département</h3>
              <p className="text-xs text-slate-400">Pourcentage des effectifs numérisés</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(deptCounts).map(([dept, count], idx) => {
              const pct = Math.round((count / members.length) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{dept}</span>
                    <span className="text-sky-300">{count} membre(s) ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-blue-700 to-sky-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
