import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Trophy } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LiveMatch from '@/components/matches/LiveMatch';
import StandingsTable from '@/components/leagues/StandingsTable';
import { matchesApi } from '@/api/matches';
import { Match, StandingRow } from '@/api/types';
import { LEAGUES } from '@/utils/constants';

// ✅ Mapeamento das fases da UI (9-13) para os IDs reais do SofaScore (TournamentsInfo.cs)
const KNOCKOUT_ROUND_IDS: Record<number, number> = {
  10: 5,  // Oitavas (Round of 16)
  11: 27, // Quartas (Quarterfinals)
  12: 28, // Semifinais (Semifinals)
  13: 29  // Final (Final)
};

const ChampionsLeague = () => {
  const [currentPhase, setCurrentPhase] = useState<number | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingStandings, setLoadingStandings] = useState(true);
  const [logoError, setLogoError] = useState(false);

  const championsLeague = LEAGUES.find(league => league.id === 7);

  const phases = [
    { id: 1, name: 'Rodada 1', type: 'league' },
    { id: 2, name: 'Rodada 2', type: 'league' },
    { id: 3, name: 'Rodada 3', type: 'league' },
    { id: 4, name: 'Rodada 4', type: 'league' },
    { id: 5, name: 'Rodada 5', type: 'league' },
    { id: 6, name: 'Rodada 6', type: 'league' },
    { id: 7, name: 'Rodada 7', type: 'league' },
    { id: 8, name: 'Rodada 8', type: 'league' },
    { id: 9, name: 'Playoffs', type: 'knockout' },
    { id: 10, name: 'Oitavas de Final', type: 'knockout' },
    { id: 11, name: 'Quartas de Final', type: 'knockout' },
    { id: 12, name: 'Semifinal', type: 'knockout' },
    { id: 13, name: 'Final', type: 'knockout' },
  ];

  const currentPhaseInfo = currentPhase !== null ? phases.find(p => p.id === currentPhase) : null;
  const isLeaguePhase = currentPhaseInfo?.type === 'league';

  // 1. Busca Tabela + Define Rodada Inicial
  useEffect(() => {
    const fetchStandings = async () => {
      setLoadingStandings(true);
      try {
        const data = await matchesApi.getStandings('ChampionsLeague');
        setStandings(data);

        if (data && data.length > 0) {
          const maxMatches = Math.max(...data.map(r => r.matches));
          // Define a fase atual com base nos jogos, mas limita a 1 (inicio) se nada jogado
          setCurrentPhase(maxMatches > 0 ? Math.min(maxMatches + 1, 13) : 1);
        } else {
          setCurrentPhase(1);
        }
      } catch (error) {
        console.error("Erro ao carregar tabela:", error);
        setCurrentPhase(1);
      } finally {
        setLoadingStandings(false);
      }
    };

    fetchStandings();
  }, []);

  // 2. Busca Jogos com Lógica Condicional de Fase
  useEffect(() => {
    if (currentPhase === null) return;

    const fetchMatches = async () => {
      setLoadingMatches(true);
      setMatches([]); // Limpa jogos anteriores enquanto carrega
      
      try {
        let data: Match[] = [];

        if (currentPhase <= 8) {
          // Fase de Liga: IDs 1-8 correspondem diretamente aos Rounds 1-8
          data = await matchesApi.getChampionsLeaguePhase(currentPhase);
        } 
        else if (currentPhase === 9) {
          // Playoffs: Usa endpoint específico (Round 636)
          data = await matchesApi.getChampionsLeaguePlayoff();
        } 
        else {
          // Mata-Mata: Traduz o ID da UI (10-13) para o ID real (5, 27, 28, 29)
          const realRoundId = KNOCKOUT_ROUND_IDS[currentPhase];
          if (realRoundId) {
            // Reutiliza o endpoint de fase genérica que aceita ID de round
            data = await matchesApi.getChampionsLeaguePhase(realRoundId);
          }
        }
        
        setMatches(data);
      } catch (error) {
        console.error("Erro ao carregar partidas:", error);
        setMatches([]);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [currentPhase]);

  const handlePreviousPhase = () => {
    setCurrentPhase(prev => prev !== null ? Math.max(1, prev - 1) : 1);
  };

  const handleNextPhase = () => {
    setCurrentPhase(prev => prev !== null ? Math.min(13, prev + 1) : 1);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ backgroundColor: championsLeague ? `${championsLeague.color}15` : '#00366e15' }}
        >
          {championsLeague && !logoError ? (
            <img
              src={championsLeague.logo}
              alt={`${championsLeague.name} logo`}
              className="w-14 h-14 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-3xl">🏆</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {championsLeague?.name || 'UEFA Champions League'}
          </h1>
          <p className="text-gray-500 text-sm">Temporada 2025/2026</p>
        </div>
      </div>

      {/* Seletor de Fase */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousPhase}
            disabled={currentPhase === null || currentPhase === 1}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
              {isLeaguePhase ? 'Fase de Liga' : 'Mata-Mata'}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {currentPhaseInfo?.name || '...'}
            </p>
          </div>

          <button
            onClick={handleNextPhase}
            disabled={currentPhase === null || currentPhase === 13}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots de Navegação */}
        <div className="flex justify-center space-x-1 sm:space-x-2 overflow-x-auto py-2">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className={`h-2 rounded-full transition-all flex-shrink-0 ${
                phase.id === currentPhase
                  ? 'bg-primary-600 w-8'
                  : phase.type === 'league'
                  ? 'bg-blue-200 hover:bg-blue-300 w-2'
                  : 'bg-red-200 hover:bg-red-300 w-2'
              }`}
              title={phase.name}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LADO ESQUERDO: Tabela (Apenas Fase de Liga) */}
        {isLeaguePhase && (
          <div className="w-full lg:w-[40%] order-2 lg:order-1">
            <StandingsTable 
              rows={standings || []} 
              loading={loadingStandings}
              isChampionsLeague={true}
            />
          </div>
        )}

        {/* LADO DIREITO (ou FULL): Jogos */}
        <div className={`w-full ${isLeaguePhase ? 'lg:w-[60%]' : 'w-full'} order-1 lg:order-2`}>
          
          {/* Cabeçalho da Lista de Jogos */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex justify-between items-center sticky top-[80px] z-10 ${!isLeaguePhase ? 'bg-gradient-to-r from-gray-50 to-white' : ''}`}>
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              {isLeaguePhase ? <Calendar className="text-primary-600" size={20} /> : <Trophy className="text-amber-500" size={20} />}
              Jogos - {currentPhaseInfo?.name}
            </h2>

            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              <button 
                onClick={handlePreviousPhase}
                disabled={loadingMatches || currentPhase === null || currentPhase === 1}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNextPhase}
                disabled={loadingMatches || currentPhase === null || currentPhase === 13}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Lista de Jogos */}
          {loadingMatches || currentPhase === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Trophy className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500 font-medium">Os confrontos desta fase ainda não foram definidos.</p>
              <p className="text-gray-400 text-sm mt-1">Aguarde o sorteio ou o término da fase anterior.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${isLeaguePhase ? 'xl:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
              {matches.map((match) => (
                <LiveMatch key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChampionsLeague;