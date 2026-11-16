import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { gcm } from '@noble/ciphers/aes';
import { bytesToHex, bytesToUtf8, hexToBytes, utf8ToBytes } from '@noble/ciphers/utils';

const CHAVE_ID = 'diario_chave_aes';
const PREFIXO = 'enc1:';

let chavePromise: Promise<Uint8Array> | null = null;

// Gera a chave na primeira vez e depois só lê do cofre seguro.
// Guardei a Promise para evitar criar duas chaves em chamadas simultâneas.
function obterChave(): Promise<Uint8Array> {
  if (!chavePromise) {
    chavePromise = (async () => {
      let hex = await SecureStore.getItemAsync(CHAVE_ID);
      if (!hex) {
        hex = bytesToHex(Crypto.getRandomBytes(32));
        await SecureStore.setItemAsync(CHAVE_ID, hex);
      }
      return hexToBytes(hex);
    })().catch((erro) => {
      chavePromise = null;
      throw erro;
    });
  }
  return chavePromise;
}

export async function criptografar(texto: string): Promise<string> {
  const chave = await obterChave();
  const nonce = Crypto.getRandomBytes(12); // um nonce novo a cada criptografia
  const cifrado = gcm(chave, nonce).encrypt(utf8ToBytes(texto));
  return PREFIXO + bytesToHex(nonce) + bytesToHex(cifrado);
}

export async function descriptografar(valor: string): Promise<string> {
  // Entradas antigas (salvas antes da criptografia) continuam legíveis.
  if (!valor.startsWith(PREFIXO)) return valor;
  try {
    const chave = await obterChave();
    const bytes = hexToBytes(valor.slice(PREFIXO.length));
    const nonce = bytes.slice(0, 12);
    const cifrado = bytes.slice(12);
    return bytesToUtf8(gcm(chave, nonce).decrypt(cifrado));
  } catch {
    return '[conteúdo ilegível]';
  }
}