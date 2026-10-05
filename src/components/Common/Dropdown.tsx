import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css';

export interface DropdownOpcao {
  valor: string;
  rotulo: string;
}

interface DropdownProps {
  /** Nome acessível do controle (também exibido pelos testes via label) */
  ariaLabel: string;
  valor: string;
  opcoes: DropdownOpcao[];
  onChange: (valor: string) => void;
}

/**
 * Dropdown próprio: o `<select>` nativo é desenhado pelo sistema, então a lista
 * aberta não acompanha o tema do quadro. Aqui o gatilho e a lista são do mesmo
 * tamanho e usam os tokens da página (vidro, borda, giz).
 */
const Dropdown = ({ ariaLabel, valor, opcoes, onChange }: DropdownProps) => {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    const aoClicarFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false);
    };

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  const atual = opcoes.find((o) => o.valor === valor) ?? opcoes[0];

  return (
    <div
      className="dropdown"
      ref={ref}
      // Com a caixa aberta, a roda do mouse pertence a ela: rola as opções
      // para cima/baixo (ou fica parada, se não há o que rolar) em vez de
      // trocar de seção — "hold" é lido pelo handler em App.tsx.
      data-wheel-scroll={aberto ? 'hold' : undefined}
    >
      <button
        type="button"
        className="dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={ariaLabel}
        onClick={() => setAberto((a) => !a)}
      >
        <span className="dropdown-value">{atual?.rotulo ?? valor}</span>
        <ChevronDown size={14} className="dropdown-chevron" aria-hidden="true" />
      </button>

      {aberto && (
        <ul className="dropdown-menu" role="listbox" aria-label={ariaLabel}>
          {opcoes.map((opcao) => (
            <li
              key={opcao.valor}
              role="option"
              aria-selected={opcao.valor === valor}
              className={`dropdown-option${opcao.valor === valor ? ' is-active' : ''}`}
              title={opcao.rotulo}
              onClick={() => {
                onChange(opcao.valor);
                setAberto(false);
              }}
            >
              {opcao.rotulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
