import './Frame.css';

/**
 * Moldura de madeira do quadro negro — renderizada separadamente da cena
 * para ficar com z-index alto (acima de todo o conteúdo) sem bloquear
 * scroll nem clique, graças a pointer-events: none.
 */
const Frame = () => (
  <div className="board-frame-overlay" aria-hidden="true">
    <span className="bo-frame bo-frame--top" />
    <span className="bo-frame bo-frame--right" />
    <span className="bo-frame bo-frame--bottom" />
    <span className="bo-frame bo-frame--left" />
    <span className="bo-frame-corner bo-frame-corner--tl" />
    <span className="bo-frame-corner bo-frame-corner--tr" />
    <span className="bo-frame-corner bo-frame-corner--bl" />
    <span className="bo-frame-corner bo-frame-corner--br" />
  </div>
);

export default Frame;
