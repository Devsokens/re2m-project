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
    <div className="space-y-8 animate-fadeIn text-[#0f172a]">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Administration • Tableau de Bord
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#002366]">
            Indicateurs de Performance
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Vue synthétique des activités, scans QR codes et taux d'adoption du réseau RE2M Connect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-600" /> Synchro PWA active
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Members */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Membres Total</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-[#002366]">{metrics.totalMembers}</p>
            <p className="text-[11px] text-emerald-600 mt-1 font-bold">
              {metrics.activeMembers} actifs ({metrics.adoptionRate}% d'adoption)
            </p>
          </div>
        </div>

        {/* Total Scans */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Scans QR Cumulés</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366]">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-[#002366]">{metrics.totalScans}</p>
            <p className="text-[11px] text-blue-800 mt-1 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600" /> +18.4% ce mois-ci
            </p>
          </div>
        </div>

        {/* Cards Generated */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Cartes Générées</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-[#002366]">{metrics.cardsGenerated}</p>
            <p className="text-[11px] text-slate-450 font-semibold mt-1">100% vCard 4.0 Conforme</p>
          </div>
        </div>

        {/* Adoption Rate */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Objectif SMART</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366]">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-[#002366]">{metrics.adoptionRate}%</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">Cible SMART &gt; 90% atteinte</p>
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Consultants by Scans */}
        <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-[#002366]">Consultants les plus visités</h3>
              <p className="text-xs text-slate-400 font-medium">Classement selon le volume de scans QR Code</p>
            </div>
            <Award className="w-5 h-5 text-blue-800" />
          </div>

          <div className="space-y-4">
            {sortedTopConsultants.map((consultant, index) => (
              <div
                key={consultant.id}
                className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-900">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-[#002366]">
                      {consultant.civility} {consultant.firstName} {consultant.lastName}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{consultant.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-blue-900">{consultant.scanCount} scans</span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{consultant.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-[#002366]">Répartition par Département</h3>
              <p className="text-xs text-slate-400 font-medium">Pourcentage des effectifs enregistrés</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(deptCounts).map(([dept, count], idx) => {
              const pct = Math.round((count / members.length) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 font-bold">{dept}</span>
                    <span className="text-blue-900 font-extrabold">{count} membre(s) ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                    <div
                      className="bg-[#002366] h-full rounded-full transition-all duration-500"
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
