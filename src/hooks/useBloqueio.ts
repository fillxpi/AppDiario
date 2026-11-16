import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export function useBloqueio() {
  const [desbloqueado, setDesbloqueado] = useState(false);
  const autenticando = useRef(false);
  const foiParaBackground = useRef(false);

  const autenticar = useCallback(async () => {
    if (autenticando.current) return;
    autenticando.current = true;
    try {
      const temHardware = await LocalAuthentication.hasHardwareAsync();
      const cadastrado = await LocalAuthentication.isEnrolledAsync();

      // Aparelho sem biometria/código configurado: não há como proteger.
      if (!temHardware || !cadastrado) {
        setDesbloqueado(true);
        return;
      }

      const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloqueie seu diário',
        cancelLabel: 'Cancelar',
      });
      setDesbloqueado(resultado.success);
    } finally {
      autenticando.current = false;
    }
  }, []);

  useEffect(() => {
    autenticar();

    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'background') {
        foiParaBackground.current = true;
        setDesbloqueado(false);
      }
      if (estado === 'active' && foiParaBackground.current) {
        foiParaBackground.current = false;
        autenticar();
      }
    });

    return () => sub.remove();
  }, [autenticar]);

  return { desbloqueado, autenticar };
}