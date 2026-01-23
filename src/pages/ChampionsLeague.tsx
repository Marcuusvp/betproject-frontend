import { useState } from 'react';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LiveMatch from '@/components/matches/LiveMatch';
import Loading from '@/components/common/Loading';
import { useChampionsLeaguePhase } from '@/hooks/useMatches';

const ChampionsLeague = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  
  const { data: matches, isLoading, error } = useChampionsLeaguePhase(currentPhase);

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

  const currentPhaseInfo = phases.find(p => p.id === currentPhase);
  const isLeaguePhase = currentPhaseInfo?.type === 'league';

  const handlePreviousPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const handleNextPhase = () => {
    if (currentPhase < 13) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="mb-8">
        <div
          className="rounded-xl p-8 text-white"
          style={{ background: 'linear-gradient(135deg, #00366e 0%, #001f3f 100%)' }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Trophy size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">UEFA Champions League</h1>
              <p className="text-xl opacity-90">Temporada 2025/2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Phase Selector */}
      <section className="mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePreviousPhase}
              disabled={currentPhase === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={20} />
              <span>Anterior</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                {isLeaguePhase ? 'Fase de Liga' : 'Fase Eliminatória'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {currentPhaseInfo?.name}
              </p>
            </div>

            <button
              onClick={handleNextPhase}
              disabled={currentPhase === 13}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span>Próxima</span>
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
      </section>

      {/* Matches */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Partidas - {currentPhaseInfo?.name}
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
            <p>Nenhuma partida encontrada para esta fase</p>
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

      {/* Info Card */}
      <section className="mt-8">
        <div className="card p-6">
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChampionsLeague;