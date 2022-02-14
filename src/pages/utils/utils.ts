
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const formatDateTo_dd_MMM_Y = (dateToFormat: string) => {
  return format(new Date(dateToFormat), "dd MMM Y",{ locale: ptBR })
}

export const calcTimeToRead = (textToCalc: string) => {
  const wordPerMinute = 200;
  const words = textToCalc.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordPerMinute);
  return time;
}