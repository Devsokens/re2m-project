import React, { useEffect, useState } from 'react';
import { Member } from '../../types/member';
import { Article, articlesStore } from '../../data/articles';
import { NewsItem, newsStore } from '../../data/news';
import { Newsletter, newsletterStore } from '../../data/newsletters';
import { requestsStore, RequestType } from '../../data/requests';
import { EngagementStats, getEngagementStats } from '../../utils/engagementStore';
import { analyticsStore, VisitsPeriod } from '../../data/analytics';
import {
  Eye,
  Inbox,
  Newspaper,
  FileText,
  Mail,
  Heart,
  TrendingUp
} from 'lucide-react';

interface DashboardStatsProps {
  members: Member[];
}

const PERIOD_LABELS: Record<VisitsPeriod, string> = {
  day: 'Jour',
  week: 'Semaine',
  month: 'Mois',
  year: 'Année'
};

const REQUEST_TYPE_COLORS: Record<RequestType, string> = {
  'Audit & Conseil': '#002366',
  Formation: '#4169E1',
  Partenariat: '#C5A85C',
  Autre: '#94A3B8'
};

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
  const [visitsPeriod, setVisitsPeriod] = useState<VisitsPeriod>('week');
  const [articles, setArticles] = useState<Article[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState(0);

  const [visitsSeries, setVisitsSeries] = useState<{ data: number[]; labels: string[] }>({ data: [], labels: [] });
  const [visitsLoading, setVisitsLoading] = useState(true);
  const [requestBreakdown, setRequestBreakdown] = useState<{ label: string; value: number; color: string }[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [engagementStats, setEngagementStats] = useState<EngagementStats>({ likes: 0, comments: 0, shares: 0 });

  useEffect(() => {
    articlesStore.list().then(setArticles).catch((err) => console.error('Impossible de charger les articles :', err));
    newsStore.list().then(setNews).catch((err) => console.error('Impossible de charger les actualités :', err));
    newsletterStore.list().then(setNewsletters).catch((err) => console.error('Impossible de charger les newsletters :', err));
    newsletterStore
      .subscriberCount()
      .then((r) => setNewsletterSubscribers(r.count))
      .catch((err) => console.error('Impossible de charger les abonnés :', err));
    getEngagementStats().then(setEngagementStats).catch((err) => console.error('Impossible de charger les réactions :', err));
    requestsStore
      .list()
      .then((requests) => {
        setTotalRequests(requests.length);
        const counts: Record<string, number> = {};
        requests.forEach((r) => {
          counts[r.type] = (counts[r.type] ?? 0) + 1;
        });
        setRequestBreakdown(
          Object.entries(counts)
            .map(([label, value]) => ({ label, value, color: REQUEST_TYPE_COLORS[label as RequestType] ?? '#94A3B8' }))
            .sort((a, b) => b.value - a.value)
        );
      })
      .catch((err) => console.error('Impossible de charger les demandes :', err));
  }, []);

  useEffect(() => {
    setVisitsLoading(true);
    analyticsStore
      .getVisits(visitsPeriod)
      .then(setVisitsSeries)
      .catch((err) => console.error('Impossible de charger les visites :', err))
      .finally(() => setVisitsLoading(false));
  }, [visitsPeriod]);

  const periodTotal = visitsSeries.data.reduce((a, b) => a + b, 0);

  const deptCounts: Record<string, number> = {};
  members.forEach((m) => {
    deptCounts[m.department] = (deptCounts[m.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCounts).map(([label, value]) => ({ label, value }));

  const latestArticle = articles[0];
  const latestNews = news[0];
  const latestNewsletter = newsletters[0];

  return (
    <div className="space-y-8 animate-fadeIn text-[#0f172a]">

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <KpiCard label={`Visites (${PERIOD_LABELS[visitsPeriod].toLowerCase()})`} value={periodTotal.toLocaleString('fr-FR')} icon={Eye} />
        <KpiCard label="Demandes Reçues" value={totalRequests} icon={Inbox} />
        <KpiCard label="Articles Blog" value={articles.length} icon={FileText} />
        <KpiCard label="Actualités Publiées" value={news.length} icon={Newspaper} />
        <KpiCard label="Abonnés Newsletter" value={newsletterSubscribers} icon={Mail} />
      </div>

      {/* Visits trend */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-serif text-base font-bold text-[#002366]">Flux des visites</h3>
            <p className="text-xs text-slate-400 font-medium">{periodTotal.toLocaleString('fr-FR')} visites sur la période</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0">
            {(Object.keys(PERIOD_LABELS) as VisitsPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setVisitsPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  visitsPeriod === p ? 'bg-[#002366] text-white shadow-sm' : 'text-slate-500 hover:text-[#002366]'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        {visitsLoading ? (
          <p className="text-xs text-slate-400 text-center py-12">Chargement...</p>
        ) : periodTotal === 0 ? (
          <p className="text-xs text-slate-400 text-center py-12">Aucune visite enregistrée sur cette période.</p>
        ) : (
          <LineAreaChart data={visitsSeries.data} labels={visitsSeries.labels} />
        )}
      </div>

      {/* Requests donut + Reactions donut, paired so neither stretches into a mostly-empty wide card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-[#002366]">Répartition des demandes</h3>
              <p className="text-xs text-slate-400 font-medium">Par type de sollicitation</p>
            </div>
            <Inbox className="w-5 h-5 text-blue-800" />
          </div>
          {requestBreakdown.length > 0 ? (
            <DonutChart data={requestBreakdown} />
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">Aucune demande pour le moment.</p>
          )}
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-[#002366]">Réactions</h3>
              <p className="text-xs text-slate-400 font-medium">Likes, commentaires et partages</p>
            </div>
            <Heart className="w-5 h-5 text-blue-800" />
          </div>
          {engagementStats.likes + engagementStats.comments + engagementStats.shares > 0 ? (
            <DonutChart
              data={[
                { label: 'Likes', value: engagementStats.likes, color: '#002366' },
                { label: 'Commentaires', value: engagementStats.comments, color: '#4169E1' },
                { label: 'Partages', value: engagementStats.shares, color: '#C5A85C' }
              ]}
            />
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">Aucune réaction pour le moment.</p>
          )}
        </div>
      </div>

      {/* Department breakdown + Content overview */}
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
              <h3 className="font-serif text-base font-bold text-[#002366]">Contenu publié</h3>
              <p className="text-xs text-slate-400 font-medium">Aperçu Blog, Actualités & Newsletter</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-sm font-bold text-[#002366]">Blog</p>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">Dernier : {latestArticle?.title || '—'}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-900 shrink-0">{articles.length} articles</span>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-sm font-bold text-[#002366]">Actualités</p>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">Dernière : {latestNews?.title || '—'}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-900 shrink-0">{news.length} publiées</span>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#002366] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-sm font-bold text-[#002366]">Newsletter</p>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">Dernière : {latestNewsletter?.subject || '—'}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-900 shrink-0">{newsletters.length} envoyées</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
