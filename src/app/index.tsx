import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Entrada, listarEntradas } from '../db/database';

// Remove acentos e ignora maiúsculas para a busca ser tolerante.
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function Lista() {
  const router = useRouter();
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [busca, setBusca] = useState('');

  useFocusEffect(
    useCallback(() => {
      listarEntradas().then(setEntradas);
    }, [])
  );

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return entradas;
    return entradas.filter((e) => normalizar(`${e.titulo} ${e.texto}`).includes(termo));
  }, [entradas, busca]);

  return (
    <View style={s.container}>
      <FlatList
        data={filtradas}
        keyExtractor={(e) => String(e.id)}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <TextInput
            style={s.busca}
            placeholder="Buscar nas entradas"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        }
        ListEmptyComponent={
          <Text style={s.vazio}>
            {entradas.length === 0 ? 'Nenhuma entrada ainda.' : 'Nenhum resultado para a busca.'}
          </Text>
        }
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
  busca: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginBottom: 12 },
  vazio: { textAlign: 'center', marginTop: 40, opacity: 0.6 },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  titulo: { fontSize: 16, fontWeight: '600' },
  data: { fontSize: 12, opacity: 0.6, marginBottom: 6 },
  botao: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 12, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: '600' },
});