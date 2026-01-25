import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LiveMatch from '@/components/matches/LiveMatch';
import StandingsTable from '@/components/leagues/StandingsTable';
import { matchesApi } from '@/api/matches';
import { Match, StandingsTable as StandingsType } from '@/api/types';
import { LEAGUES } from '@/utils/constants';

const ChampionsLeague = () => {
  const [currentPhase, setCurrentPhase] = useState<number | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingsType | null>(null);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingStandings, setLoadingStandings] = useState(true);
  const [logoError, setLogoError] = useState(false);

  // Busca a liga da Champions
  const championsLeague = LEAGUES.find(league => league.id === 7);

  // Definição das fases
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
    { id: 10, name: 'Oitavas', type: 'knockout' },
    { id: 11, name: 'Quartas', type: 'knockout' },
    { id: 12, name: 'Semi-Final', type: 'knockout' },
    { id: 13, name: 'Final', type: 'knockout' },
  ];

  const currentPhaseInfo = currentPhase !== null ? phases.find(p => p.id === currentPhase) : null;
  const isLeaguePhase = currentPhaseInfo?.type === 'league';

  // 1. Busca Tabela + Define Rodada Inicial (igual à página de ligas)
  useEffect(() => {
    const fetchStandings = async () => {
      setLoadingStandings(true);
      try {
        const data = await matchesApi.getStandings('ChampionsLeague');
        setStandings(data);

        // ✅ Lógica automática: Pega o maior número de jogos jogados na tabela
        if (data.rows && data.rows.length > 0) {
          const maxMatches = Math.max(...data.rows.map(r => r.matches));
          // Na Champions, cada rodada = 1 jogo, então a rodada atual é o número de jogos
          setCurrentPhase(maxMatches > 0 ? maxMatches : 1);
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

  // 2. Busca Jogos quando a Fase muda (igual à página de ligas)
  useEffect(() => {
    if (currentPhase === null) return;

    const fetchMatches = async () => {
      setLoadingMatches(true);
      try {
        const data = await matchesApi.getChampionsLeaguePhase(currentPhase);
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
        {/* Logo da Champions League */}
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

      {/* Phase Selector */}
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
            <p className="text-sm text-gray-500">
              {isLeaguePhase ? 'Fase de Liga' : 'Fase Eliminatória'}
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

        {/* Phase Navigation Dots */}
        <div className="flex justify-center space-x-2">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className={`w-2 h-2 rounded-full transition-all ${
                phase.id === currentPhase
                  ? 'bg-primary-600 w-8'
                  : phase.id <= 8
                  ? 'bg-blue-300 hover:bg-blue-400'
                  : 'bg-red-300 hover:bg-red-400'
              }`}
              title={phase.name}
            />
          ))}
        </div>
      </div>

      {/* Layout: Tabela (esquerda) + Jogos (direita) */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LADO ESQUERDO: Tabela (Desktop: 40%) - Apenas na Fase de Liga */}
        {isLeaguePhase && (
          <div className="w-full lg:w-[40%] order-2 lg:order-1">
            <StandingsTable 
              rows={standings?.rows || []} 
              loading={loadingStandings}
              isChampionsLeague={true}
            />
          </div>
        )}

        {/* LADO DIREITO: Jogos (Desktop: 60% ou 100% se knockout) */}
        <div className={`w-full ${isLeaguePhase ? 'lg:w-[60%]' : ''} order-1 lg:order-2`}>
          
          {/* Cabeçalho das Partidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex justify-between items-center sticky top-[80px] z-10">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Calendar className="text-primary-600" size={20} />
              {currentPhaseInfo?.name || '...'}
            </h2>

            {/* Controles de navegação */}
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
            <div className="grid grid-cols-1 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">Nenhuma partida encontrada para esta fase</p>
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

      {/* Info Card */}
      <section className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg mb-3">ℹ️ Sobre o Novo Formato</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Fase de Liga (Rodadas 1-8):</strong> 36 times jogam 8 partidas cada.
              Os 8 primeiros vão direto às oitavas. Do 9º ao 24º jogam playoffs.
            </p>
            <p>
              <strong>Fase Eliminatória:</strong> Jogos de ida e volta até a final,
              que é em jogo único.
            </p>
            <p>
              <strong>Critérios de Desempate:</strong> 1) Pontos, 2) Saldo de gols, 
              3) Gols marcados, 4) Vitórias, 5) Confronto direto.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChampionsLeague;