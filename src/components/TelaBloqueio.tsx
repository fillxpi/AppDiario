import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TelaBloqueio({ onDesbloquear }: { onDesbloquear: () => void }) {
  return (
    <View style={s.container}>
      <Text style={s.icone}>🔒</Text>
      <Text style={s.titulo}>Diário bloqueado</Text>
      <Pressable style={s.botao} onPress={onDesbloquear}>
        <Text style={s.botaoTexto}>Desbloquear</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  icone: { fontSize: 56 },
  titulo: { fontSize: 20, fontWeight: '600' },
  botao: { backgroundColor: '#4f46e5', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  botaoTexto: { color: '#fff', fontWeight: '600' },
});