import api from './axios';
import { Match, MatchDetail } from './types';

export const matchesApi = {
  // Busca jogos ao vivo
  getLive: async (): Promise<Match[]> => {
    const { data } = await api.get('/matches/live');
    return data;
  },

  // Busca jogos de uma rodada específica
  getByRound: async (
    tournamentName: string,
    round: number
  ): Promise<Match[]> => {
    const { data } = await api.get(
      `/matches/tournament/${tournamentName}/round/${round}`
    );
    return data;
  },

  // Busca detalhes completos de uma partida
  getDetails: async (matchId: number): Promise<MatchDetail> => {
    const { data } = await api.get(`/matches/${matchId}/details`);
    return data.match || data;
  },

  // Champions League - Fase de Liga (rodadas 1-8)
  getChampionsLeaguePhase: async (phaseId: number): Promise<Match[]> => {
    const { data } = await api.get(`/matches/champions-league/phase/${phaseId}`);
    return data;
  },

  // Champions League - Qualificação
  getChampionsLeagueQualification: async (round: number): Promise<Match[]> => {
    const { data } = await api.get(
      `/matches/champions-league/qualification/${round}`
    );
    return data;
  },

  // Champions League - Playoff
  getChampionsLeaguePlayoff: async (): Promise<Match[]> => {
    const { data } = await api.get('/matches/champions-league/playoff');
    return data;
  },
};