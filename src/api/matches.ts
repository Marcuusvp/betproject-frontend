import api from './axios';
import { ApiMatchesResponse, Match, MatchDetail, NormalizedMatchesResult, StandingRow } from './types';

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
      `/matches/ChampionsLeague/qualification/${round}`
    );
    return data;
  },

  getChampionsLeagueKnockout: async (roundId: number): Promise<NormalizedMatchesResult> => {
    // 1. Tipamos o GET com o Union Type (Array | Envelope)
    const { data } = await api.get<ApiMatchesResponse>(`/matches/champions-league/playoff/${roundId}`);

    // 2. Type Guard: Verificamos se é um Array
    if (Array.isArray(data)) {
      return { matches: data };
    }

    // 3. Se não for array, o TypeScript infere que é MatchesResponseWithInfo
    return { 
      matches: data.matches, 
      message: data.message 
    };
  },

  getStandings: async (tournamentName: string): Promise<StandingRow[]> => {
    // Note: O endpoint no backend espera o nome da liga (ex: PremierLeague)
    const { data } = await api.get(`/matches/tournament/${tournamentName}/standings`);
    return data;
  },

};