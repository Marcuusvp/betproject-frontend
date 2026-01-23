import { League } from '@/api/types';

export const LEAGUES: League[] = [
  {
    id: 17,
    name: 'Premier League',
    country: 'Inglaterra',
    logo: '/leagues/premier-league.png',
    color: '#37003c',
    totalRounds: 38,
  },
  {
    id: 8,
    name: 'La Liga',
    country: 'Espanha',
    logo: '/leagues/la-liga.png',
    color: '#ee8707',
    totalRounds: 38,
  },
  {
    id: 23,
    name: 'Serie A',
    country: 'Itália',
    logo: '/leagues/serie-a.png',
    color: '#024494',
    totalRounds: 38,
  },
  {
    id: 34,
    name: 'Ligue 1',
    country: 'França',
    logo: '/leagues/ligue-1.png',
    color: '#dae025',
    totalRounds: 34,
  },
  {
    id: 35,
    name: 'Bundesliga',
    country: 'Alemanha',
    logo: '/leagues/bundesliga.png',
    color: '#d20515',
    totalRounds: 34,
  },
  {
    id: 325,
    name: 'Brasileirão',
    country: 'Brasil',
    logo: '/leagues/brasileirao.png',
    color: '#009c3b',
    totalRounds: 38,
  },
  {
    id: 7,
    name: 'Champions League',
    country: 'Europa',
    logo: '/leagues/champions-league.png',
    color: '#00366e',
    totalRounds: 13, // 8 rodadas fase de liga + 5 fases mata-mata
  },
];

export const LEAGUE_SLUGS: Record<number, string> = {
  17: 'premier',
  8: 'laliga',
  23: 'seriea',
  34: 'ligue1',
  35: 'bundesliga',
  325: 'brasileirao',
  7: 'champions-league',
};

export const MATCH_STATUS = {
  NOT_STARTED: 'Not started',
  LIVE: 'Live',
  INPLAY: 'Inplay',
  ENDED: 'Ended',
  FINISHED: 'Finished',
  POSTPONED: 'Postponed',
  CANCELLED: 'Cancelled',
  CANCELED: 'Canceled',
} as const;

export const MATCH_STATUS_LABELS: Record<string, string> = {
  'Not started': 'Agendado',
  'Live': 'Ao Vivo',
  'Inplay': 'Ao Vivo',
  'Ended': 'Encerrado',
  'Finished': 'Finalizado',
  'Postponed': 'Adiado',
  'Cancelled': 'Cancelado',
  'Canceled': 'Cancelado',
};

export const CONFIDENCE_COLORS = {
  High: 'text-green-600 bg-green-50',
  Medium: 'text-yellow-600 bg-yellow-50',
  Low: 'text-red-600 bg-red-50',
};

export const REFRESH_INTERVALS = {
  LIVE_MATCHES: 30000, // 30 segundos
  LEAGUE_MATCHES: 60000, // 1 minuto
  PREDICTIONS: 300000, // 5 minutos
};