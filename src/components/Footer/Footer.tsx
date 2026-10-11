import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, Linkedin, User, X } from 'lucide-react';
import './Footer.css';

interface SourceLink {
  label: string;
  href: string;
}

const SOCIAL_LINKS = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/manoelja/educa-data' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/manoelja' },
  { key: 'portfolio', label: 'Portfolio', href: 'https://manoelja.vercel.app' },
];

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
};

const Footer = () => {
  const { t } = useTranslation();
  const [showAbout, setShowAbout] = useState(false);

  const sources = t('footer.sources', { returnObjects: true }) as unknown as SourceLink[];
  const navLinks = [
    { id: 'hero', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'sources', label: t('nav.sources') },
    { id: 'analyses', label: t('nav.analyses') },
  ];

  return (
    <div className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="footer-title">
              Educa<span>Data</span>
            </h2>
            <p className="footer-desc">{t('footer.description')}</p>
            <p className="footer-disclaimer">{t('footer.disclaimer')}</p>
            <p className="footer-author-credit">{t('footer.author_credit')}</p>
          </motion.div>

          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="footer-column-title">{t('footer.links_title')}</h3>
            <ul className="footer-list">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`}>{link.label}</a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="footer-column-title">{t('footer.sources_title')}</h3>
            <ul className="footer-list">
              {sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noopener noreferrer">
                    {source.label} <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="footer-column-title">{t('footer.contact_title')}</h3>
            <p className="footer-contact-text">{t('footer.contact_text')}</p>

            <div className="footer-social-icons">
              {SOCIAL_LINKS.map(({ key, label, href }) => {
                const Icon = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];

                return (
                  <motion.a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-btn"
                    aria-label={label}
                    title={label}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: 'var(--accent-soft)',
                      borderColor: 'var(--accent-color)',
                    }}
                  >
                    {Icon ? (
                      <Icon size={20} />
                    ) : (
                      <img src="/manoelja.svg" alt="" width="20" height="20" aria-hidden="true" />
                    )}
                  </motion.a>
                );
              })}
              <motion.button
                type="button"
                className="social-icon-btn"
                onClick={() => setShowAbout(!showAbout)}
                aria-label={t('footer.about_title')}
                title={t('footer.about_title')}
                aria-expanded={showAbout}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'var(--accent-soft)',
                  borderColor: 'var(--accent-color)',
                }}
              >
                <User size={20} />
              </motion.button>
            </div>

            <AnimatePresence>
              {showAbout && (
                <motion.div
                  className="developer-about-card"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="developer-about-header">
                    <h4>{t('footer.about_title')}</h4>
                    <button
                      type="button"
                      className="close-about-btn"
                      onClick={() => setShowAbout(false)}
                      aria-label="Fechar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="developer-about-text">{t('footer.about_text')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
