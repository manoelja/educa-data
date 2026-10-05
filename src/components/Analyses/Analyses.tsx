import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import ChalkDecor from '../Common/ChalkDecor';
import { getIcon } from '../../lib/icons';
import { formatNumber } from '../../lib/format';
import { analyses } from '../../data/indicators';
import type { ChalkAccentName } from '../../lib/scene/chalk';
import './Analyses.css';

/** Um giz diferente por análise — o quadro vai sendo preenchido card a card */
const ANALYSIS_ACCENTS: ChalkAccentName[] = ['bars', 'wave', 'arrow', 'circle', 'formula', 'ticks'];

const TREND_ICONS = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const;

const Analyses = () => {
  const { t } = useTranslation();

  return (
    <div className="analyses">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t('analyses.tag')}</span>
          <h2 className="section-title">{t('analyses.title')}</h2>
          <p className="section-subtitle">{t('analyses.subtitle')}</p>
        </div>

        <div className="analyses-grid">
          {analyses.map((item, index) => {
            const Icon = getIcon(item.icon);
            const TrendIcon = TREND_ICONS[item.trend];

            return (
              <motion.article
                key={item.id}
                className={`card analysis-card accent-${item.accent}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                <ChalkDecor
                  accent={ANALYSIS_ACCENTS[index % ANALYSIS_ACCENTS.length]}
                  color={index}
                />
                <header className="analysis-head">
                  <span className="analysis-icon">
                    <Icon size={20} />
                  </span>
                  <span className={`analysis-trend trend-${item.trend}`}>
                    <TrendIcon size={14} />
                    {t(`analyses.trends.${item.trend}`)}
                  </span>
                </header>

                <div className="analysis-metric">
                  <strong>
                    {formatNumber(item.value, item.decimals)}
                    <span className="metric-unit">{item.unit}</span>
                  </strong>
                  <span className="metric-caption">{t('analyses.metric_label')}</span>
                </div>

                <h3 className="card-title">{t(`analyses.items.${item.id}.title`)}</h3>
                <p className="card-text">{t(`analyses.items.${item.id}.description`)}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analyses;
