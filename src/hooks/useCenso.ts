import { useEffect, useState } from 'react';
import type { CensoData } from '../lib/censo';

interface EstadoCenso {
  data: CensoData | null;
  carregando: boolean;
  erro: boolean;
}

/** O JSON é grande (~900 KB) e estático: baixa uma vez e reusa entre montagens. */
let cache: Promise<CensoData> | null = null;

function carregar(): Promise<CensoData> {
  if (!cache) {
    const url = `${import.meta.env.BASE_URL}data/censo2022.json`;
    cache = fetch(url).then((resposta) => {
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      return resposta.json() as Promise<CensoData>;
    });
  }
  return cache;
}

export function useCenso(): EstadoCenso {
  const [estado, setEstado] = useState<EstadoCenso>({
    data: null,
    carregando: true,
    erro: false,
  });

  useEffect(() => {
    let ativo = true;
    carregar()
      .then((data) => {
        if (ativo) setEstado({ data, carregando: false, erro: false });
      })
      .catch(() => {
        cache = null;
        if (ativo) setEstado({ data: null, carregando: false, erro: true });
      });
    return () => {
      ativo = false;
    };
  }, []);

  return estado;
}
