import React from 'react';
import Header from '../layout/Header';
import { useStats } from '../../hooks/useStats';
import LoadingSpinner from '../common/LoadingSpinner';

const Insights: React.FC = () => {
  const { data: stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center text-zinc-500">Failed to load statistics</div>
        </div>
      </div>
    );
  }

  const maxStatusCount = Math.max(...Object.values(stats.statusCounts), 1);
  const maxSkillCount = Math.max(...stats.topSkills.map(s => s.count), 1);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <main className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight mb-2">Insights</h1>
          <p className="text-zinc-500 text-sm">A deep dive into your job application funnel and skill demand.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-up">
          <StatCard 
            label="Total Applications" 
            value={stats.totalApplications} 
            sub="Lifetime tracked" 
          />
          <StatCard 
            label="Active Search" 
            value={stats.activeApplications} 
            sub="Under consideration" 
          />
          <StatCard 
            label="Success Rate" 
            value={`${Math.round((stats.statusCounts.Offer / (stats.totalApplications || 1)) * 100)}%`} 
            sub="Offers per application" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Funnel Chart */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-8">
            <h3 className="text-[13px] font-semibold text-zinc-900 uppercase tracking-wider mb-8">Application Funnel</h3>
            <div className="space-y-6">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">{status}</span>
                    <span className="font-medium text-zinc-950">{count}</span>
                  </div>
                  <div className="h-2 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                    <div 
                      className="h-full bg-zinc-950 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Skills */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-8">
            <h3 className="text-[13px] font-semibold text-zinc-900 uppercase tracking-wider mb-8">Skill Demand</h3>
            {stats.topSkills.length > 0 ? (
              <div className="space-y-4">
                {stats.topSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-4">
                    <span className="text-sm text-zinc-700 w-24 shrink-0 truncate">{skill.name}</span>
                    <div className="flex-1 h-8 bg-zinc-50 rounded-md border border-zinc-100 relative group overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-zinc-200/50 transition-all duration-1000 ease-out group-hover:bg-zinc-300/50"
                        style={{ width: `${(skill.count / maxSkillCount) * 100}%` }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-zinc-500">
                        {skill.count} entries
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <p className="text-zinc-400 text-sm">No skill data available yet.</p>
                <p className="text-zinc-300 text-xs mt-1">AI-parsed skills will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; sub: string }> = ({ label, value, sub }) => (
  <div className="bg-white border border-zinc-200 rounded-2xl p-6">
    <p className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
    <h4 className="text-3xl font-bold text-zinc-950 tracking-tight mb-1">{value}</h4>
    <p className="text-[11px] text-zinc-400">{sub}</p>
  </div>
);

export default Insights;
