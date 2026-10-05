import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Languages, ChevronDown, Menu, X } from 'lucide-react';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useTheme } from '../../hooks/useTheme';
import './Navbar.css';

const SectionIds = ['hero', 'about', 'sources', 'analyses', 'dashboard', 'contact'];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isLight, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const activeSection = useActiveSection(SectionIds);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.classList.add('mobile-menu-open');

      const preventScroll = (e: Event) => {
        if ((e.target as HTMLElement).closest('.mobile-drawer')) return;
        e.preventDefault();
      };
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });

      return () => {
        document.body.classList.remove('mobile-menu-open');
        window.scrollTo(0, scrollY);
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);
      };
    }
  }, [isMobileMenuOpen]);

  const languages = [
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
  ];

  const navLinks = useMemo(
    () => [
      { id: 'hero', label: t('nav.home') },
      { id: 'about', label: t('nav.about') },
      { id: 'sources', label: t('nav.sources') },
      { id: 'analyses', label: t('nav.analyses') },
      { id: 'dashboard', label: t('nav.dashboard') },
      { id: 'contact', label: t('nav.contact') },
    ],
    [t]
  );

  const currentLang = i18n.language.split('-')[0];

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'shrunk' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container navbar-content">
        <a className="logo" href="#hero">
          Educa<span>Data</span>
        </a>

        <ul className="nav-links desktop-only">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className={activeSection === link.id ? 'active' : ''}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-controls">
          {/* Alterna os dois acabamentos do quadro: verde (claro) e ardósia (escuro) */}
          <button
            className="control-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={t('nav.theme_toggle')}
          >
            {isLight ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="lang-container desktop-only">
            <button
              className={`control-btn lang-toggle ${isLangOpen ? 'active' : ''}`}
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label={t('nav.change_language')}
              aria-expanded={isLangOpen}
            >
              <Languages size={18} />
              <span className="current-lang">{currentLang.toUpperCase()}</span>
              <ChevronDown size={14} className={`chevron ${isLangOpen ? 'open' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  className="lang-dropdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`lang-option ${currentLang === lang.code ? 'selected' : ''}`}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span className="lang-label">{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="control-btn mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t('nav.menu_close') : t('nav.menu_open')}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-drawer-header">
                <div className="logo">
                  Educa<span>Data</span>
                </div>
                <button className="control-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <ul className="mobile-nav-links">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a
                      href={`#${link.id}`}
                      className={activeSection === link.id ? 'active' : ''}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mobile-drawer-footer">
                <p className="lang-title">{t('nav.change_language')}</p>
                <div className="mobile-lang-options">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`mobile-lang-btn ${currentLang === lang.code ? 'selected' : ''}`}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span>{lang.flag}</span> {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
