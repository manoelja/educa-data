import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import ChalkDecor from '../Common/ChalkDecor';
import './About.css';

interface AboutCard {
  label: string;
  title: string;
  description: string;
}

const About = () => {
  const { t } = useTranslation();

  const cards = t('about.cards', { returnObjects: true }) as unknown as AboutCard[];
  const checklist = t('about.checklist', { returnObjects: true }) as unknown as string[];

  return (
    <div className="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t('about.tag')}</span>
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="section-subtitle">{t('about.subtitle')}</p>
        </div>

        <div className="about-grid">
          {cards.map((card, index) => (
            <motion.article
              key={card.label}
              className="card about-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
            >
              {/* Cada card tem o seu giz: o desenho entra junto com o texto */}
              <ChalkDecor accent={index % 2 === 0 ? 'ticks' : 'formula'} color={index + 1} />
              <span className="card-label">{card.label}</span>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-text">{card.description}</p>
            </motion.article>
          ))}
        </div>

        <div className="about-panel">
          <motion.div
            className="about-mission"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <ChalkDecor accent="underline" color={4} />
            <span className="about-mission-label">
              <Target size={14} /> {t('about.mission_title')}
            </span>
            <p className="about-mission-text">{t('about.mission_text')}</p>

            <ul className="about-checklist">
              {checklist.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} /> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="about-alert"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AlertTriangle size={18} />
            <p>{t('about.alert')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
