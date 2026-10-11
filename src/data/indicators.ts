/**
 * Indicadores numéricos da landing (dados públicos da educação básica).
 * Os rótulos localizados ficam no i18n — aqui só ficam números e estrutura,
 * no mesmo padrão do projeto de referência (dados fora dos componentes).
 */

export interface HeroStat {
  id: string;
  value: number;
  decimals: number;
  suffix?: string;
  /** Altura/preenchimento da barra de status (0 a 100) */
  bar: number;
}

export const heroStats: HeroStat[] = [
  { id: 'schools', value: 178400, decimals: 0, bar: 100 },
  { id: 'enrollments', value: 47.3, decimals: 1, suffix: ' mi', bar: 92 },
  { id: 'ideb', value: 6, decimals: 1, bar: 75 },
];

export interface AnalysisItem {
  id: string;
  /** Nome do ícone em lucide-react (resolvido no componente) */
  icon: string;
  value: number;
  decimals: number;
  unit: '%' | 'p.p.' | 'alunos' | 'anos';
  trend: 'up' | 'down' | 'flat';
  accent: 'success' | 'warning' | 'info' | 'lavender';
}

/**
 * Seis recortes do Censo Demográfico 2022 (IBGE/SIDRA), no Brasil.
 * Os mesmos números aparecem no painel interativo — aqui, em leitura rápida.
 */
export const analyses: AnalysisItem[] = [
  { id: 'alfabetizacao', icon: 'GraduationCap', value: 93, decimals: 1, unit: '%', trend: 'up', accent: 'success' },
  { id: 'escolarizacao_pcd', icon: 'School', value: 92.6, decimals: 1, unit: '%', trend: 'up', accent: 'info' },
  { id: 'deficiencia', icon: 'Users', value: 7.3, decimals: 1, unit: '%', trend: 'flat', accent: 'warning' },
  { id: 'autismo', icon: 'ClipboardCheck', value: 1.2, decimals: 1, unit: '%', trend: 'up', accent: 'lavender' },
  { id: 'registro_nascimento', icon: 'Scale', value: 99.3, decimals: 1, unit: '%', trend: 'up', accent: 'success' },
  { id: 'idade_mediana', icon: 'TrendingUp', value: 35, decimals: 0, unit: 'anos', trend: 'flat', accent: 'info' },
];

export interface DataSourceItem {
  id: string;
  icon: string;
  /** Números exibidos no card (opcional) */
  badge?: string;
  accent: 'success' | 'warning' | 'info' | 'lavender';
}

export const dataSources: DataSourceItem[] = [
  { id: 'censo', icon: 'School', badge: '2019–2023', accent: 'success' },
  { id: 'saeb', icon: 'ClipboardCheck', badge: '5.500+', accent: 'info' },
  { id: 'ibge', icon: 'Users', badge: '27 UF', accent: 'lavender' },
  { id: 'stack', icon: 'Code2', badge: 'Python + R', accent: 'warning' },
];

/** Séries anuais usadas no mini-gráfico do Hero (IDEB anos iniciais, rede pública) */
export const idebSeries = [
  { year: 2019, value: 5.7 },
  { year: 2021, value: 5.5 },
  { year: 2023, value: 6.0 },
  { year: 2025, value: 6.2 },
];
