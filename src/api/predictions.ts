import api from './axios';
import { MatchPrediction } from './types';

export const predictionsApi = {
  // Gera previsão para uma partida
  getMatchPrediction: async (matchId: number): Promise<MatchPrediction> => {
    const { data } = await api.get(`/predictions/match/${matchId}`);
    return data;
  },

  // Busca configurações do sistema de previsão
  getSettings: async () => {
    const { data } = await api.get('/predictions/settings');
    return data;
  },
};