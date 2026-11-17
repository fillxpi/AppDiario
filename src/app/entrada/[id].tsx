import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Tema } from '../../constants/cores';
import { apagarEntrada, atualizarEntrada, buscarEntrada } from '../../db/database';
import { useCores } from '../../hooks/useCores';

const HUMORES = ['😄', '🙂', '😐', '😟', '😢'];

export default function Detalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const c = useCores();
  const s = useMemo(() => estilos(c), [c]);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [humor, setHumor] = useState('🙂');

  useEffect(() => {
    buscarEntrada(Number(id)).then((e) => {
      if (!e) return;
      setTitulo(e.titulo);
      setTexto(e.texto);
      setHumor(e.humor);
    });
  }, [id]);

  async function salvar() {
    if (!titulo.trim() || !texto.trim()) return;
    await atualizarEntrada(Number(id), titulo.trim(), texto.trim(), humor);
    router.back();
  }

  function confirmarExclusao() {
    Alert.alert('Apagar entrada', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await apagarEntrada(Number(id));
          router.back();
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={{ backgroundColor: c.fundo }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={s.container}
    >
      <TextInput
        style={s.input}
        placeholder="Título"
        placeholderTextColor={c.textoSuave}
        value={titulo}
        onChangeText={setTitulo}
      />
      <View style={s.humores}>
        {HUMORES.map((h) => (
          <Pressable key={h} onPress={() => setHumor(h)} style={[s.humor, humor === h && s.humorAtivo]}>
            <Text style={{ fontSize: 26 }}>{h}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        style={[s.input, { height: 180, textAlignVertical: 'top' }]}
        multiline
        value={texto}
        onChangeText={setTexto}
      />
      <Pressable style={s.botao} onPress={salvar}>
        <Text style={s.botaoTexto}>Salvar alterações</Text>
      </Pressable>
      <Pressable style={s.botaoApagar} onPress={confirmarExclusao}>
        <Text style={s.botaoApagarTexto}>Apagar entrada</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = (c: Tema) =>
  StyleSheet.create({
    container: { padding: 16, gap: 12 },
    input: {
      borderWidth: 1,
      borderColor: c.borda,
      borderRadius: 12,
      padding: 12,
      backgroundColor: c.cartao,
      color: c.texto,
    },
    humores: { flexDirection: 'row', justifyContent: 'space-between' },
    humor: { padding: 8, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
    humorAtivo: { borderColor: c.primaria },
    botao: { backgroundColor: c.primaria, padding: 14, borderRadius: 12, alignItems: 'center' },
    botaoTexto: { color: c.textoBotao, fontWeight: '600' },
    botaoApagar: { padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: c.perigo },
    botaoApagarTexto: { color: c.perigo, fontWeight: '600' },
  });