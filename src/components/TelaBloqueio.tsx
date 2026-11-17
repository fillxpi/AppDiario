import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tema } from '../constants/cores';
import { useCores } from '../hooks/useCores';

export default function TelaBloqueio({ onDesbloquear }: { onDesbloquear: () => void }) {
  const c = useCores();
  const s = useMemo(() => estilos(c), [c]);

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

const estilos = (c: Tema) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFill,
      backgroundColor: c.fundo,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    },
    icone: { fontSize: 56 },
    titulo: { fontSize: 20, fontWeight: '600', color: c.texto },
    botao: { backgroundColor: c.primaria, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
    botaoTexto: { color: c.textoBotao, fontWeight: '600' },
  });