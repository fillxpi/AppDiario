import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Entrada, listarEntradas } from '../db/database';

export default function Lista() {
  const router = useRouter();
  const [entradas, setEntradas] = useState<Entrada[]>([]);

  useFocusEffect(
    useCallback(() => {
      listarEntradas().then(setEntradas);
    }, [])
  );

  return (
    <View style={s.container}>
      <FlatList
        data={entradas}
        keyExtractor={(e) => String(e.id)}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={<Text style={s.vazio}>Nenhuma entrada ainda.</Text>}
        renderItem={({ item }) => (
  <Pressable
    style={s.card}
    onPress={() => router.push({ pathname: '/entrada/[id]', params: { id: item.id } })}
  >
    <Text style={s.titulo}>{item.humor} {item.titulo}</Text>
    <Text style={s.data}>{new Date(item.criadaEm).toLocaleDateString('pt-BR')}</Text>
    <Text numberOfLines={2}>{item.texto}</Text>
  </Pressable>
)}
      />
      <Pressable style={s.botao} onPress={() => router.push('/nova')}>
        <Text style={s.botaoTexto}>+ Nova entrada</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  vazio: { textAlign: 'center', marginTop: 40, opacity: 0.6 },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  titulo: { fontSize: 16, fontWeight: '600' },
  data: { fontSize: 12, opacity: 0.6, marginBottom: 6 },
  botao: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 12, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: '600' },
});