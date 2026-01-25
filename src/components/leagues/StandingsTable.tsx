import { StandingRow } from '@/api/types';

interface Props {
  rows: StandingRow[];
  loading?: boolean;
}

const StandingsTable = ({ rows, loading }: Props) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center animate-pulse border border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  // Função para definir cores baseadas na promoção
  const getRowStyle = (promotion?: { text: string } | null) => {
    if (!promotion?.text) return '';
    
    if (promotion.text.includes('Champions League')) 
      return 'border-l-4 border-blue-600 bg-blue-50/30';
    if (promotion.text.includes('Europa')) 
      return 'border-l-4 border-orange-500 bg-orange-50/30';
    if (promotion.text.includes('Relegation')) 
      return 'border-l-4 border-red-600 bg-red-50/30';
      
    return 'border-l-4 border-transparent';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Classificação</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-3 w-12 text-center">#</th>
              <th className="px-3 py-3 text-left">Time</th>
              <th className="px-3 py-3 text-center font-bold text-gray-900">P</th>
              <th className="px-3 py-3 text-center">J</th>
              <th className="px-3 py-3 text-center text-green-600 hidden sm:table-cell">V</th>
              <th className="px-3 py-3 text-center text-gray-500 hidden sm:table-cell">E</th>
              <th className="px-3 py-3 text-center text-red-600 hidden sm:table-cell">D</th>
              <th className="px-3 py-3 text-center hidden md:table-cell">SG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.team.id} className={`hover:bg-gray-50 transition-colors ${getRowStyle(row.promotion)}`}>
                <td className="px-3 py-3 text-center font-bold text-gray-700">
                  {row.position}
                </td>
                <td className="px-3 py-3 font-medium text-gray-900">
                  {row.team.name}
                </td>
                <td className="px-3 py-3 text-center font-bold text-gray-900 bg-gray-50/50">
                  {row.points}
                </td>
                <td className="px-3 py-3 text-center text-gray-600">
                  {row.matches}
                </td>
                <td className="px-3 py-3 text-center text-green-600 hidden sm:table-cell">
                  {row.wins}
                </td>
                <td className="px-3 py-3 text-center text-gray-400 hidden sm:table-cell">
                  {row.draws}
                </td>
                <td className="px-3 py-3 text-center text-red-500 hidden sm:table-cell">
                  {row.losses}
                </td>
                <td className="px-3 py-3 text-center text-gray-600 hidden md:table-cell">
                  {row.scoreDiffFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="p-3 text-[10px] text-gray-500 bg-gray-50 border-t flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600 rounded-full"></div> Champions</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Europa</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-600 rounded-full"></div> Rebaixamento</div>
      </div>
    </div>
  );
};

export default StandingsTable;