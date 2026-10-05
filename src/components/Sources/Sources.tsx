import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ChalkDecor from '../Common/ChalkDecor';
import { getIcon } from '../../lib/icons';
import { dataSources } from '../../data/indicators';
import type { ChalkAccentName } from '../../lib/scene/chalk';
import './Sources.css';

/** Um giz diferente por card, em ciclo */
const SOURCE_ACCENTS: ChalkAccentName[] = ['bars', 'wave', 'circle', 'ticks'];

const Sources = () => {
  const { t } = useTranslation();
  const techs = t('sources.techs', { returnObjects: true }) as unknown as string[];

  return (
    <div className="sources">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t('sources.tag')}</span>
          <h2 className="section-title">{t('sources.title')}</h2>
          <p className="section-subtitle">{t('sources.subtitle')}</p>
        </div>

        <div className="sources-grid">
          {dataSources.map((source, index) => {
            const Icon = getIcon(source.icon);
            return (
              <motion.article
                key={source.id}
                className={`card source-card accent-${source.accent}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <ChalkDecor accent={SOURCE_ACCENTS[index % SOURCE_ACCENTS.length]} color={index + 2} />
                <div className="source-icon">
                  <Icon size={22} />
                </div>
                {source.badge && <span className="source-badge">{source.badge}</span>}
                <h3 className="card-title">{t(`sources.items.${source.id}.title`)}</h3>
                <p className="card-text">{t(`sources.items.${source.id}.description`)}</p>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="sources-tech"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="card-label">{t('sources.tech_title')}</span>
          <ul className="tech-chips">
            {techs.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Sources;
