import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LiveMatch from '@/components/matches/LiveMatch';
import Loading from '@/components/common/Loading';
import { useLeagueMatches } from '@/hooks/useMatches';
import { LEAGUES, LEAGUE_SLUGS } from '@/utils/constants';

const League = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Encontra a liga pelo slug
  const leagueId = Object.entries(LEAGUE_SLUGS).find(
    ([_, s]) => s === slug
  )?.[0];
  
  const league = LEAGUES.find((l) => l.id === Number(leagueId));
  
  const [currentRound, setCurrentRound] = useState(1);
  
  const { data: matches, isLoading, error } = useLeagueMatches(
    slug || '',
    currentRound
  );

  if (!league) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Liga não encontrada</h2>
        </div>
      </Layout>
    );
  }

  const handlePreviousRound = () => {
    if (currentRound > 1) {
      setCurrentRound(currentRound - 1);
    }
  };

  const handleNextRound = () => {
    if (currentRound < league.totalRounds) {
      setCurrentRound(currentRound + 1);
    }
  };

  return (
    <Layout>
      {/* League Header */}
      <section className="mb-8">
        <div
          className="rounded-xl p-8 text-white"
          style={{ background: `linear-gradient(135deg, ${league.color} 0%, ${league.color}dd 100%)` }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl">
              {league.logo}
            </div>
            <div>
              <h1 className="text-4xl font-bold">{league.name}</h1>
              <p className="text-xl opacity-90">{league.country}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Round Navigation */}
      <section className="mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousRound}
              disabled={currentRound === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={20} />
              <span>Rodada Anterior</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">Rodada</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentRound} de {league.totalRounds}
              </p>
            </div>

            <button
              onClick={handleNextRound}
              disabled={currentRound === league.totalRounds}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span>Próxima Rodada</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Matches */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Partidas da Rodada {currentRound}
        </h2>

        {isLoading && <Loading text="Carregando partidas..." />}

        {error && (
          <div className="card p-6 border-l-4 border-red-500">
            <p className="text-red-600">
              Erro ao carregar partidas. Tente novamente mais tarde.
            </p>
          </div>
        )}

        {!isLoading && !error && matches && matches.length === 0 && (
          <div className="card p-8 text-center text-gray-500">
            <p>Nenhuma partida encontrada para esta rodada</p>
          </div>
        )}

        {!isLoading && !error && matches && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <LiveMatch key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* Placeholder para Tabela de Classificação */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Classificação
        </h2>
        <div className="card p-8 text-center text-gray-500">
          <p>Tabela de classificação será implementada em breve</p>
        </div>
      </section>
    </Layout>
  );
};

export default League;