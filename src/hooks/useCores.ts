import { useColorScheme } from 'react-native';
import { Cores, Tema } from '../constants/cores';

export function useCores(): Tema {
  const esquema = useColorScheme();
  return esquema === 'dark' ? Cores.escuro : Cores.claro;
}