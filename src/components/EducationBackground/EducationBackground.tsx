import Blackboard from './Blackboard';
import ChalkDust from './ChalkDust';
import './EducationBackground.css';

/**
 * Fundo da página: **o quadro negro**.
 *
 * A página inteira acontece sobre a ardósia — o quadro é fixo e os cards
 * passam por ele conforme o scroll. O giz entra em duas camadas: a poeira
 * suspensa (`ChalkDust`) e os traços coloridos que cada card desenha ao
 * entrar na tela (`Common/ChalkDecor`).
 *
 * A intensidade de tudo é uma variável só: `--scene-intensity` (em
 * `styles/global.css`) ou `/?scene=0.5` na URL — `0` desliga a cena.
 */
const EducationBackground = () => (
  <div className="scene" aria-hidden="true">
    <Blackboard />
    <ChalkDust />
    <div className="scene-scrim" />
    <div className="scene-grain" />
  </div>
);

export default EducationBackground;
