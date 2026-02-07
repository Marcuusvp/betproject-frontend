import { useState, useEffect } from 'react';
import { TrendingUp, Award, Target, BarChart3, Activity } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Loading from '@/components/common/Loading';
import { useMatchDetails } from '@/hooks/useMatches';
import { useLiveMatches } from '@/hooks/useMatches';

const Statistics = () => {
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  
  const { data: liveMatches, isLoading: loadingMatches } = useLiveMatches();
  const { data: matchDetails, isLoading: loadingDetails } = useMatchDetails(selectedMatchId || 0);

  // Auto-seleciona a primeira partida disponível
  useEffect(() => {
    if (!selectedMatchId && liveMatches && liveMatches.length > 0) {
      setSelectedMatchId(liveMatches[0].id);
    }
  }, [liveMatches, selectedMatchId]);

  if (loadingMatches) {
    return (
      <Layout>
        <Loading text="Carregando estatísticas..." />
      </Layout>
    );
  }

  if (!liveMatches || liveMatches.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Nenhuma partida disponível
          </h2>
          <p className="text-gray-600">
            Selecione uma partida na página inicial para ver suas estatísticas
          </p>
        </div>
      </Layout>
    );
  }

  const selectedMatch = liveMatches.find(m => m.id === selectedMatchId);

  return (
    <Layout>
      {/* Header with Match Selector */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <BarChart3 size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Estatísticas</h1>
                <p className="text-gray-300 text-lg mt-1">Análise detalhada das partidas</p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'overview'
                    ? 'bg-white text-gray-900 font-semibold shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'detailed'
                    ? 'bg-white text-gray-900 font-semibold shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Detalhado
              </button>
            </div>
          </div>

          {/* Match Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveMatches.map((match) => (
              <button
                key={match.id}
                onClick={() => setSelectedMatchId(match.id)}
                className={`p-4 rounded-xl transition-all text-left ${
                  match.id === selectedMatchId
                    ? 'bg-white text-gray-900 shadow-xl scale-105'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium opacity-75">
                    {match.tournament}
                  </span>
                  {match.status === 'Live' && (
                    <span className="flex items-center text-xs font-bold text-red-500">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                      AO VIVO
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${match.id === selectedMatchId ? 'text-gray-900' : 'text-white'}`}>
                      {match.homeTeam}
                    </span>
                    <span className={`text-2xl font-bold ${match.id === selectedMatchId ? 'text-gray-900' : 'text-white'}`}>
                      {match.homeScore ?? '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${match.id === selectedMatchId ? 'text-gray-900' : 'text-white'}`}>
                      {match.awayTeam}
                    </span>
                    <span className={`text-2xl font-bold ${match.id === selectedMatchId ? 'text-gray-900' : 'text-white'}`}>
                      {match.awayScore ?? '-'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Content */}
      {selectedMatch && (
        <>
          {viewMode === 'overview' ? (
            <OverviewStatistics match={selectedMatch} details={matchDetails} isLoading={loadingDetails} />
          ) : (
            <DetailedStatistics match={selectedMatch} details={matchDetails} isLoading={loadingDetails} />
          )}
        </>
      )}
    </Layout>
  );
};

// Overview Statistics Component
const OverviewStatistics = ({ match, details, isLoading }: any) => {
  if (isLoading) {
    return <Loading text="Carregando estatísticas da partida..." />;
  }

  if (!details || !details.Match) {
    return (
      <div className="card p-8 text-center">
        <Activity size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Estatísticas não disponíveis para esta partida</p>
      </div>
    );
  }

  const stats = details.Match.stats || [];
  const allPeriodStats = stats.filter((s: any) => s.period === 'ALL');

  // Estatísticas principais
  const getStat = (name: string) => allPeriodStats.find((s: any) => s.name === name);
  
  const possession = getStat('Ball possession');
  const shotsOnTarget = getStat('Shots on target');
  const totalShots = getStat('Total shots');
  const fouls = getStat('Fouls');
  const corners = getStat('Corner kicks');
  const yellowCards = getStat('Yellow cards');
  const redCards = getStat('Red cards');

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Posse de Bola"
          homeValue={possession?.homeValue || '0'}
          awayValue={possession?.awayValue || '0'}
          unit="%"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Chutes ao Gol"
          homeValue={shotsOnTarget?.homeValue || '0'}
          awayValue={shotsOnTarget?.awayValue || '0'}
          color="green"
        />
        <StatCard
          icon={Activity}
          label="Total de Chutes"
          homeValue={totalShots?.homeValue || '0'}
          awayValue={totalShots?.awayValue || '0'}
          color="purple"
        />
        <StatCard
          icon={Award}
          label="Escanteios"
          homeValue={corners?.homeValue || '0'}
          awayValue={corners?.awayValue || '0'}
          color="orange"
        />
      </div>

      {/* Detailed Stats Comparison */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Comparação Detalhada</h3>
        <div className="space-y-4">
          {allPeriodStats.map((stat: any, index: number) => (
            <StatBar
              key={index}
              label={stat.name}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeValue={stat.homeValue}
              awayValue={stat.awayValue}
              compareCode={stat.compareCode}
            />
          ))}
        </div>
      </div>

      {/* Discipline Stats */}
      {(yellowCards || redCards || fouls) && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Disciplina</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fouls && (
              <DisciplineCard
                label="Faltas"
                homeValue={fouls.homeValue}
                awayValue={fouls.awayValue}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                color="yellow"
              />
            )}
            {yellowCards && (
              <DisciplineCard
                label="Cartões Amarelos"
                homeValue={yellowCards.homeValue}
                awayValue={yellowCards.awayValue}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                color="yellow"
              />
            )}
            {redCards && (
              <DisciplineCard
                label="Cartões Vermelhos"
                homeValue={redCards.homeValue}
                awayValue={redCards.awayValue}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                color="red"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Detailed Statistics Component
const DetailedStatistics = ({ match, details, isLoading }: any) => {
  if (isLoading) {
    return <Loading text="Carregando estatísticas detalhadas..." />;
  }

  if (!details || !details.Match) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">Estatísticas detalhadas não disponíveis</p>
      </div>
    );
  }

  const stats = details.Match.stats || [];
  const incidents = details.Match.incidents || [];

  // Organiza stats por período
  const periods = ['1ST', '2ND', 'ALL'];
  const statsByPeriod = periods.reduce((acc, period) => {
    acc[period] = stats.filter((s: any) => s.period === period);
    return acc;
  }, {} as Record<string, any[]>);

  // Organiza incidentes por tipo (usado em futuras implementações)
  void incidents.filter((i: any) => i.incidentType === 'goal');
  void incidents.filter((i: any) => i.incidentType === 'card');

  return (
    <div className="space-y-6">
      {/* Timeline of Events */}
      {incidents.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Linha do Tempo</h3>
          <div className="space-y-3">
            {incidents
              .sort((a: any, b: any) => a.time - b.time)
              .map((incident: any, index: number) => (
                <IncidentCard key={index} incident={incident} match={match} />
              ))}
          </div>
        </div>
      )}

      {/* Stats by Period */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {periods.map((period) => (
          <div key={period} className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {period === 'ALL' ? 'Total' : period === '1ST' ? '1º Tempo' : '2º Tempo'}
            </h3>
            <div className="space-y-3">
              {statsByPeriod[period]?.map((stat: any, index: number) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-gray-700 mb-1">{stat.name}</div>
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${stat.compareCode === 1 ? 'text-green-600' : 'text-gray-900'}`}>
                      {stat.homeValue}
                    </span>
                    <span className="text-gray-400">vs</span>
                    <span className={`font-bold ${stat.compareCode === 2 ? 'text-green-600' : 'text-gray-900'}`}>
                      {stat.awayValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, homeValue, awayValue, unit = '', color }: any) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const homeNum = parseFloat(homeValue) || 0;
  const awayNum = parseFloat(awayValue) || 0;
  const total = homeNum + awayNum;
  const homePercent = total > 0 ? (homeNum / total) * 100 : 50;

  return (
    <div className="card p-4 hover:shadow-lg transition-all">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} mb-3`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-2xl font-bold text-gray-900">{homeValue}{unit}</span>
        <span className="text-2xl font-bold text-gray-900">{awayValue}{unit}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorMap[color as keyof typeof colorMap]} transition-all`}
          style={{ width: `${homePercent}%` }}
        />
      </div>
    </div>
  );
};

// Stat Bar Component
const StatBar = ({ label, homeTeam, awayTeam, homeValue, awayValue, compareCode }: any) => {
  const homeNum = parseFloat(homeValue) || 0;
  const awayNum = parseFloat(awayValue) || 0;
  const total = homeNum + awayNum;
  const homePercent = total > 0 ? (homeNum / total) * 100 : 50;

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span className="font-medium">{homeTeam}</span>
        <span className="font-semibold text-gray-900">{label}</span>
        <span className="font-medium">{awayTeam}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-lg font-bold w-12 text-right ${compareCode === 1 ? 'text-green-600' : 'text-gray-900'}`}>
          {homeValue}
        </span>
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              compareCode === 1 ? 'bg-green-500' : compareCode === 2 ? 'bg-red-500' : 'bg-gray-400'
            }`}
            style={{ width: `${homePercent}%` }}
          />
        </div>
        <span className={`text-lg font-bold w-12 ${compareCode === 2 ? 'text-green-600' : 'text-gray-900'}`}>
          {awayValue}
        </span>
      </div>
    </div>
  );
};

// Discipline Card Component
const DisciplineCard = ({ label, homeValue, awayValue, homeTeam, awayTeam, color }: any) => {
  return (
    <div className={`p-4 rounded-lg border-2 ${color === 'yellow' ? 'border-yellow-400 bg-yellow-50' : 'border-red-400 bg-red-50'}`}>
      <div className="text-center mb-3">
        <div className={`text-sm font-semibold ${color === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>
          {label}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <div className={`text-3xl font-bold ${color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
            {homeValue}
          </div>
          <div className="text-xs text-gray-600 mt-1 truncate px-2">{homeTeam}</div>
        </div>
        <div className="text-gray-400 font-bold">vs</div>
        <div className="text-center flex-1">
          <div className={`text-3xl font-bold ${color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
            {awayValue}
          </div>
          <div className="text-xs text-gray-600 mt-1 truncate px-2">{awayTeam}</div>
        </div>
      </div>
    </div>
  );
};

// Incident Card Component
const IncidentCard = ({ incident, match }: any) => {
  const getIncidentIcon = () => {
    if (incident.incidentType === 'goal') return '⚽';
    if (incident.incidentClass === 'yellow') return '🟨';
    if (incident.incidentClass === 'red') return '🟥';
    return '🔔';
  };

  const getIncidentColor = () => {
    if (incident.incidentType === 'goal') return 'border-green-400 bg-green-50';
    if (incident.incidentClass === 'yellow') return 'border-yellow-400 bg-yellow-50';
    if (incident.incidentClass === 'red') return 'border-red-400 bg-red-50';
    return 'border-gray-300 bg-gray-50';
  };

  const team = incident.isHome ? match.homeTeam : match.awayTeam;
  const timeDisplay = incident.addedTime > 0 
    ? `${incident.time}+${incident.addedTime}'` 
    : `${incident.time}'`;

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg border-l-4 ${getIncidentColor()}`}>
      <div className="text-3xl">{getIncidentIcon()}</div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900">
          {incident.playerName || 'Jogador não identificado'}
        </div>
        <div className="text-sm text-gray-600">
          {team} • {timeDisplay}
        </div>
        {incident.assistName && (
          <div className="text-xs text-gray-500 mt-1">
            Assistência: {incident.assistName}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-400">{timeDisplay}</div>
    </div>
  );
};

export default Statistics;