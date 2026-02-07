// Types baseados na sua API .NET

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  startTime: string;
  tournament?: string;
  round?: number;
}

export interface MatchDetail extends Match {
  stadium?: string;
  referee?: string;
  attendance?: number;
  stats: MatchStat[];
  incidents: Incident[];
}

export interface MatchStat {
  period: string;
  name: string;
  homeValue: string;
  awayValue: string;
  compareCode: number;
}

export interface Incident {
  incidentType: string;
  incidentClass?: string;
  time: number;
  addedTime: number;
  isHome: boolean;
  playerName?: string;
  assistName?: string;
}

export interface TeamFormAnalysis {
  gamesAnalyzed: number;
  context: string;
  offensive: OffensiveMetrics;
  defensive: DefensiveMetrics;
  discipline: DisciplineMetrics;
  results: ResultMetrics;
}

export interface OffensiveMetrics {
  avgGoalsScored: number;
  avgShotsOnTarget: number;
  goalsFirstHalf: number;
  goalsSecondHalf: number;
  scoredFirstCount: number;
}

export interface DefensiveMetrics {
  avgGoalsConceded: number;
  cleanSheets: number;
  goalsConcededFirstHalf: number;
  goalsConcededSecondHalf: number;
  concededFirstCount: number;
}

export interface DisciplineMetrics {
  avgYellowCards: number;
  avgRedCards: number;
  avgTotalCards: number;
  avgFoulsCommitted: number;
  totalYellowCards: number;
  totalRedCards: number;
}

export interface ResultMetrics {
  wins: number;
  draws: number;
  losses: number;
  winPercentage: number;
  gamesPlayed: number;
}

export interface MatchPrediction {
  match: MatchInfo;
  homeTeamAnalysis: TeamFormAnalysis;
  awayTeamAnalysis: TeamFormAnalysis;
  predictions: PredictionResults;
  confidence: string;
  warnings: string[];
}

export interface MatchInfo {
  id: number;
  homeTeam: string;
  awayTeam: string;
  tournament: string;
  round: number;
  dateTime: string;
}

export interface PredictionResults {
  result: ResultPrediction;
  goals: GoalsPrediction;
  firstGoal: FirstGoalPrediction;
  halfTime: HalfTimePrediction;
  cards: CardsPrediction;
}

export interface ResultPrediction {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export interface GoalsPrediction {
  over25: number;
  under25: number;
  btts: number;
}

export interface FirstGoalPrediction {
  homeTeam: number;
  awayTeam: number;
  reasoning: string;
}

export interface HalfTimePrediction {
  homeLeading: number;
  draw: number;
  awayLeading: number;
}

export interface CardsPrediction {
  expectedTotalCards: number;
  over35Cards: number;
  under35Cards: number;
  mostDisciplinedTeam: string;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  color: string;
  currentRound?: number;
  totalRounds: number;
}

export interface Tournament {
  name: string;
  id: number;
}

export interface Promotion {
  text: string;
  id: number;
}

export interface StandingRow {
  position: number;
  team: { 
    id: number; 
    name: string;
  };
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  scoresFor: number;
  scoresAgainst: number;
  points: number;
  promotion?: Promotion | null;
  updatedAt: string;
}

export interface StandingsTable {
  tournament: Tournament;
  type: string;
  rows: StandingRow[];
}
export interface MatchesResponseWithInfo {
  message: string;
  tournament: string;
  round?: number;
  matches: Match[];
}

// Union Type: A API pode retornar Array OU Envelope
export type ApiMatchesResponse = Match[] | MatchesResponseWithInfo;

// Tipo Normalizado: O que o componente vai receber (limpo e padronizado)
export interface NormalizedMatchesResult {
  matches: Match[];
  message?: string;
}