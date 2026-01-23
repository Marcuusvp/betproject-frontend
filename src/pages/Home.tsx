import { useState } from 'react';
import { useLiveMatches } from '@/hooks/useMatches';
import { LEAGUES } from '@/utils/constants';
import Layout from '@/components/layout/Layout';
import LeagueCard from '@/components/leagues/LeagueCard';
import LiveMatch from '@/components/matches/LiveMatch';
import Loading from '@/components/common/Loading';
import { TrendingUp, Trophy, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const { data: liveMatches, isLoading, error } = useLiveMatches();
  const [currentPage, setCurrentPage] = useState(0);
  
  const MATCHES_PER_PAGE = 6;
  const totalPages = liveMatches ? Math.ceil(liveMatches.length / MATCHES_PER_PAGE) : 0;
  const startIndex = currentPage * MATCHES_PER_PAGE;
  const endIndex = startIndex + MATCHES_PER_PAGE;
  const currentMatches = liveMatches?.slice(startIndex, endIndex) || [];

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">⚽ BetProject</h1>
          <p className="text-xl text-primary-100">
            Previsões esportivas inteligentes baseadas em dados reais
          </p>
        </div>
      </section>

      {/* Live Matches Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-red-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Jogos Ao Vivo</h2>
            {!isLoading && liveMatches && liveMatches.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {liveMatches.length}
              </span>
            )}
          </div>

          {/* Navigation Controls */}
          {!isLoading && liveMatches && liveMatches.length > MATCHES_PER_PAGE && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {startIndex + 1}-{Math.min(endIndex, liveMatches.length)} de {liveMatches.length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Próxima página"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoading && <Loading text="Carregando jogos ao vivo..." />}

        {error && (
          <div className="card p-6 border-l-4 border-red-500">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle size={20} />
              <p>Erro ao carregar jogos ao vivo. Tente novamente mais tarde.</p>
            </div>
          </div>
        )}

        {!isLoading && !error && liveMatches && liveMatches.length === 0 && (
          <div className="card p-8 text-center text-gray-500">
            <p>Nenhum jogo ao vivo no momento</p>
          </div>
        )}

        {!isLoading && !error && currentMatches.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMatches.map((match) => (
                <LiveMatch key={match.id} match={match} />
              ))}
            </div>

            {/* Page Indicators */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentPage
                        ? 'bg-red-500 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir para página ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Leagues Section */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="text-primary-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Ligas Monitoradas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEAGUES.map((league) => (
            <LeagueCard key={league.id} league={league} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-lg mb-2">Análise Detalhada</h3>
          <p className="text-gray-600 text-sm">
            Estatísticas completas de todas as partidas
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-bold text-lg mb-2">Previsões Precisas</h3>
          <p className="text-gray-600 text-sm">
            Algoritmos baseados em forma recente dos times
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-bold text-lg mb-2">Tempo Real</h3>
          <p className="text-gray-600 text-sm">
            Acompanhe jogos ao vivo com atualizações instantâneas
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Home;