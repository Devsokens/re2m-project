import React from 'react';
import { Member } from '../../types/member';
import { articles } from '../../data/articles';
import { news } from '../../data/news';
import {
  Eye,
  Inbox,
  Newspaper,
  FileText,
  Mail,
  Award,
  TrendingUp
} from 'lucide-react';

interface DashboardStatsProps {
  members: Member[];
}

// Mock traffic trend (no backend yet) — last 14 days of site visits
const VISITS_TREND = [420, 460, 445, 510, 540, 500, 580, 610, 590, 650, 700, 680, 740, 812];
const VISITS_LABELS = ['J-13', 'J-12', 'J-11', 'J-10', 'J-9', 'J-8', 'J-7', 'J-6', 'J-5', 'J-4', 'J-3', 'J-2', 'J-1', "Auj."];

// Mock request-type breakdown for the "Demandes" module
const REQUEST_BREAKDOWN = [
  { label: 'Audit & Conseil', value: 18, color: '#002366' },
  { label: 'Formation', value: 14, color: '#4169E1' },
  { label: 'Partenariat', value: 8, color: '#C5A85C' },
  { label: 'Autres', value: 7, color: '#94A3B8' }
];

const TOTAL_REQUESTS = REQUEST_BREAKDOWN.reduce((sum, r) => sum + r.value, 0);
const NEWSLETTER_SUBSCRIBERS = 312;

const LineAreaChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const width = 600;
  const height = 180;
  const max = Math.max(...data);
  const min = Math.min(...data) * 0.9;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / (max - min)) * (height - 20) - 10;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(' L')}`;
  const areaPath = `M0,${height} L${points.join(' L')} L${width},${height} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#002366" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#002366" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#visitsGradient)" />
        <path d={linePath} fill="none" stroke="#002366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => {
          const x = i * step;
          const y = height - ((v - min) / (max - min)) * (height - 20) - 10;
          return <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 5 : 3} fill="#002366" />;
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {labels.map((l, i) => (
          <span key={i} className="text-[9px] text-slate-400 font-semibold">{l}</span>
        ))}
      </div>
    </div>
  );
};

const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let cumulative = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
            {data.map((seg, idx) => {
              const segLen = (seg.value / total) * circumference;
              const dashArray = `${segLen} ${circumference - segLen}`;
              const dashOffset = -cumulative;
              cumulative += segLen;
              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                />
              );
            })}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-2xl font-extrabold text-[#002366]">{total}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
        </div>
      </div>

      <div className="space-y-2.5 flex-1 min-w-0">
        {data.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-slate-600 font-semibold truncate">{seg.label}</span>
            </div>
            <span className="font-bold text-[#002366] shrink-0">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const VerticalBarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-3 h-40">
      {data.map((d, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span className="text-[10px] font-extrabold text-[#002366]">{d.value}</span>
          <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex items-end" style={{ height: '100%' }}>
            <div
              className="w-full bg-[#002366] rounded-lg transition-all duration-700"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-500 font-semibold text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const KpiCard: React.FC<{ label: string; value: string | number; trend?: string; icon: React.ElementType }> = ({
  label,
  value,
  trend,
  icon: Icon
}) => (
  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366]">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="mt-4">
      <p className="font-serif text-3xl font-bold text-[#002366]">{value}</p>
      {trend && (
        <p className="text-[11px] text-emerald-600 mt-1 font-bold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {trend}
        </p>
      )}
    </div>
  </div>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ members }) => {
  const sortedTopConsultants = [...members].sort((a, b) => b.scanCount - a.scanCount).slice(0, 4);

  const deptCounts: Record<string, number> = {};
  members.forEach((m) => {
    deptCounts[m.department] = (deptCounts[m.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCounts).map(([label, value]) => ({ label, value }));

  return (
    <div className="space-y-8 animate-fadeIn text-[#0f172a]">

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <KpiCard label="Visites (14j)" value={VISITS_TREND.reduce((a, b) => a + b, 0).toLocaleString('fr-FR')} trend="+12.4%" icon={Eye} />
        <KpiCard label="Demandes Reçues" value={TOTAL_REQUESTS} trend="+5 cette semaine" icon={Inbox} />
        <KpiCard label="Articles Blog" value={articles.length} icon={FileText} />
        <KpiCard label="Actualités Publiées" value={news.length} icon={Newspaper} />
        <KpiCard label="Abonnés Newsletter" value={NEWSLETTER_SUBSCRIBERS} trend="+21 ce mois" icon={Mail} />
      </div>

      {/* Visits trend + Requests donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-[#002366]">Flux des visites</h3>
              <p className="text-xs text-slate-400 font-medium">Trafic du site sur les 14 derniers jours</p>
            </div>
            <Eye className="w-5 h-5 text-blue-800" />
          </div>
          <LineAreaChart data={VISITS_TREND} labels={VISITS_LABELS} />
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-[#002366]">Répartition des demandes</h3>
              <p className="text-xs text-slate-400 font-medium">Par type de sollicitation</p>
            </div>
            <Inbox className="w-5 h-5 text-blue-800" />
          </div>
          <DonutChart data={REQUEST_BREAKDOWN} />
        </div>
      </div>

      {/* Department breakdown + Top consultants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-[#002366]">Répartition par Département</h3>
              <p className="text-xs text-slate-400 font-medium">Effectifs enregistrés par pôle</p>
            </div>
          </div>
          {deptData.length > 0 ? (
            <VerticalBarChart data={deptData} />
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">Aucune donnée disponible</p>
          )}
        </div>

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
      </div>

    </div>
  );
};
