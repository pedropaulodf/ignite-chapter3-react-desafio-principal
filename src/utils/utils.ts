
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDateTo_dd_MMM_Y(dateToFormat: string) {
  return format(new Date(dateToFormat), "dd MMM Y",{ locale: ptBR })
}

export function formatDateTo_dd_MMM_Y_HH_mm(dateToFormat: string) {
  return format(new Date(dateToFormat), "dd MMM Y', às 'HH:mm",{ locale: ptBR })
}

export const calcTimeToRead = (textToCalc: string) => {
  const wordPerMinute = 200;
  const words = textToCalc.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordPerMinute);
  return time;
}