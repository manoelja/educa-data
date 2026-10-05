import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Mail } from 'lucide-react';
import './Footer.css';

interface SourceLink {
  label: string;
  href: string;
}

const CONTACT_EMAIL = 'contato@educadata.org.br';

const Footer = () => {
  const { t } = useTranslation();

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
            <a className="footer-mail" href={`mailto:${CONTACT_EMAIL}`}>
              <Mail size={15} /> {CONTACT_EMAIL}
            </a>
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
