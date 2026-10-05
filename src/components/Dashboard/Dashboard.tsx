import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Database, MapPin, SlidersHorizontal } from 'lucide-react';
import { useCenso } from '../../hooks/useCenso';
import Dropdown from '../Common/Dropdown';
import { formatNumber } from '../../lib/format';
import {
  pegarAba,
  dimensoes,
  valoresDimensao,
  localidades,
  consultar,
  serieLocalidade,
  serieDimensao,
  type CensoAba,
  type CensoData,
  type Dimensao,
  type Filtros,
} from '../../lib/censo';
import { indicadores, type IndicadorCenso } from '../../data/dashboard';
import './Dashboard.css';

interface Barra {
  rotulo: string;
  valor: number;
  destaque?: boolean;
}

const BarList = ({
  titulo,
  barras,
  unidade,
  casas,
}: {
  titulo: string;
  barras: Barra[];
  unidade: string;
  casas: number;
}) => {
  const maximo = Math.max(...barras.map((b) => b.valor), 1);

  return (
    <figure className="dash-chart">
      <figcaption className="dash-chart-title">{titulo}</figcaption>
      {/* Rola as barras com a roda do mouse em vez de trocar de seção —
          ver o handler em App.tsx. */}
      <ul className="dash-bars" data-wheel-scroll>
        {barras.map((barra, index) => (
          <li key={barra.rotulo} className={barra.destaque ? 'is-highlight' : ''}>
            <span className="dash-bar-label" title={barra.rotulo}>
              {barra.rotulo}
            </span>
            <span className="dash-bar-track">
              <motion.span
                className="dash-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(barra.valor / maximo) * 100}%` }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.4), ease: 'easeOut' }}
              />
            </span>
            <span className="dash-bar-value">
              {formatNumber(barra.valor, casas)}
              <span className="dash-bar-unit">{unidade}</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
};

/** Recorte padrão do indicador sobre as dimensões disponíveis na aba. */
function selecaoInicial(
  indicador: IndicadorCenso,
  dims: Dimensao[],
  candidatos: Record<string, string[]>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const d of dims) {
    const opcoes = candidatos[d.nome] ?? [];
    const sugerido = indicador.chaves[d.nome] ?? indicador.facetas[d.nome];
    out[d.nome] =
      sugerido && opcoes.includes(sugerido)
        ? sugerido
        : opcoes.includes('Total')
          ? 'Total'
          : (opcoes[0] ?? '');
  }
  return out;
}

function eixoInicial(indicador: IndicadorCenso, dims: Dimensao[]): string {
  if (dims.some((d) => d.nome === indicador.eixo)) return indicador.eixo;
  return dims.find((d) => d.tipo === 'linha')?.nome ?? dims[0]?.nome ?? '';
}

function localidadeInicial(aba: CensoAba | null): string {
  const locais = aba ? localidades(aba) : [];
  return locais.includes('Brasil') ? 'Brasil' : (locais[0] ?? '');
}

/** Painel de um indicador. Mantido montado ao trocar de indicador (altura fixa). */
const PainelIndicador = ({ data, indicador }: { data: CensoData; indicador: IndicadorCenso }) => {
  const { t } = useTranslation();

  const aba = useMemo(
    () => pegarAba(data, indicador.tema, indicador.tabela, indicador.aba),
    [data, indicador],
  );
  const dims = useMemo<Dimensao[]>(() => (aba ? dimensoes(aba) : []), [aba]);
  const candidatos = useMemo<Record<string, string[]>>(() => {
    const out: Record<string, string[]> = {};
    if (aba) for (const d of dims) out[d.nome] = valoresDimensao(aba, d.nome);
    return out;
  }, [aba, dims]);

  const [selecao, setSelecao] = useState(() => selecaoInicial(indicador, dims, candidatos));
  const [localidade, setLocalidade] = useState(() => localidadeInicial(aba));
  const [eixo, setEixo] = useState(() => eixoInicial(indicador, dims));

  // Trocar de indicador NÃO remonta o painel: o card é o mesmo nó, só o
  // recorte muda — assim o tamanho do card fica fixo (sem “pular” de altura).
  // Reset em render (padrão do React para derivar de prop): nada de effect.
  const [indicadorAnterior, setIndicadorAnterior] = useState(indicador);
  if (indicadorAnterior !== indicador) {
    setIndicadorAnterior(indicador);
    setSelecao(selecaoInicial(indicador, dims, candidatos));
    setLocalidade(localidadeInicial(aba));
    setEixo(eixoInicial(indicador, dims));
  }

  const recorte = useMemo(() => {
    const chaves: Filtros = {};
    const facetas: Filtros = {};
    for (const d of dims) {
      const valor = selecao[d.nome];
      if (!valor) return null;
      if (d.tipo === 'linha') chaves[d.nome] = valor;
      else facetas[d.nome] = valor;
    }
    return { chaves, facetas };
  }, [dims, selecao]);

  const serieLocais = useMemo(
    () => (aba && recorte ? serieLocalidade(aba, recorte) : []),
    [aba, recorte],
  );
  const valorAtual = useMemo(
    () => (aba && recorte ? consultar(aba, { ...recorte, localidade }) : null),
    [aba, recorte, localidade],
  );
  const serieEixo = useMemo(
    () => (aba && recorte && eixo ? serieDimensao(aba, { ...recorte, localidade }, eixo) : []),
    [aba, recorte, localidade, eixo],
  );

  const dimsI18n = t('dashboard.dimensions', { returnObjects: true }) as Record<string, string>;
  const valsI18n = t('dashboard.values', { returnObjects: true }) as unknown as Record<string, string>;
  const rotuloDim = (nome: string) => dimsI18n?.[nome] ?? nome;
  const rotuloValor = (valor: string) => valsI18n?.[valor] ?? valor;

  const unidade =
    indicador.unidade === 'porcento' ? '%' : t(`dashboard.units.${indicador.unidade}`);

  return (
    <section className={`dash-main accent-${indicador.accent}`} aria-live="polite">
      <span className="dash-glow" aria-hidden="true" />
      <header className="dash-head">
        <h3 className="dash-title">{t(`dashboard.indicators.${indicador.id}.title`)}</h3>
        <p className="dash-description">{t(`dashboard.indicators.${indicador.id}.description`)}</p>
      </header>

      <div className="dash-filters">
        <span className="dash-filters-label">
          <SlidersHorizontal size={13} /> {t('dashboard.subfilters')}
        </span>
        <div className="dash-filter">
          <span className="dash-filter-label">{t('dashboard.locality')}</span>
          <Dropdown
            ariaLabel={t('dashboard.locality')}
            valor={localidade}
            opcoes={(aba ? localidades(aba) : []).map((l) => ({ valor: l, rotulo: l }))}
            onChange={setLocalidade}
          />
        </div>
        {dims.map((d) => (
          <div key={d.nome} className="dash-filter">
            <span className="dash-filter-label">{rotuloDim(d.nome)}</span>
            <Dropdown
              ariaLabel={rotuloDim(d.nome)}
              valor={selecao[d.nome] ?? ''}
              opcoes={(candidatos[d.nome] ?? []).map((v) => ({ valor: v, rotulo: rotuloValor(v) }))}
              onChange={(v) => setSelecao((s) => ({ ...s, [d.nome]: v }))}
            />
          </div>
        ))}
        <div className="dash-filter dash-filter--axis">
          <span className="dash-filter-label">{t('dashboard.axis')}</span>
          <Dropdown
            ariaLabel={t('dashboard.axis')}
            valor={eixo}
            opcoes={dims.map((d) => ({ valor: d.nome, rotulo: rotuloDim(d.nome) }))}
            onChange={setEixo}
          />
        </div>
      </div>

      <div className="dash-value">
        <span className="dash-value-number">
          {valorAtual !== null ? formatNumber(valorAtual, indicador.casas) : '—'}
        </span>
        <span className="dash-value-unit">{unidade}</span>
        <span className="dash-value-scope">
          <MapPin size={13} /> {localidade}
        </span>
      </div>

      <div className="dash-charts">
        <BarList
          titulo={t('dashboard.local_title')}
          barras={serieLocais.map((s) => ({
            rotulo: s.localidade,
            valor: s.valor,
            destaque: s.localidade === localidade,
          }))}
          unidade={unidade}
          casas={indicador.casas}
        />
        {eixo && (
          <BarList
            titulo={`${t('dashboard.series_title')} · ${rotuloDim(eixo)}`}
            barras={serieEixo.map((s) => ({ rotulo: rotuloValor(s.rotulo), valor: s.valor }))}
            unidade={unidade}
            casas={indicador.casas}
          />
        )}
      </div>
    </section>
  );
};

/** Versão apresentacional: recebe os dados já carregados (testável sem rede). */
export const DashboardView = ({ data }: { data: CensoData }) => {
  const { t } = useTranslation();
  const [indicadorId, setIndicadorId] = useState(indicadores[0]?.id ?? '');

  const indicador: IndicadorCenso =
    indicadores.find((i) => i.id === indicadorId) ?? indicadores[0];

  return (
    <div className="container">
      <div className="section-header">
        <span className="section-tag">{t('dashboard.tag')}</span>
        <h2 className="section-title">{t('dashboard.title')}</h2>
        <p className="section-subtitle">{t('dashboard.subtitle')}</p>
      </div>

      <div className="dash-grid">
        <aside className="dash-list" aria-label={t('dashboard.select')}>
          <span className="dash-list-label">{t('dashboard.select')}</span>
          {indicadores.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`dash-option accent-${item.accent} ${item.id === indicador.id ? 'is-active' : ''}`}
              aria-pressed={item.id === indicador.id}
              onClick={() => setIndicadorId(item.id)}
            >
              {t(`dashboard.indicators.${item.id}.title`)}
            </button>
          ))}
        </aside>

        <PainelIndicador data={data} indicador={indicador} />
      </div>

      <p className="dash-note">
        <Database size={13} /> {t('dashboard.source', { fonte: data.fonte })}
      </p>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { data, carregando, erro } = useCenso();

  return (
    <div className="dashboard">
      {carregando && <p className="dash-status">{t('dashboard.loading')}</p>}
      {erro && <p className="dash-status dash-status--erro">{t('dashboard.error')}</p>}
      {data && <DashboardView data={data} />}
    </div>
  );
};

export default Dashboard;
