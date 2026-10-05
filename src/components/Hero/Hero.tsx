import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import MagneticButton from '../Common/MagneticButton';
import ChalkDecor from '../Common/ChalkDecor';
import { useTypewriter } from '../../hooks/useTypewriter';
import './Hero.css';

const WORDS_PT = ['Censo Escolar', 'IDEB e Aprendizagem', 'Equidade na Educação'];
const WORDS_EN = ['School Census', 'Learning & IDEB', 'Equity in Education'];
const WORDS_ES = ['Censo Escolar', 'IDEB y Aprendizaje', 'Equidad en la Educación'];

const Hero = () => {
  const { t, i18n } = useTranslation();

  const words = useMemo(() => {
    switch (i18n.language.split('-')[0]) {
      case 'en':
        return WORDS_EN;
      case 'es':
        return WORDS_ES;
      default:
        return WORDS_PT;
    }
  }, [i18n.language]);

  const typewriterText = useTypewriter(words, 130, 2400);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="hero">
      <div className="container hero-container">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={itemVariants}>
            <span className="pulse-dot" />
            {t('hero.badge')}
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            {t('hero.title_pre')} <br />
            <span className="highlight">
              {typewriterText}
              <span className="cursor">|</span>
            </span>
          </motion.h1>

          <motion.p className="hero-description" variants={itemVariants}>
            {t('hero.description')}
          </motion.p>

          <motion.div className="hero-btns" variants={itemVariants}>
            <MagneticButton href="#analyses" className="btn btn-primary">
              {t('hero.cta_primary')}
            </MagneticButton>
            <MagneticButton href="#about" className="btn btn-ghost">
              {t('hero.cta_secondary')}
            </MagneticButton>
          </motion.div>

          <ChalkDecor accent="underline" color={1} className="chalk-decor--flow" />
        </motion.div>
      </div>

      <a className="scroll-indicator" href="#about">
        <span>{t('hero.scroll')}</span>
        <ChevronRight size={24} color="var(--accent-color)" aria-hidden="true" />
      </a>
    </div>
  );
};

export default Hero;
