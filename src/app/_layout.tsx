import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { useColorScheme, View } from 'react-native';
import TelaBloqueio from '../components/TelaBloqueio';
import { useBloqueio } from '../hooks/useBloqueio';

export default function Layout() {
  const { desbloqueado, autenticar } = useBloqueio();
  const esquema = useColorScheme();

  return (
    <ThemeProvider value={esquema === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Meu Diário' }} />
          <Stack.Screen name="nova" options={{ title: 'Nova entrada' }} />
          <Stack.Screen name="entrada/[id]" options={{ title: 'Entrada' }} />
        </Stack>
        {!desbloqueado && <TelaBloqueio onDesbloquear={autenticar} />}
      </View>
    </ThemeProvider>
  );
}