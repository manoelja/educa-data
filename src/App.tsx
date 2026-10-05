import { useEffect, useRef, useState, useCallback } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Sources from './components/Sources/Sources';
import Analyses from './components/Analyses/Analyses';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Footer/Footer';
import EducationBackground from './components/EducationBackground/EducationBackground';
import Frame from './components/EducationBackground/Frame';
import SectionChalk from './components/Common/SectionChalk';
import './styles/global.css';

const SECTION_IDS = ['hero', 'about', 'sources', 'analyses', 'dashboard', 'contact'];

function App() {
  const [currentPanel, setCurrentPanel] = useState(0);
  const isScrolling = useRef(false);
  /** Ponto em que o dedo tocou a tela — base do arrasto lateral (mobile). */
  const toque = useRef<{ x: number; y: number } | null>(null);

  const scrollToPanel = useCallback((index: number) => {
    if (index < 0 || index >= SECTION_IDS.length) return;
    setCurrentPanel(index);
    isScrolling.current = true;
    setTimeout(() => { isScrolling.current = false; }, 700);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (document.body.classList.contains('mobile-menu-open')) return;
      // A roda troca de seção em qualquer ponto da página (navegação lateral).
      // Exceção: áreas marcadas com [data-wheel-scroll] mudam o eixo da roda
      // para cima/baixo — rolam o conteúdo nativamente enquanto ainda há o que
      // rolar. São elas: as listas de barras do dashboard (série/localidade)
      // e a caixa de seleção aberta, que usa o valor "hold" e, mesmo sem o
      // que rolar, segura a roda em vez de trocar de seção. Fora dessas
      // áreas, a roda volta a navegar para o lado.
      const alvo = e.target as HTMLElement;
      const area = alvo.closest<HTMLElement>('[data-wheel-scroll]');
      if (area) {
        for (let no: Element | null = alvo; no; no = no.parentElement) {
          // Ainda tem o que rolar: deixa a rolagem nativa (vertical) acontecer.
          if (no.scrollHeight > no.clientHeight + 1) return;
          if (no === area) break;
        }
        if (area.dataset.wheelScroll === 'hold') {
          // Caixa aberta sem o que rolar: segura a roda em vez de trocar de seção.
          e.preventDefault();
          return;
        }
      }
      e.preventDefault();
      if (isScrolling.current) return;
      const delta = e.deltaY || e.deltaX;
      if (Math.abs(delta) < 10) return;
      if (delta > 0) {
        scrollToPanel(currentPanel + 1);
      } else {
        scrollToPanel(currentPanel - 1);
      }
    };

    // Toque (mobile): o arrasto na horizontal troca de seção; no vertical o
    // dedo é do navegador — ele rola o conteúdo da seção (.app-section tem
    // overflow-y: auto). O JS só observa o fim do gesto, nunca engole o
    // move, então a rolagem continua nativa e com momentum.
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      // Pinça/rolo multi-toque não é arrasto: ignora.
      toque.current = e.touches.length === 1 && t ? { x: t.clientX, y: t.clientY } : null;
    };

    const handleTouchCancel = () => {
      toque.current = null;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const inicio = toque.current;
      toque.current = null;
      if (!inicio) return;
      if (document.body.classList.contains('mobile-menu-open')) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - inicio.x;
      const dy = t.clientY - inicio.y;
      // Eixo vertical (ou gesto curto) = rolagem da seção, não navegação.
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
      // Caixa de seleção aberta sob o dedo: o arrasto fica com a caixa,
      // como a roda do mouse (ver data-wheel-scroll em Dropdown.tsx).
      const alvo = e.target as HTMLElement | null;
      const area = alvo?.closest?.<HTMLElement>('[data-wheel-scroll]');
      if (area?.dataset.wheelScroll === 'hold') return;
      if (isScrolling.current) return;
      scrollToPanel(currentPanel + (dx < 0 ? 1 : -1));
    };

    // Âncoras (#hero, #about…) navegam pelo painel horizontal. Não pode haver
    // scrollIntoView concorrente: ele rolaria o `.App` (overflow: hidden) e o
    // deslocamento se somaria ao translateX, caindo em outra seção.
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;
      const idx = SECTION_IDS.indexOf(id);
      if (idx >= 0) {
        e.preventDefault();
        scrollToPanel(idx);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    document.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
      document.removeEventListener('click', handleClick, true);
    };
  }, [currentPanel, scrollToPanel]);

  return (
    <>
      <EducationBackground />
      <Frame />
      <Navbar />

      <div className="App">
        <div
          className="app-track"
          style={{ transform: `translateX(-${currentPanel * 100}vw)` }}
        >
          <section id="hero" className="app-section">
            <SectionChalk section="hero" />
            <Hero />
          </section>
          <section id="about" className="app-section">
            <SectionChalk section="about" />
            <About />
          </section>
          <section id="sources" className="app-section">
            <SectionChalk section="sources" />
            <Sources />
          </section>
          <section id="analyses" className="app-section">
            <SectionChalk section="analyses" />
            <Analyses />
          </section>
          <section id="dashboard" className="app-section">
            <SectionChalk section="dashboard" />
            <Dashboard />
          </section>
          <section id="contact" className="app-section">
            <SectionChalk section="contact" />
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
