#!/usr/bin/env node
/**
 * censo.mjs
 *
 * Lê as planilhas .xlsx do Censo Demográfico 2022 (IBGE/SIDRA) em
 * `public/censo-sidra-ibge/` e gera `public/data/censo2022.json` — a base
 * achatada, pronta para a landing consumir via fetch (sem entrar no bundle).
 *
 * Por que colunar: as planilhas do SIDRA têm até 400+ colunas. Guardar as
 * linhas como objetos repetiria o nome de cada coluna em cada linha (3,4 MB
 * com Brasile+UF). No formato colunar os nomes aparecem uma única vez em
 * `colunas` e cada linha é um array alinhado por índice (753 KB).
 *
 * Cabeçalho do SIDRA (índices 0-based):
 *   0: título · 1: variável · 2: eixos/anos · 3..N: categorias · N+1..: dados
 * Células mescladas são reconstruídas com forward-fill horizontal (rótulos)
 * e vertical (localidade). Sentinelas `-`, `..`, `...`, `X` viram null.
 *
 * O recorte de localidades é o que vier nas planilhas (neste export: Brasil,
 * Goiás e Edealina/GO). O script descarta linhas sem valor (rodapé "Fonte: …").
 *
 * Uso:
 *   node scripts/censo.mjs             # todas as localidades da planilha
 *   node scripts/censo.mjs --so-uf     # só Brasil + Unidades da Federação
 *   node scripts/censo.mjs --out=public/data/foo.json
 *
 * O JSON gerado é commitado; a base bruta (.xlsx) fica fora do git.
 */
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, dirname, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_DIR = join(ROOT, 'public', 'censo-sidra-ibge');
const DEFAULT_OUT = join(ROOT, 'public', 'data', 'censo2022.json');

/** Localidades mantidas no recorte padrão (Brasil + UFs). */
const UF_NAMES = new Set([
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
  'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins',
]);
const UF_CODES = new Set([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
]);

/** Sentinela de "sem dado" usada nas planilhas do SIDRA. */
const NA = new Set(['-', '--', '..', '...', '.', 'X', 'x', '*', '']);

/** Sobe a árvore de diretórios e devolve os .xlsx (ignora temporários). */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('~$')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.xlsx$/i.test(entry.name)) out.push(full);
  }
  return out.sort();
}

function clean(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') {
    const s = v.trim();
    return s === '' ? null : s;
  }
  return v;
}

/** Converte para número; devolve null para sentinelas e textos. */
function toNumber(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    if (NA.has(v)) return null;
    const s = v.replace(/\s/g, '');
    return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
  }
  return null;
}

/** Forward-fill horizontal: reconstrói rótulos de células mescladas. */
function forwardFill(row) {
  const out = row.slice();
  let last = null;
  for (let c = 0; c < out.length; c++) {
    if (out[c] !== null) last = out[c];
    else out[c] = last;
  }
  return out;
}

function toGrid(ws) {
  const ref = ws['!ref'];
  if (!ref) return null;
  const maxCol = XLSX.utils.decode_range(ref).e.c;
  const rows = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    raw: true,
    defval: null,
    blankrows: true,
  });
  const normalized = rows.map((r) => {
    const out = r.slice(0, maxCol + 1).map(clean);
    while (out.length <= maxCol) out.push(null);
    return out;
  });

  // Descarta colunas totalmente vazias no fim (o range do xlsx costuma vir
  // mais largo que o conteúdo, o que criaria rótulos-fantasma no forward-fill).
  let maxUsed = -1;
  for (const row of normalized) {
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== null) maxUsed = Math.max(maxUsed, c);
    }
  }
  if (maxUsed < 0) return null;

  return normalized.map((r) => {
    const out = r.slice(0, maxUsed + 1);
    while (out.length <= maxUsed) out.push(null);
    return out;
  });
}

/** Achata uma aba no formato colunar: `colunas` (nomes) + `linhas` (arrays). */
function parseSheet(ws) {
  const grid = toGrid(ws);
  if (!grid || grid.length < 5) return null;

  const eixos = grid[2] || [];

  // Coluna onde começam os valores: a célula "Ano..." na linha de eixos.
  let vStart = eixos.findIndex((v) => typeof v === 'string' && /^ano\b/i.test(v));
  if (vStart < 0) vStart = Math.max(1, eixos.filter((v) => v !== null).length);

  // Primeira linha de dados: coluna A preenchida e mais alguma célula preenchida.
  let dataStart = -1;
  for (let r = 3; r < grid.length; r++) {
    if (grid[r][0] !== null && grid[r].some((v, i) => i > 0 && v !== null)) {
      dataStart = r;
      break;
    }
  }
  if (dataStart < 0) return null;

  const headerEnd = dataStart - 1;
  if (headerEnd < 3) return null; // sem linhas de categoria de valor

  const headerRows = [];
  for (let r = 3; r <= headerEnd; r++) headerRows.push(forwardFill(grid[r]));

  const maxCol = grid[0].length - 1;

  // Índices 0..vStart-1: coluna de localidade + eixos-chave.
  // Índices vStart..maxCol: colunas de valor (o índice coincide com a coluna original).
  const nomes = ['localidade'];
  for (let c = 1; c < vStart; c++) nomes.push(eixos[c] ?? `chave${c}`);

  for (let c = vStart; c <= maxCol; c++) {
    const parts = [];
    let last = null;
    for (const hr of headerRows) {
      const v = hr[c];
      if (v !== null && v !== last) {
        parts.push(String(v));
        last = v;
      }
    }
    nomes.push(parts.length ? parts.join(' · ') : `col${c}`);
  }

  // Desambigua nomes repetidos.
  const seen = new Map();
  const colunas = nomes.map((n) => {
    const count = (seen.get(n) ?? 0) + 1;
    seen.set(n, count);
    return count > 1 ? `${n} (${count})` : n;
  });

  // Facetas: decompõe cada coluna de valor em dimensões estruturadas.
  // O rótulo do eixo em `eixos[vStart]` (ex.: "Ano x Sexo x Cor ou raça")
  // dá os nomes dos níveis, alinhados às linhas de cabeçalho de cima para baixo.
  let facetaNomes = null;
  let facetaValores = null;
  let colunasFacetas = null;
  const eixoValor = vStart >= 0 && typeof eixos[vStart] === 'string' ? eixos[vStart] : '';
  const nivelNomes = eixoValor.split(/\s+x\s+/i).map((s) => s.trim()).filter(Boolean);

  if (nivelNomes.length > 0 && nivelNomes.length === headerRows.length) {
    facetaNomes = nivelNomes;
    facetaValores = nivelNomes.map(() => []);
    colunasFacetas = new Array(colunas.length).fill(null);

    for (let c = vStart; c <= maxCol; c++) {
      const indices = [];
      let completo = true;
      for (let l = 0; l < nivelNomes.length; l++) {
        const categoria = headerRows[l][c];
        if (categoria === null) {
          completo = false;
          break;
        }
        const texto = String(categoria);
        let pos = facetaValores[l].indexOf(texto);
        if (pos < 0) {
          pos = facetaValores[l].length;
          facetaValores[l].push(texto);
        }
        indices.push(pos);
      }
      colunasFacetas[c] = completo ? indices : null;
    }
  }

  const linhas = [];
  let loc = null;
  for (let r = dataStart; r < grid.length; r++) {
    const row = grid[r];
    if (row.every((v) => v === null)) continue;
    if (row[0] !== null) loc = row[0];

    const arr = new Array(colunas.length).fill(null);
    if (loc !== null) arr[0] = loc;
    for (let k = 1; k < vStart; k++) arr[k] = row[k];
    for (let c = vStart; c <= maxCol; c++) arr[c] = toNumber(row[c]);

    // Só entra linha com pelo menos um valor (descarta rodapé "Fonte: …").
    if (arr.some((v, i) => i >= vStart && v !== null)) linhas.push(arr);
  }

  return { colunas, linhas, facetaNomes, facetaValores, colunasFacetas };
}

function readMeta(ws) {
  const grid = toGrid(ws);
  if (!grid) return { titulo: null, variavel: null };
  return {
    titulo: typeof grid[0]?.[0] === 'string' ? grid[0][0] : null,
    variavel: typeof grid[1]?.[0] === 'string' ? grid[1][0] : null,
  };
}

function readNotas(wb) {
  const name = wb.SheetNames.find((n) => /^notas$/i.test(n));
  if (!name) return [];
  const grid = toGrid(wb.Sheets[name]);
  if (!grid) return [];
  return grid
    .map((row) => row.slice(0, 2).filter((v) => v !== null).map(String).join(' — '))
    .filter((line) => line && !/^notas$/i.test(line));
}

function isUf(loc) {
  return loc === 'Brasil' || UF_NAMES.has(loc) || UF_CODES.has(loc);
}

function main() {
  const args = process.argv.slice(2);
  const soUf = args.includes('--so-uf');
  const outArg = args.find((a) => a.startsWith('--out='));
  const outPath = outArg ? join(ROOT, outArg.slice('--out='.length)) : DEFAULT_OUT;

  if (!existsSync(BASE_DIR)) {
    console.error(
      `Base não encontrada em ${relative(ROOT, BASE_DIR)}. ` +
        'Coloque as planilhas do Censo 2022 (IBGE/SIDRA) lá.',
    );
    process.exit(1);
  }

  const files = walk(BASE_DIR);
  const temas = {};
  let totalLinhas = 0;
  let totalTabelas = 0;
  let abasComFacetas = 0;
  let abasTotal = 0;

  for (const file of files) {
    const rel = relative(BASE_DIR, file).split(sep);
    const tema = rel.length > 1 ? rel[0] : 'Geral';
    const tabelaId = basename(file).replace(/\.xlsx$/i, '');

    const wb = XLSX.readFile(file);
    const abas = {};
    let titulo = null;
    let variavel = null;
    let linhasTabela = 0;

    for (const name of wb.SheetNames) {
      if (/^notas$/i.test(name)) continue;
      const parsed = parseSheet(wb.Sheets[name]);
      if (!parsed) continue;
      if (titulo === null) {
        const meta = readMeta(wb.Sheets[name]);
        titulo = meta.titulo;
        variavel = meta.variavel;
      }
      if (soUf) {
        parsed.linhas = parsed.linhas.filter((l) => isUf(l[0]));
      }
      if (parsed.facetaNomes) abasComFacetas += 1;
      abasTotal += 1;
      abas[name] = parsed;
      linhasTabela += parsed.linhas.length;
    }

    if (Object.keys(abas).length === 0) continue;

    temas[tema] ??= {};
    temas[tema][tabelaId] = {
      titulo,
      variavel,
      notas: readNotas(wb),
      abas,
    };
    totalLinhas += linhasTabela;
    totalTabelas += 1;
  }

  const payload = {
    fonte: 'IBGE — Censo Demográfico 2022 (SIDRA)',
    escopo: soUf ? 'Brasil e Unidades da Federação' : 'localidades do export SIDRA',
    formato: 'colunar (colunas[i] ↔ linhas[][i])',
    resumo: {
      temas: Object.keys(temas).length,
      tabelas: totalTabelas,
      linhas: totalLinhas,
      abas: abasTotal,
      abasComFacetas,
    },
    temas,
  };

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(payload)}\n`, 'utf8');

  const kb = (Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(0);
  console.log(
    `OK · ${files.length} planilhas · ${totalTabelas} tabelas · ${totalLinhas} linhas · ` +
      `${abasComFacetas} abas com facetas · ~${kb} KB`,
  );
  console.log(`→ ${relative(ROOT, outPath)}`);
}

main();
