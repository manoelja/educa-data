import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

/** O padrão é o quadro verde; a variante escura é a ardósia (`dark-theme`). */
function readInitialIsLight(): boolean {
  if (typeof document === 'undefined') return true;
  return !document.documentElement.classList.contains('dark-theme');
}

/**
 * Alternância entre os **dois acabamentos do quadro**: verde de lousa com
 * moldura de madeira clara (padrão) e ardósia escura com moldura nogueira.
 *
 * A classe `dark-theme` vive no `<html>` e o `index.html` já a aplica antes do
 * primeiro paint (script anti-flash), então aqui só sincronizamos o estado e
 * persistimos a escolha.
 */
export function useTheme() {
  const [isLight, setIsLight] = useState(readInitialIsLight);

  useEffect(() => {
    const root = document.documentElement;

    // Sem isso o navegador re-animaria a página inteira na troca (as cores vêm
    // de variáveis de :root, e há `transition: all` + `backdrop-filter` em
    // quase tudo), causando atraso perceptível no mobile.
    root.classList.add('no-theme-transition');
    root.classList.toggle('dark-theme', !isLight);

    try {
      localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
    } catch {
      /* armazenamento bloqueado (modo privado) — segue sem persistir */
    }

    const timer = window.setTimeout(() => root.classList.remove('no-theme-transition'), 60);
    return () => window.clearTimeout(timer);
  }, [isLight]);

  const toggleTheme = useCallback(() => setIsLight((current) => !current), []);

  return { isLight, toggleTheme };
}
