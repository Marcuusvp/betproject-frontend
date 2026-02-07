import { StandingRow } from '@/api/types';
import { useMemo } from 'react';

interface StandingsTableProps {
  rows: StandingRow[];
  loading?: boolean;
  isChampionsLeague?: boolean;
}

// Configuração de cores baseada nos IDs de promoção da API
const PROMOTION_STYLES: Record<number, { row: string; text: string; dot: string }> = {
  // --- TIER 1: ELITE CONTINENTAL (Verde) ---
  // Libertadores (19) e Champions League Direta (804)
  19:  { row: 'bg-green-50 border-l-4 border-green-500', text: 'text-green-700', dot: 'bg-green-500' },
  804: { row: 'bg-green-50 border-l-4 border-green-500', text: 'text-green-700', dot: 'bg-green-500' },

  // --- TIER 1.5: QUALIFICATÓRIAS ELITE (Ciano) ---
  // Pré-Libertadores (20) e Champions League Qualification (24)
  20: { row: 'bg-cyan-50 border-l-4 border-cyan-500', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  24: { row: 'bg-cyan-50 border-l-4 border-cyan-500', text: 'text-cyan-700', dot: 'bg-cyan-500' },

  // --- TIER 2: SEGUNDO ESCALÃO (Azul) ---
  // Sul-Americana (21) e Europa League (808)
  21:  { row: 'bg-blue-50 border-l-4 border-blue-500', text: 'text-blue-700', dot: 'bg-blue-500' },
  808: { row: 'bg-blue-50 border-l-4 border-blue-500', text: 'text-blue-700', dot: 'bg-blue-500' },

  // --- TIER 3: TERCEIRO ESCALÃO (Ambar/Amarelo) ---
  // Conference League Qualification (503)
  503: { row: 'bg-amber-50 border-l-4 border-amber-500', text: 'text-amber-700', dot: 'bg-amber-500' },

  // --- TIER PERIGO: REPESCAGEM/PLAYOFF (Laranja) ---
  // Relegation Playoffs (45) - Nantes
  45: { row: 'bg-orange-50 border-l-4 border-orange-500', text: 'text-orange-700', dot: 'bg-orange-500' },

  // --- TIER QUEDA: REBAIXAMENTO (Vermelho) ---
  // Relegation (3)
  3: { row: 'bg-red-50 border-l-4 border-red-500', text: 'text-red-700', dot: 'bg-red-500' },
};

// Fallback para promoções desconhecidas
const DEFAULT_PROMOTION_STYLE = {
  row: 'bg-gray-50 border-l-4 border-gray-400',
  text: 'text-gray-700',
  dot: 'bg-gray-400'
};

const StandingsTable = ({ rows, loading, isChampionsLeague = false }: StandingsTableProps) => {
  
// Função para determinar o texto da legenda
  const getPromotionLabel = (text: string) => {
    // Traduções comuns
    if (text === 'Relegation') return 'Zona de Rebaixamento';
    if (text === 'Relegation Playoffs') return 'Play-off de Rebaixamento';
    
    if (text.includes('Champions League Qualification')) return 'Pré-Champions League';
    if (text.includes('Conference League Qualification')) return 'Qualif. Conference League';
    if (text.includes('Libertadores Qualification')) return 'Pré-Libertadores';
    
    // Fallback: se não tiver tradução específica, retorna o texto original
    return text;
  };

  // Calcula as promoções únicas existentes na tabela atual para montar a legenda
  const activePromotions = useMemo(() => {
    if (isChampionsLeague || !rows) return [];
    
    const uniqueIds = new Set();
    const promos: { id: number; text: string }[] = [];

    rows.forEach(row => {
      if (row.promotion && !uniqueIds.has(row.promotion.id)) {
        uniqueIds.add(row.promotion.id);
        promos.push(row.promotion);
      }
    });

    // Opcional: Ordenar por ID ou lógica específica para a legenda ficar bonita (Liberta primeiro, Rebaixamento por último)
    return promos.sort(() => {
       // Coloca Rebaixamento (id 3) sempre no final visualmente se quiser,
       // mas a ordem natural da tabela geralmente já resolve.
       return 0;
    });
  }, [rows, isChampionsLeague]);

  // Função para determinar a cor da linha
  const getPositionStyles = (row: StandingRow) => {
    // 1. Lógica específica mantida da Champions League
    if (isChampionsLeague) {
      if (row.position <= 8) return { row: 'bg-green-50 border-l-4 border-green-500', text: 'text-green-700 font-semibold' };
      if (row.position <= 24) return { row: 'bg-blue-50 border-l-4 border-blue-500', text: 'text-blue-700 font-semibold' };
      return { row: 'bg-red-50 border-l-4 border-red-500', text: 'text-red-700 font-semibold' };
    }

    // 2. Lógica nova baseada no objeto promotion
    if (!row.promotion) {
      return { row: 'hover:bg-gray-50', text: 'text-gray-900' };
    }

    const style = PROMOTION_STYLES[row.promotion.id] || DEFAULT_PROMOTION_STYLE;
    return { row: style.row, text: `${style.text} font-semibold` };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">Tabela de classificação não disponível</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Legenda Dinâmica */}
      {/* Exibe se for Champions OU se tiver promoções ativas na liga atual */}
      {(isChampionsLeague || activePromotions.length > 0) && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-3 text-xs">
            
            {/* Legenda Champions (Mantida) */}
            {isChampionsLeague ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">1º-8º: Oitavas direto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">9º-24º: Playoff</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">25º-36º: Eliminados</span>
                </div>
              </>
            ) : (
              /* Legenda Genérica Dinâmica */
              activePromotions.map((promo) => {
                const style = PROMOTION_STYLES[promo.id] || DEFAULT_PROMOTION_STYLE;
                return (
                  <div key={promo.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${style.dot}`}></div>
                    <span className="text-gray-700">{getPromotionLabel(promo.text)}</span>
                  </div>
                );
              })
            )}

          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900">Classificação</h3>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-2 py-3 text-center">J</th>
              <th className="px-2 py-3 text-center">V</th>
              <th className="px-2 py-3 text-center">E</th>
              <th className="px-2 py-3 text-center">D</th>
              <th className="px-2 py-3 text-center">GP</th>
              <th className="px-2 py-3 text-center">GC</th>
              <th className="px-2 py-3 text-center">SG</th>
              <th className="px-2 py-3 text-center font-bold">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row) => {
              const styles = getPositionStyles(row);
              return (
                <tr 
                  key={row.position}
                  className={`${styles.row} transition-colors`}
                >
                  <td className="px-4 py-3">
                    <span className={`font-bold ${styles.text}`}>
                      {row.position}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 text-sm">{row.team.name}</span>
                  </td>
                  <td className="px-2 py-3 text-center text-sm text-gray-600">{row.matches}</td>
                  <td className="px-2 py-3 text-center text-sm text-gray-600">{row.wins}</td>
                  <td className="px-2 py-3 text-center text-sm text-gray-600">{row.draws}</td>
                  <td className="px-2 py-3 text-center text-sm text-gray-600">{row.losses}</td>
                  <td className="px-2 py-3 text-center text-sm text-gray-600">{row.scoresFor}</td>
                  <td className="px-2 py-3 text-center text-sm text-gray-600">{row.scoresAgainst}</td>
                  <td className="px-2 py-3 text-center text-sm">
                    <span className={`font-medium ${
                      (row.scoresFor - row.scoresAgainst) > 0 ? 'text-green-600' : 
                      (row.scoresFor - row.scoresAgainst) < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {row.scoresFor - row.scoresAgainst > 0 ? '+' : ''}{row.scoresFor - row.scoresAgainst}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span className="font-bold text-gray-900">{row.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tabela Mobile */}
      <div className="md:hidden divide-y divide-gray-200">
        {rows.map((row) => {
           const styles = getPositionStyles(row);
           return (
            <div 
              key={row.position}
              className={`p-4 ${styles.row}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${styles.text}`}>
                    {row.position}º
                  </span>
                  <span className="font-medium text-gray-900">{row.team.name}</span>
                </div>
                <span className="font-bold text-lg text-gray-900">{row.points} pts</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-xs text-gray-500">J</div>
                  <div className="font-medium text-gray-700">{row.matches}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">V-E-D</div>
                  <div className="font-medium text-gray-700">{row.wins}-{row.draws}-{row.losses}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Gols</div>
                  <div className="font-medium text-gray-700">{row.scoresFor}:{row.scoresAgainst}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">SG</div>
                  <div className={`font-medium ${
                    (row.scoresFor - row.scoresAgainst) > 0 ? 'text-green-600' : 
                    (row.scoresFor - row.scoresAgainst) < 0 ? 'text-red-600' : 
                    'text-gray-700'
                  }`}>
                    {row.scoresFor - row.scoresAgainst > 0 ? '+' : ''}{row.scoresFor - row.scoresAgainst}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StandingsTable;