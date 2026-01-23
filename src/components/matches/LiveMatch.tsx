import { Link } from 'react-router-dom';
import { Match } from '@/api/types';
import { formatTime, isMatchLive, isMatchFinished } from '@/utils/formatters';

interface LiveMatchProps {
  match: Match;
}

const LiveMatch = ({ match }: LiveMatchProps) => {
  const live = isMatchLive(match.status);
  const finished = isMatchFinished(match.status);

  return (
    <Link
      to={`/match/${match.id}`}
      className="card p-4 hover:shadow-lg transition-shadow"
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">
          {match.tournament} {match.round && `• Rodada ${match.round}`}
        </span>
        {live && (
          <span className="badge-live flex items-center space-x-1">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span>AO VIVO</span>
          </span>
        )}
        {finished && (
          <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">
            Encerrado
          </span>
        )}
      </div>

      {/* Teams and Score */}
      <div className="space-y-2">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">{match.homeTeam}</span>
          <span className="text-2xl font-bold text-gray-900">
            {match.homeScore ?? '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">{match.awayTeam}</span>
          <span className="text-2xl font-bold text-gray-900">
            {match.awayScore ?? '-'}
          </span>
        </div>
      </div>

      {/* Time */}
      {!live && !finished && (
        <div className="mt-3 text-sm text-gray-500 text-center">
          {formatTime(match.startTime)}
        </div>
      )}
    </Link>
  );
};

export default LiveMatch;