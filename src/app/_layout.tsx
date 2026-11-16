import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useBloqueio } from '../hooks/useBloqueio';
import TelaBloqueio from '../components/TelaBloqueio';

export default function Layout() {
  const { desbloqueado, autenticar } = useBloqueio();

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Meu Diário' }} />
        <Stack.Screen name="nova" options={{ title: 'Nova entrada' }} />
        <Stack.Screen name="entrada/[id]" options={{ title: 'Entrada' }} />
      </Stack>
      {!desbloqueado && <TelaBloqueio onDesbloquear={autenticar} />}
    </View>
  );
}