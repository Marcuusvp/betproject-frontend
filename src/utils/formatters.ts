import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

// Timezone do Brasil (GMT-3)
const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Converte uma data para o timezone de Brasília
 * Trata diferentes formatos de entrada
 */
const toBrazilTime = (date: Date | string | number): Date => {
  let finalDate: Date;
  
  if (typeof date === 'string') {
    // Se for string, parseia
    finalDate = parseISO(date);
  } else if (typeof date === 'number') {
    // Se for número, assume timestamp Unix em SEGUNDOS
    finalDate = new Date(date * 1000);
  } else {
    finalDate = date;
  }
  
  return toZonedTime(finalDate, BRAZIL_TIMEZONE);
};

export const formatMatchDate = (dateString: string): string => {
  try {
    // Se a data não tem timezone (não termina com Z ou +/-HH:MM), adiciona Z para forçar UTC
    let dateToFormat = dateString;
    if (!/Z|[+-]\d{2}:\d{2}$/.test(dateString)) {
      dateToFormat = dateString + 'Z';
    }
    
    let date = parseISO(dateToFormat);
    
    // Se a data for inválida, tenta interpretar como timestamp
    if (isNaN(date.getTime())) {
      const timestamp = parseInt(dateString);
      if (!isNaN(timestamp)) {
        date = new Date(timestamp * 1000);
      }
    }
    
    const brazilDate = toBrazilTime(date);
    
    if (isToday(brazilDate)) {
      return `Hoje, ${format(brazilDate, 'HH:mm', { locale: ptBR })}`;
    }
    
    if (isTomorrow(brazilDate)) {
      return `Amanhã, ${format(brazilDate, 'HH:mm', { locale: ptBR })}`;
    }
    
    if (isYesterday(brazilDate)) {
      return `Ontem, ${format(brazilDate, 'HH:mm', { locale: ptBR })}`;
    }
    
    return format(brazilDate, "dd/MM 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateString);
    return dateString;
  }
};

export const formatShortDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    const brazilDate = toBrazilTime(date);
    return format(brazilDate, 'dd/MM', { locale: ptBR });
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    const brazilDate = toBrazilTime(date);
    return format(brazilDate, 'HH:mm', { locale: ptBR });
  } catch (error) {
    return dateString;
  }
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatDecimal = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

export const formatScore = (homeScore: number | null, awayScore: number | null): string => {
  if (homeScore === null || awayScore === null) {
    return '-';
  }
  return `${homeScore} - ${awayScore}`;
};

/**
 * Formata um timestamp Unix para data/hora no horário de Brasília
 */
export const formatUnixTimestamp = (timestamp: number): string => {
  try {
    const date = new Date(timestamp * 1000); // Unix timestamp está em segundos
    const brazilDate = toBrazilTime(date);
    
    if (isToday(brazilDate)) {
      return `Hoje, ${format(brazilDate, 'HH:mm', { locale: ptBR })}`;
    }
    
    if (isTomorrow(brazilDate)) {
      return `Amanhã, ${format(brazilDate, 'HH:mm', { locale: ptBR })}`;
    }
    
    if (isYesterday(brazilDate)) {
      return `Ontem, ${format(brazilDate, 'HH:mm', { locale: ptBR })}`;
    }
    
    return format(brazilDate, "dd/MM 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '-';
  }
};

export const getMatchStatusClass = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus === 'live' || lowerStatus === 'inplay') {
    return 'badge-live';
  }
  
  if (lowerStatus === 'ended' || lowerStatus === 'finished') {
    return 'bg-gray-500 text-white text-xs px-2 py-1 rounded-full';
  }
  
  return 'bg-blue-500 text-white text-xs px-2 py-1 rounded-full';
};

export const isMatchLive = (status: string): boolean => {
  const lowerStatus = status.toLowerCase();
  return lowerStatus === 'live' || lowerStatus === 'inplay';
};

export const isMatchFinished = (status: string): boolean => {
  const lowerStatus = status.toLowerCase();
  return lowerStatus === 'ended' || lowerStatus === 'finished';
};