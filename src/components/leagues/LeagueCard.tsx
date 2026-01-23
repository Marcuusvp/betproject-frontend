import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { League } from '@/api/types';
import { LEAGUE_SLUGS } from '@/utils/constants';

interface LeagueCardProps {
  league: League;
}

const LeagueCard = ({ league }: LeagueCardProps) => {
  const slug = LEAGUE_SLUGS[league.id];

  return (
    <Link
      to={`/league/${slug}`}
      className="card p-6 hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: `${league.color}15` }}
          >
            <img
              src={league.logo}
              alt={`${league.name} logo`}
              className="w-14 h-14 object-contain"
              onError={(e) => {
                // Fallback para emoji se a imagem não carregar
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">⚽</span>';
              }}
            />
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900">{league.name}</h3>
            <p className="text-gray-500">{league.country}</p>
            {league.currentRound && (
              <p className="text-sm text-primary-600 mt-1">
                Rodada {league.currentRound} de {league.totalRounds}
              </p>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="text-gray-400" size={24} />
      </div>
    </Link>
  );
};

export default LeagueCard;