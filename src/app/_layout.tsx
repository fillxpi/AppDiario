import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Meu Diário' }} />
      <Stack.Screen name="nova" options={{ title: 'Nova entrada' }} />
    </Stack>
  );
}