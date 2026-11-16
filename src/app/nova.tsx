import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { criarEntrada } from '../db/database';

const HUMORES = ['😄', '🙂', '😐', '😟', '😢'];

export default function Nova() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [humor, setHumor] = useState('🙂');

  async function salvar() {
    if (!titulo.trim() || !texto.trim()) return;
    await criarEntrada(titulo.trim(), texto.trim(), humor);
    router.back();
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={s.container}
    >
      <TextInput style={s.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <View style={s.humores}>
        {HUMORES.map((h) => (
          <Pressable key={h} onPress={() => setHumor(h)} style={[s.humor, humor === h && s.humorAtivo]}>
            <Text style={{ fontSize: 26 }}>{h}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        style={[s.input, { height: 180, textAlignVertical: 'top' }]}
        placeholder="Como foi seu dia?"
        multiline
        value={texto}
        onChangeText={setTexto}
      />
      <Pressable style={s.botao} onPress={salvar}>
        <Text style={s.botaoTexto}>Salvar</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12 },
  humores: { flexDirection: 'row', justifyContent: 'space-between' },
  humor: { padding: 8, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  humorAtivo: { borderColor: '#4f46e5' },
  botao: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 12, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: '600' },
});