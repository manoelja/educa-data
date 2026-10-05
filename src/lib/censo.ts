/**
 * Acesso à base do Censo Demográfico 2022 (IBGE/SIDRA) gerada por
 * `scripts/censo.mjs` em `public/data/censo2022.json`.
 *
 * O JSON é colunar: `colunas[i]` descreve `linhas[][i]`. Além dos nomes, cada
 * coluna de valor carrega **facetas** (ex.: `{ Ano: '2022', Sexo: 'Total',
 * 'Cor ou raça': 'Branca' }`), o que permite filtrar por dimensão em vez de
 * depender do rótulo achatado. Aqui ficam só os resolvedores puros (sem fetch).
 */

export type CensoValor = string | number | null

export interface CensoAba {
  colunas: string[]
  linhas: CensoValor[][]
  /** Nomes dos níveis de faceta da coluna, ex.: ['Ano', 'Sexo', 'Cor ou raça'] */
  facetaNomes?: string[] | null
  /** Categorias distintas por nível, na ordem de aparição */
  facetaValores?: string[][] | null
  /** Índices de faceta por coluna (null nas colunas-chave) */
  colunasFacetas?: (number[] | null)[] | null
}

export interface CensoTabela {
  titulo: string | null
  variavel: string | null
  notas: string[]
  abas: Record<string, CensoAba>
}

export interface CensoData {
  fonte: string
  escopo: string
  formato: string
  resumo: {
    temas: number
    tabelas: number
    linhas: number
    abas?: number
    abasComFacetas?: number
  }
  temas: Record<string, Record<string, CensoTabela>>
}

/** Filtro por coluna: `{ Idade: 'Total', localidade: 'Brasil' }`. */
export type Filtros = Record<string, string>

export interface RecorteCenso {
  localidade?: string
  /** Dimensões-chave das linhas (ex.: Idade, Grupo de idade, Sexo) */
  chaves?: Filtros
  /** Dimensões codificadas nas colunas (ex.: Sexo, Cor ou raça) */
  facetas?: Filtros
}

export interface Dimensao {
  nome: string
  tipo: 'linha' | 'coluna'
}

const ANO = /^ano$/i;

export function pegarAba(
  data: CensoData,
  tema: string,
  tabela: string,
  aba: string,
): CensoAba | null {
  return data.temas?.[tema]?.[tabela]?.abas?.[aba] ?? null;
}

export function colunaIndex(aba: CensoAba, coluna: string): number {
  return aba.colunas.indexOf(coluna);
}

/** Primeira linha que bate com todos os filtros (comparação como string). */
export function acharLinha(aba: CensoAba, filtros: Filtros = {}): CensoValor[] | null {
  const colunas = Object.keys(filtros);
  const indices = colunas.map((c) => colunaIndex(aba, c));
  if (indices.some((i) => i < 0)) return null;

  for (const linha of aba.linhas) {
    if (indices.every((i, k) => String(linha[i]) === filtros[colunas[k]])) return linha;
  }
  return null;
}

/** Localidades distintas (coluna 0), na ordem em que aparecem. */
export function localidades(aba: CensoAba): string[] {
  const out: string[] = [];
  for (const linha of aba.linhas) {
    const loc = linha[0];
    if (typeof loc === 'string' && !out.includes(loc)) out.push(loc);
  }
  return out;
}

/** Colunas-chave categóricas das linhas (tudo menos `localidade`). Memoizado. */
const dimsLinhaCache = new WeakMap<CensoAba, string[]>();

export function dimensoesLinha(aba: CensoAba): string[] {
  const cache = dimsLinhaCache.get(aba);
  if (cache) return cache;

  const out: string[] = [];
  for (let c = 1; c < aba.colunas.length; c++) {
    let temString = false;
    let soString = true;
    for (const linha of aba.linhas) {
      const v = linha[c];
      if (v === null) continue;
      if (typeof v !== 'string') {
        soString = false;
        break;
      }
      temString = true;
    }
    if (soString && temString) out.push(aba.colunas[c]);
  }

  dimsLinhaCache.set(aba, out);
  return out;
}

export function dimensoesColuna(aba: CensoAba): string[] {
  if (!aba.facetaNomes) return [];
  return aba.facetaNomes.filter((n) => !ANO.test(n));
}

/** Todas as dimensões filtráveis da aba (linha + coluna), sem duplicar. */
export function dimensoes(aba: CensoAba): Dimensao[] {
  const linha = dimensoesLinha(aba).map((nome) => ({ nome, tipo: 'linha' as const }));
  const linhaNomes = new Set(linha.map((d) => d.nome));
  const coluna = dimensoesColuna(aba)
    .filter((nome) => !linhaNomes.has(nome))
    .map((nome) => ({ nome, tipo: 'coluna' as const }));
  return [...linha, ...coluna];
}

/** Categorias de uma dimensão, seja de linha ou de coluna. */
export function valoresDimensao(aba: CensoAba, nome: string): string[] {
  const i = aba.facetaNomes?.indexOf(nome) ?? -1;
  if (i >= 0 && aba.facetaValores) return aba.facetaValores[i];
  return valoresLinha(aba, nome);
}

export function valoresLinha(aba: CensoAba, coluna: string): string[] {
  const ci = colunaIndex(aba, coluna);
  if (ci < 0) return [];
  const out: string[] = [];
  for (const linha of aba.linhas) {
    const v = linha[ci];
    if (typeof v === 'string' && !out.includes(v)) out.push(v);
  }
  return out;
}

/** Índice da coluna de valor que satisfaz as facetas pedidas. */
export function encontrarColuna(aba: CensoAba, facetas: Filtros): number {
  const nomes = aba.facetaNomes;
  const valores = aba.facetaValores;
  const porColuna = aba.colunasFacetas;
  if (!nomes || !valores || !porColuna) return -1;

  // Nível não pedido vira curinga (-1); categoria pedida que não existe falha.
  const desejados: number[] = [];
  for (let l = 0; l < nomes.length; l++) {
    const alvo = facetas[nomes[l]];
    if (alvo === undefined) {
      desejados.push(-1);
      continue;
    }
    const pos = valores[l].indexOf(alvo);
    if (pos < 0) return -1;
    desejados.push(pos);
  }

  for (let c = 0; c < porColuna.length; c++) {
    const cf = porColuna[c];
    if (!cf) continue;
    let ok = true;
    for (let l = 0; l < desejados.length; l++) {
      if (desejados[l] >= 0 && cf[l] !== desejados[l]) {
        ok = false;
        break;
      }
    }
    if (ok) return c;
  }
  return -1;
}

/** Valor numérico de um recorte (localidade + chaves de linha + facetas de coluna). */
export function consultar(aba: CensoAba, recorte: RecorteCenso): number | null {
  const chaves: Filtros = { ...recorte.chaves };
  if (recorte.localidade) chaves.localidade = recorte.localidade;

  const linha = acharLinha(aba, chaves);
  if (!linha) return null;

  const c = encontrarColuna(aba, recorte.facetas ?? {});
  if (c < 0) return null;

  const v = linha[c];
  return typeof v === 'number' ? v : null;
}

/** Série variando as localidades, com o resto do recorte fixo. */
export function serieLocalidade(
  aba: CensoAba,
  recorte: RecorteCenso,
): { localidade: string; valor: number }[] {
  const out: { localidade: string; valor: number }[] = [];
  for (const loc of localidades(aba)) {
    const valor = consultar(aba, { ...recorte, localidade: loc });
    if (valor !== null) out.push({ localidade: loc, valor });
  }
  return out;
}

/** Série variando uma dimensão (linha ou coluna), com o resto fixo. */
export function serieDimensao(
  aba: CensoAba,
  recorte: RecorteCenso,
  nome: string,
): { rotulo: string; valor: number }[] {
  const ehColuna = (aba.facetaNomes?.indexOf(nome) ?? -1) >= 0;
  const out: { rotulo: string; valor: number }[] = [];

  for (const categoria of valoresDimensao(aba, nome)) {
    const recorteCategoria: RecorteCenso = ehColuna
      ? { ...recorte, facetas: { ...recorte.facetas, [nome]: categoria } }
      : { ...recorte, chaves: { ...recorte.chaves, [nome]: categoria } };
    const valor = consultar(aba, recorteCategoria);
    if (valor !== null) out.push({ rotulo: categoria, valor });
  }
  return out;
}
