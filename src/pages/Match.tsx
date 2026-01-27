import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Trophy, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Loading from '@/components/common/Loading';
import { useMatchDetails } from '@/hooks/useMatches';
import { formatMatchDate, isMatchLive, isMatchFinished } from '@/utils/formatters';
import { MatchDetail, MatchStat, Incident } from '@/api/types';

type PeriodTab = 'ALL' | '1ST' | '2ND';

const Match = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const matchId = parseInt(id || '0');
  
  const [activePeriod, setActivePeriod] = useState<PeriodTab>('ALL');
  
  const { data, isLoading, error } = useMatchDetails(matchId);

  if (isLoading) {
    return (
      <Layout>
        <Loading text="Carregando detalhes da partida..." />
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar partida
          </h2>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar os detalhes desta partida
          </p>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        </div>
      </Layout>
    );
  }

  const match = data as MatchDetail;
  const isLive = isMatchLive(match.status);
  const isFinished = isMatchFinished(match.status);
  
  // Detectar se está no primeiro tempo (para desabilitar aba do 2º tempo)
  const isFirstHalf = isLive && match.status?.toLowerCase().includes('1st');
  
  // Filtrar estatísticas por período
  const stats = match.stats || [];
  const filteredStats = stats.filter((s: MatchStat) => s.period === activePeriod);
  
  // Verificar se há dados para cada período
  const hasSecondHalfData = stats.some((s: MatchStat) => s.period === '2ND');

  return (
    <Layout>
      {/* Header com botão voltar */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Voltar</span>
        </button>
      </div>

      {/* Match Header - Placar e Status */}
      <section className="mb-8">
        <div className="card overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-3 ${
            isLive 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : isFinished 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700'
              : 'bg-gradient-to-r from-blue-500 to-blue-600'
          }`}>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Clock size={20} />
                <span className="font-semibold">
                  {isLive ? 'AO VIVO' : isFinished ? 'FINALIZADO' : 'AGENDADO'}
                </span>
                {isLive && (
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
                )}
              </div>
              <div className="text-sm opacity-90">
                {match.tournament} {match.round && `• Rodada ${match.round}`}
              </div>
            </div>
          </div>

          {/* Placar Principal */}
          <div className="p-8">
            <div className="grid grid-cols-[1fr,auto,1fr] gap-8 items-center">
              {/* Time Casa */}
              <div className="text-right">
                <div className="flex items-center justify-end space-x-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                      {match.homeTeam}
                    </h2>
                    {match.stadium && (
                      <p className="text-sm text-gray-500 flex items-center justify-end space-x-1">
                        <Trophy size={14} />
                        <span>{match.stadium}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Placar */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-2">
                  <div className={`text-6xl font-bold ${
                    (match.homeScore || 0) > (match.awayScore || 0) 
                      ? 'text-green-600' 
                      : 'text-gray-900'
                  }`}>
                    {match.homeScore ?? '-'}
                  </div>
                  <div className="text-3xl font-bold text-gray-400">×</div>
                  <div className={`text-6xl font-bold ${
                    (match.awayScore || 0) > (match.homeScore || 0) 
                      ? 'text-green-600' 
                      : 'text-gray-900'
                  }`}>
                    {match.awayScore ?? '-'}
                  </div>
                </div>
                {!isLive && !isFinished && (
                  <p className="text-sm text-gray-500">
                    {formatMatchDate(match.startTime)}
                  </p>
                )}
              </div>

              {/* Time Fora */}
              <div className="text-left">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                      {match.awayTeam}
                    </h2>
                    {match.referee && (
                      <p className="text-sm text-gray-500 flex items-center space-x-1">
                        <Activity size={14} />
                        <span>Árbitro: {match.referee}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            {(match.attendance || isFinished) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
                  {match.attendance && (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Público:</span>
                      <span>{match.attendance.toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                  {isFinished && (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Data:</span>
                      <span>{formatMatchDate(match.startTime)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs de Períodos */}
      <section className="mb-6">
        <div className="card p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActivePeriod('ALL')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activePeriod === 'ALL'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completo
            </button>
            <button
              onClick={() => setActivePeriod('1ST')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activePeriod === '1ST'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1º Tempo
            </button>
            <button
              onClick={() => setActivePeriod('2ND')}
              disabled={isFirstHalf || !hasSecondHalfData}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activePeriod === '2ND'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : isFirstHalf || !hasSecondHalfData
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isFirstHalf ? 'Aguardando segundo tempo' : !hasSecondHalfData ? 'Sem dados do segundo tempo' : ''}
            >
              2º Tempo
              {isFirstHalf && (
                <span className="ml-2 text-xs">(Aguardando)</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Estatísticas
              {activePeriod === '1ST' && ' - Primeiro Tempo'}
              {activePeriod === '2ND' && ' - Segundo Tempo'}
              {activePeriod === 'ALL' && ' - Jogo Completo'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp size={16} />
              <span>{filteredStats.length} métricas</span>
            </div>
          </div>

          {filteredStats.length === 0 ? (
            <div className="text-center py-12">
              <Activity size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {isFirstHalf && activePeriod === '2ND'
                  ? 'Estatísticas do segundo tempo estarão disponíveis após o intervalo'
                  : 'Nenhuma estatística disponível para este período'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredStats.map((stat: MatchStat, index: number) => (
                <StatisticBar
                  key={`${stat.name}-${index}`}
                  label={stat.name}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  homeValue={stat.homeValue}
                  awayValue={stat.awayValue}
                  compareCode={stat.compareCode}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Timeline de Eventos */}
      {match.incidents && match.incidents.length > 0 && (
        <section className="mt-8">
          <div className="card p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Linha do Tempo
            </h3>
            <div className="space-y-3">
              {match.incidents
                .filter((incident: Incident) => {
                  // Filtrar apenas gols e cartões (remover injuryTime, substitution, period)
                  const allowedTypes = ['goal', 'card'];
                  return allowedTypes.includes(incident.incidentType);
                })
                .sort((a: Incident, b: Incident) => {
                  if (a.time !== b.time) return a.time - b.time;
                  return a.addedTime - b.addedTime;
                })
                .map((incident: Incident, index: number) => (
                  <IncidentItem
                    key={index}
                    incident={incident}
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Info Footer */}
      {isLive && (
        <section className="mt-8">
          <div className="card p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <p className="text-sm text-gray-700">
                <strong>Partida ao vivo:</strong> As estatísticas são atualizadas automaticamente a cada 30 segundos
              </p>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

// Componente de Barra de Estatística
interface StatisticBarProps {
  label: string;
  homeTeam: string;
  awayTeam: string;
  homeValue: string;
  awayValue: string;
  compareCode: number;
}

const StatisticBar = ({ 
  label, 
  homeTeam, 
  awayTeam, 
  homeValue, 
  awayValue, 
  compareCode 
}: StatisticBarProps) => {
  const homeNum = parseFloat(homeValue.replace('%', '')) || 0;
  const awayNum = parseFloat(awayValue.replace('%', '')) || 0;
  
  // Se for porcentagem, usar valores diretos
  const isPercentage = homeValue.includes('%');
  const total = isPercentage ? 100 : (homeNum + awayNum);
  const homePercent = isPercentage ? homeNum : (total > 0 ? (homeNum / total) * 100 : 50);
  
  // Determinar cores baseado no compareCode
  const getBarColor = () => {
    if (compareCode === 1) return 'from-green-500 to-green-600';
    if (compareCode === 2) return 'from-red-500 to-red-600';
    return 'from-gray-400 to-gray-500';
  };

  const getTextColor = (isHome: boolean) => {
    if (compareCode === 1 && isHome) return 'text-green-600';
    if (compareCode === 2 && !isHome) return 'text-green-600';
    return 'text-gray-900';
  };

  return (
    <div className="group">
      {/* Labels */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-left flex-1">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            {homeTeam}
          </span>
          <span className={`text-2xl font-bold ${getTextColor(true)}`}>
            {homeValue}
          </span>
        </div>
        
        <div className="text-center px-6">
          <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
            {label}
          </span>
        </div>
        
        <div className="text-right flex-1">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            {awayTeam}
          </span>
          <span className={`text-2xl font-bold ${getTextColor(false)}`}>
            {awayValue}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getBarColor()} transition-all duration-500 ease-out`}
          style={{ width: `${homePercent}%` }}
        />
        {/* Linha divisória central */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/50 transform -translate-x-1/2" />
      </div>
    </div>
  );
};

// Componente de Item de Incidente
interface IncidentItemProps {
  incident: Incident;
  homeTeam: string;
  awayTeam: string;
}

const IncidentItem = ({ incident, homeTeam, awayTeam }: IncidentItemProps) => {
  const getIncidentIcon = () => {
    if (incident.incidentType === 'goal') {
      if (incident.incidentClass === 'penalty') return '⚽🎯';
      if (incident.incidentClass === 'ownGoal') return '⚽❌';
      return '⚽';
    }
    if (incident.incidentClass === 'yellow') return '🟨';
    if (incident.incidentClass === 'red') return '🟥';
    return '📋';
  };

  const getIncidentColor = () => {
    if (incident.incidentType === 'goal') return 'border-green-400 bg-green-50';
    if (incident.incidentClass === 'yellow') return 'border-yellow-400 bg-yellow-50';
    if (incident.incidentClass === 'red') return 'border-red-400 bg-red-50';
    return 'border-gray-300 bg-gray-50';
  };

  const getIncidentLabel = () => {
    if (incident.incidentType === 'goal') {
      if (incident.incidentClass === 'penalty') return 'Gol de Pênalti';
      if (incident.incidentClass === 'ownGoal') return 'Gol Contra';
      return 'Gol';
    }
    if (incident.incidentClass === 'yellow') return 'Cartão Amarelo';
    if (incident.incidentClass === 'red') return 'Cartão Vermelho';
    return 'Evento';
  };

  const team = incident.isHome ? homeTeam : awayTeam;
  const timeDisplay = incident.addedTime > 0 
    ? `${incident.time}+${incident.addedTime}'` 
    : `${incident.time}'`;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${getIncidentColor()} transition-all hover:shadow-md`}>
      {/* Ícone */}
      <div className="text-4xl flex-shrink-0">
        {getIncidentIcon()}
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-lg mb-1">
              {incident.playerName || 'Jogador não identificado'}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
              <span className="font-medium">{team}</span>
              <span className="text-gray-400">•</span>
              <span className="px-2 py-0.5 bg-white rounded-full text-xs font-semibold">
                {getIncidentLabel()}
              </span>
            </div>
            {incident.assistName && (
              <div className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                <span>🎯</span>
                <span>Assistência: <strong>{incident.assistName}</strong></span>
              </div>
            )}
          </div>
          
          {/* Tempo */}
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold text-gray-400">
              {timeDisplay}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {incident.time <= 45 ? '1º Tempo' : '2º Tempo'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Match;