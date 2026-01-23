import { useQuery } from '@tanstack/react-query';
import { matchesApi } from '@/api/matches';
import { REFRESH_INTERVALS } from '@/utils/constants';

export const useLiveMatches = () => {
  return useQuery({
    queryKey: ['matches', 'live'],
    queryFn: matchesApi.getLive,
    refetchInterval: REFRESH_INTERVALS.LIVE_MATCHES,
    refetchIntervalInBackground: true,
  });
};

export const useLeagueMatches = (tournamentName: string, round: number) => {
  return useQuery({
    queryKey: ['matches', tournamentName, round],
    queryFn: () => matchesApi.getByRound(tournamentName, round),
    enabled: !!tournamentName && round > 0,
    refetchInterval: REFRESH_INTERVALS.LEAGUE_MATCHES,
  });
};

export const useMatchDetails = (matchId: number) => {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: () => matchesApi.getDetails(matchId),
    enabled: matchId > 0,
  });
};

export const useChampionsLeaguePhase = (phaseId: number) => {
  return useQuery({
    queryKey: ['champions-league', 'phase', phaseId],
    queryFn: () => matchesApi.getChampionsLeaguePhase(phaseId),
    enabled: phaseId > 0,
  });
};