/**
 * Catálogo curado do painel interativo. Cada indicador aponta para uma aba da
 * base colunar (`public/data/censo2022.json`) e define o **recorte padrão**:
 * `chaves` (dimensões das linhas) e `facetas` (dimensões das colunas). As demais
 * dimensões da aba viram subfiltros automaticamente no painel.
 *
 * `eixo` é a dimensão que o gráfico de série abre por padrão.
 * Os rótulos ficam no i18n (`dashboard.*`) — aqui só a estrutura.
 *
 * Recorte disponível no export do SIDRA: Brasil, Goiás e Edealina (GO).
 */
import type { Filtros } from '../lib/censo';

export type Unidade = 'porcento' | 'pessoas' | 'anos';

export interface IndicadorCenso {
  id: string;
  tema: string;
  tabela: string;
  aba: string;
  chaves: Filtros;
  facetas: Filtros;
  unidade: Unidade;
  casas: number;
  accent: 'success' | 'warning' | 'info' | 'lavender';
  /** Dimensão aberta no gráfico de série */
  eixo: string;
}

export const indicadores: IndicadorCenso[] = [
  {
    id: 'alfabetizacao',
    tema: 'Alfabetização',
    tabela: 'tabela9543',
    aba: 'Tabela',
    chaves: { Idade: 'Total' },
    facetas: { Sexo: 'Total', 'Cor ou raça': 'Total' },
    unidade: 'porcento',
    casas: 1,
    accent: 'success',
    eixo: 'Idade',
  },
  {
    id: 'populacao',
    tema: 'Cor ou Raça',
    tabela: 'tabela9605',
    aba: 'População residente (Pessoas)',
    chaves: {},
    facetas: { 'Cor ou raça': 'Total' },
    unidade: 'pessoas',
    casas: 0,
    accent: 'info',
    eixo: 'Cor ou raça',
  },
  {
    id: 'deficiencia',
    tema: 'Pessoas com deficiência',
    tabela: 'tabela10125',
    aba: 'Tabela 3',
    chaves: { 'Grupo de idade': 'Total' },
    facetas: { Sexo: 'Total' },
    unidade: 'porcento',
    casas: 1,
    accent: 'warning',
    eixo: 'Grupo de idade',
  },
  {
    id: 'escolarizacao_pcd',
    tema: 'Pessoas com deficiência',
    tabela: 'tabela10139',
    aba: 'Tabela',
    chaves: { 'Existência de deficiência': 'Pessoa com deficiência' },
    facetas: { Sexo: 'Total', 'Grupo de idade': '6 a 14 anos' },
    unidade: 'porcento',
    casas: 1,
    accent: 'success',
    eixo: 'Grupo de idade',
  },
  {
    id: 'autismo',
    tema: 'Transtorno do espectro autista',
    tabela: 'tabela10145',
    aba: 'Percentual da população resi...',
    chaves: { 'Grupo de idade': 'Total' },
    facetas: { Sexo: 'Total' },
    unidade: 'porcento',
    casas: 1,
    accent: 'lavender',
    eixo: 'Grupo de idade',
  },
  {
    id: 'registro_nascimento',
    tema: 'Registros de Nascimentos',
    tabela: 'tabela9872',
    aba: 'Tabela',
    chaves: {},
    facetas: { Idade: 'Total' },
    unidade: 'porcento',
    casas: 2,
    accent: 'info',
    eixo: 'Idade',
  },
];
