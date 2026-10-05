<div align="center">

# EducaData Brasil

### Landing page — Dados abertos da educação básica brasileira

</div>

---

## Sobre o projeto

Landing page de um projeto de análise de **dados educacionais públicos**: as bases do **Censo Escolar**, do **SAEB/IDEB** e os indicadores de fluxo escolar viram uma leitura simples para gestores, professores e pesquisadores.

O objetivo da página é apresentar o projeto — o que ele faz, de onde vêm os dados, quais recortes já foram analisados — e levar o visitante para o painel interativo e para a metodologia.

> Projeto independente, sem vínculo institucional com o INEP ou o MEC. Todos os indicadores são descritivos e baseados em dados públicos e agregados.

---

## Seções da página

| Seção | O que traz |
|:--|:--|
| **Hero** | Badge de status, título com efeito de digitação e dois CTAs — bloco único de texto centralizado, direto sobre o quadro (sem painel de indicadores) |
| **Sobre** | Fonte e método do projeto, objetivo e os cuidados no tratamento das bases |
| **Dados** | As quatro fontes/ferramentas usadas (Censo Escolar, SAEB/IDEB, IBGE e a stack de análise) + chips de tecnologias |
| **Análises** | Seis recortes em destaque, cada um com o indicador, a tendência no período e o que ele significa |
| **Painel** | Painel interativo do Censo 2022 (IBGE): indicadores curados com comparativo de localidades e repartição |
| **Rodapé** | Navegação, links para as fontes oficiais, contato e aviso de independência |

---

## Recursos

- **3 idiomas** — Português, Inglês e Espanhol (i18next + detecção automática pelo navegador)
- **Painel interativo do Censo 2022** — indicadores curados do IBGE/SIDRA (alfabetização, deficiência, autismo, registro de nascimento…) com **subfiltros** auto-derivados (localidade, idade, sexo, cor/raça, grupo etário…), comparativo de localidades e **série por dimensão**; a base é carregada sob demanda de `public/data/`, fora do bundle
- **Dois acabamentos do mesmo quadro** — verde de lousa com moldura de madeira clara (padrão, como na referência) e ardósia escura com moldura nogueira; a escolha fica em `localStorage` e o `index.html` aplica a classe antes do primeiro paint (sem flash)
- **Animações** — Framer Motion (entrada por scroll, stagger do Hero, drawer mobile) + typewriter próprio e os **traços de giz desenhados card a card**
- **Fundo vetorial (CSS + SVG + canvas)** — superfície do quadro, **moldura de madeira com cantos em meia-esquadria**, marcas apagadas, reflexo de luz passeando e poeira de giz com profundidade real: sem imagem externa e sem clip-art
- **Eventos de giz coloridos** — cada card dispara um desenho de giz diferente quando entra na tela
- **Acessibilidade** — `aria-label` nos botões de ícone, cena inteira em `aria-hidden` (decoração nunca é a única fonte de informação), `prefers-reduced-motion` respeitado
- **Responsivo** — de celular a desktop, com menu em drawer abaixo de 900px

---

## Como rodar

Precisa do [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm install
npm run dev
```

Depois é só abrir `http://localhost:5173`.

---

## Scripts

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # tsc -b && vite build
npm run preview      # pré-visualiza o build
npm run lint         # ESLint (flat config)
npm run test         # Vitest em watch
npm run test:run     # Vitest uma vez
npm run data:censo   # reprocessa a base do Censo 2022 (IBGE/SIDRA)
```

### Base do Censo Demográfico 2022 (IBGE/SIDRA)

As planilhas brutas ficam em `public/censo-sidra-ibge/` (fora do git) e são
convertidas em `public/data/censo2022.json` por `scripts/censo.mjs`. Neste
export o recorte é **Brasil, Goiás e Edealina (GO)** — o painel se adapta a
qualquer conjunto de localidades que vier nas planilhas:

```bash
npm run data:censo            # todas as localidades do export (~900 KB)
npm run data:censo -- --so-uf # só Brasil + unidades da federação
```

O JSON sai em formato **colunar** (`colunas[i]` ↔ `linhas[][i]`) e é servido
estaticamente, então o painel o busca sob demanda — nada de ~950 KB entrando
no bundle JS. Cada coluna de valor carrega **facetas** estruturadas (ex.:
`{ Sexo: 'Total', 'Cor ou raça': 'Branca' }`), o que permite filtrar por
dimensão em vez de depender do rótulo achatado. O consumo fica em
`src/lib/censo.ts` (resolvedores puros), `src/hooks/useCenso.ts` (fetch) e
`src/data/dashboard.ts` (catálogo curado).

---

## Estrutura

```
src/
├── components/
│   ├── About/                 # seção "sobre o projeto"
│   ├── Analyses/              # cards de indicadores e tendências
│   ├── Common/
│   │   ├── ChalkDecor.tsx      # traço de giz colorido que se desenha ao entrar na tela
│   │   ├── DrawnChart.tsx      # micro-gráficos que se desenham
│   │   └── MagneticButton.tsx
│   ├── Dashboard/             # painel interativo do Censo 2022
│   ├── EducationBackground/   # cena: quadro com moldura, marcas apagadas e poeira de giz
│   ├── Footer/                # navegação, fontes e contato
│   ├── Hero/                  # título centralizado e typewriter
│   ├── Navbar/                # idioma e menu mobile
│   └── Sources/               # fontes de dados e tecnologias
├── data/
│   ├── indicators.ts          # números e estrutura dos indicadores
│   └── dashboard.ts           # catálogo curado do painel
├── hooks/                     # em uso: useTypewriter, useActiveSection, useTheme, useRafLoop, useCenso · hoje sem uso: useCountUp, usePointerParallax
├── lib/                       # format (números), icons (lucide), censo (base SIDRA) e scene/ (chalk, curva, projeção, ruído, ponteiro)
├── styles/global.css          # design tokens, botões, cards e layout
├── test/                      # Vitest + Testing Library
├── App.tsx
├── i18n.ts                    # textos pt / en / es
└── main.tsx
```

### Como o fundo é montado

O fundo **é o quadro**: a página inteira é a superfície de lousa, com moldura de madeira em volta, e todo o conteúdo passa por cima dela (dentro da moldura).

| Camada | Arquivo | Papel |
|:--|:--|:--|
| **Moldura** | `Blackboard.tsx` | madeira clara no tema padrão e nogueira no escuro: 4 barras com veio + 4 cantos em meia-esquadria, acima do scrim e do grão (é a borda física do quadro) |
| Superfície | `Blackboard.tsx` | gradiente de profundidade, trama de feltro, reflexo de luz passeando (90s) e vinheta |
| Marcas apagadas | `Blackboard.tsx` | 15 traços de giz que "sobraram de aula" (barras, curva, conta, círculo) desfocados: profundidade sem competir com o conteúdo |
| Poeira de giz | `ChalkDust.tsx` | canvas com profundidade real, bokeh e paralaxe própria — ~30% das partículas com cor de giz |
| Scrim + grão | `EducationBackground.css` | contraste do texto e textura de grão (`feTurbulence`) |
| Gráficos vivos | `Common/DrawnChart.tsx` | linha/barras/donut que se desenham ao entrar na tela |

### Os eventos de giz (o que cada card desenha)

Cada card dispara um **traço de giz colorido** quando entra na tela: a mão invisível escrevendo junto com o conteúdo. Os desenhos são abstratos — geometria, gráfico, conta — **nunca ícones**.

| Traço | Onde aparece |
|:--|:--|
| `underline` | Hero (sob os botões) e bloco de objetivo, no Sobre |
| `ticks` / `formula` | cards do Sobre |
| `bars` / `wave` / `circle` / `ticks` | cards das fontes de dados |
| `bars` / `wave` / `arrow` / `circle` / `formula` / `ticks` | as seis análises, em ciclo |
| `formula` | painel interativo |

Cada traço é desenhado em **duas passadas**: o pó do giz (traço largo e desfocado) e o traço firme, animado com `pathLength`. A cor sai da paleta em ciclo, e tudo desliga com `prefers-reduced-motion`.

### Paleta de giz e calibração

As cores vivem em **`src/lib/scene/chalk.ts`** — fonte única, com hex (SVG/CSS) e tripla rgb (canvas) — espelhadas em tokens no CSS (`--chalk-1..5`): branco, **amarelo (o acento único)**, ciano, rosa e verde.

**Calibração em um lugar só:** `--scene-intensity` (em `src/styles/global.css`) escala a opacidade da cena e dos traços — `0` desliga, `1` é o padrão. Também dá para calibrar pela URL: `/?scene=0.5`. Contraste do texto: `--scene-scrim-*`; tom da superfície do quadro: `--board-1..3`; madeira da moldura: `--frame-1..4`.

### Motor de animação

| Peça | Arquivo | Papel |
|:--|:--|:--|
| Loop único | `hooks/useRafLoop.ts` | um só `requestAnimationFrame` para toda a cena, com teto de FPS e pausa com a aba oculta |
| Ponteiro com inércia | `lib/scene/pointer.ts` + `hooks/usePointerParallax.ts` | um listener só; a poeira persegue o alvo em vez de colar no mouse |
| Projeção | `lib/scene/projection.ts` | `z` → escala, desfoque, `lerp` e `easeOutCubic` |
| Ruído | `lib/scene/noise.ts` | movimento orgânico das partículas (sem senoides previsíveis) |
| Curvas | `lib/scene/curve.ts` | construtor de linha/área usado pelos micro-gráficos |

Perf: DPR limitado a 2, poeira a 45 fps (150 partículas no máximo, menos no mobile) e cena estática com `prefers-reduced-motion`.

### Superfícies transparentes

Os cards **não têm fundo sólido**: `.card` (e os blocos equivalentes — objetivo e caixa do CTA) usam `background: transparent` + borda com cantos levemente irregulares e `backdrop-filter`, então o quadro aparece através deles e a leitura vem da borda, não de uma caixa opaca. O contraste do texto é responsabilidade do scrim (`--scene-scrim-*`).

### Dois acabamentos, um quadro

O fundo **é sempre o quadro com moldura de madeira** — o que muda entre os temas é o acabamento:

| Tema | Superfície | Moldura |
|:--|:--|:--|
| **Claro (padrão)** | verde de lousa escolar (`--board-1..3`) | madeira clara (pine), como na referência |
| **Escuro** (`html.dark-theme`) | ardósia quase preta | nogueira escura |

O toggle voltou ao navbar (`hooks/useTheme.ts`), a escolha é persistida em `localStorage` e a classe `dark-theme` é aplicada no `<html>` **antes do primeiro paint** pelo script do `index.html`.

**O conteúdo passa por dentro da moldura:** `--board-frame` (um `clamp`, 13–30px; 10px no celular) define a largura da moldura e **recua o corpo da página** (`body { padding: var(--board-frame) }`) — nada encosta na madeira, ela é o limite físico do quadro.

---

## Tecnologias

O projeto foi construído com **React 19 + TypeScript**, usando **Vite** como build tool, **Framer Motion** para animações, **i18next** para internacionalização e **Vitest + Testing Library** para os testes. A estilização é CSS puro com variáveis de tema — sem framework de UI — e o fundo é **vetorial (CSS + SVG inline + canvas)**, o que mantém o asset em ~0 KB e permite recalibrar o giz por token.

---

<div align="center">

**Feito para tornar indicadores educacionais públicos acessíveis a quem decide e a quem pesquisa.**

</div>
