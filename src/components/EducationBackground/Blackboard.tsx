import './Blackboard.css';

/**
 * As marcas que "sobraram da aula": 15 traços de giz (barras, curva, conta e
 * círculo) espalhados pelo quadro e borrados. São formas em CSS — nenhum
 * texto — e ficam fora da árvore de acessibilidade.
 *
 * Cada entrada é `[variante, x%, y%, rotação]`; a opacidade inteira da camada
 * é presa em `--scene-intensity` (ver Blackboard.css).
 */
const MARCAS: Array<[variante: string, x: number, y: number, rot: number]> = [
  ['barras', 6, 14, -6],
  ['curva', 24, 72, 4],
  ['conta', 47, 11, -3],
  ['circulo', 77, 21, 8],
  ['barras', 88, 63, 5],
  ['curva', 63, 85, -7],
  ['conta', 15, 46, 2],
  ['circulo', 36, 32, -10],
  ['barras', 55, 54, 3],
  ['curva', 90, 39, -4],
  ['conta', 70, 75, 6],
  ['circulo', 5, 81, -5],
  ['barras', 30, 87, -2],
  ['curva', 42, 64, 9],
  ['conta', 84, 87, -8],
];

/**
 * O quadro da página inteira: superfície fixa (verde de lousa no tema claro,
 * ardósia no escuro) com o reflexo de luz passeando muito devagar (90s), as
 * marcas apagadas ao fundo e a **moldura de madeira** em volta — é ela que
 * delimita "dentro do quadro", e o corpo da página é recuado por
 * `--board-frame` para o conteúdo passar sempre por dentro dela.
 */
const Blackboard = () => (
  <div className="blackboard">
    <div className="board-surface" />

    <div className="board-ghosts" aria-hidden="true">
      {MARCAS.map(([variante, x, y, rot], i) => (
        <span
          key={i}
          className={`board-ghost board-ghost--${variante}`}
          style={{ left: `${x}%`, top: `${y}%`, transform: `rotate(${rot}deg)` }}
        />
      ))}
    </div>

    <div className="board-sheen" />
    <div className="board-vignette" />
  </div>
);

export default Blackboard;
