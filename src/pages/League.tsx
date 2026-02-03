import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { matchesApi } from '@/api/matches';
import { Match, StandingRow, StandingsTable as StandingsType } from '@/api/types';
import Layout from '@/components/layout/Layout';
import StandingsTable from '@/components/leagues/StandingsTable';
import LiveMatch from '@/components/matches/LiveMatch';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { LEAGUES, LEAGUE_SLUGS } from '@/utils/constants';

const League = () => {
  const { slug } = useParams<{ slug: string }>();
  const leagueSlug = slug || 'premier-league';

  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentRound, setCurrentRound] = useState<number | null>(null);
  const [loadingStandings, setLoadingStandings] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // 🔥 CORRIGIDO: Busca a liga pelo slug usando LEAGUE_SLUGS reverso
  const currentLeague = LEAGUES.find(league => {
    const leagueSlugFromId = LEAGUE_SLUGS[league.id];
    return leagueSlugFromId?.toLowerCase() === leagueSlug.toLowerCase();
  });

  // Reset logo error quando mudar de liga
  useEffect(() => {
    setLogoError(false);
  }, [leagueSlug]);

  // 1. Busca Tabela + Define Rodada Inicial
  useEffect(() => {
    const fetchStandings = async () => {
      setLoadingStandings(true);
      try {
        const data = await matchesApi.getStandings(leagueSlug);
        setStandings(data);

        // Lógica automática: Pega o maior número de jogos jogados na tabela
        if (data && data.length > 0) {
           const maxMatches = Math.max(...data.map(r => r.matches));
           setCurrentRound(maxMatches > 0 ? maxMatches : 1);
        } else {
           setCurrentRound(1);
        }
      } catch (error) {
        console.error("Erro ao carregar tabela:", error);
        setCurrentRound(1);
      } finally {
        setLoadingStandings(false);
      }
    };

    fetchStandings();
  }, [leagueSlug]);

  // 2. Busca Jogos quando a Rodada muda
  useEffect(() => {
    if (currentRound === null) return;

    const fetchRound = async () => {
      setLoadingMatches(true);
      try {
        const data = await matchesApi.getByRound(leagueSlug, currentRound);
        setMatches(data);
      } catch (error) {
        console.error("Erro ao carregar rodada:", error);
        setMatches([]);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchRound();
  }, [leagueSlug, currentRound]);

  const handlePrev = () => setCurrentRound(p => p !== null ? Math.max(1, p - 1) : 1);
  const handleNext = () => setCurrentRound(p => p !== null ? p + 1 : 1);

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 flex items-center gap-4">
        {/* Logo da Liga */}
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ backgroundColor: currentLeague ? `${currentLeague.color}15` : '#f3f4f6' }}
        >
          {currentLeague && !logoError ? (
            <img
              src={currentLeague.logo}
              alt={`${currentLeague.name} logo`}
              className="w-14 h-14 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-3xl">⚽</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentLeague?.name || leagueSlug.replace(/-/g, ' ')}
          </h1>
          <p className="text-gray-500 text-sm">
            {currentLeague?.country || 'Temporada 2024/2025'}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LADO ESQUERDO: Tabela (Desktop: 40%) */}
        <div className="w-full lg:w-[40%] order-2 lg:order-1">
           <StandingsTable rows={standings || []} loading={loadingStandings} />
        </div>

        {/* LADO DIREITO: Jogos (Desktop: 60%) */}
        <div className="w-full lg:w-[60%] order-1 lg:order-2">

          {/* Controle de Rodada */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex justify-between items-center sticky top-[80px] z-10">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Calendar className="text-primary-600" size={20} />
              Rodada {currentRound ?? '...'}
            </h2>

            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              <button 
                onClick={handlePrev}
                disabled={loadingMatches || currentRound === null || currentRound === 1}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                disabled={loadingMatches || currentRound === null}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Lista de Jogos */}
          {loadingMatches || currentRound === null ? (
             <div className="grid grid-cols-1 gap-4">
                {[1,2,3].map(i => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {matches.length > 0 ? (
                matches.map(match => (
                  <LiveMatch key={match.id} match={match} />
                ))
              ) : (
                <div className="col-span-2 py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Nenhum jogo encontrado nesta rodada.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default League;
