#!/usr/bin/env node
// Draw every figure in specs.mjs as an SVG under public/images/figures/.
// Colours come from one palette; the contrast gate (documd's thresholds: text 4.5,
// line 3.0) runs first and fails the build on a bad pair.
import fs from 'node:fs/promises'
import path from 'node:path'
import { FIGURES, PALETTE } from './specs.mjs'

const OUT = path.join(process.cwd(), 'public', 'images', 'figures')
const FONT = `"IBM Plex Mono", Menlo, Consolas, monospace`

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map(i => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const CHECKS = [
  ['ink on paper', PALETTE.ink, PALETTE.paper, 4.5],
  ['muted on paper', PALETTE.muted, PALETTE.paper, 4.5],
  ['ink on surface', PALETTE.ink, PALETTE.surface, 4.5],
  ['paper on accent', PALETTE.paper, PALETTE.accent, 4.5],
  ['ink on alert', PALETTE.ink, PALETTE.alert, 4.5],
  ['ink on ok tint', PALETTE.ink, PALETTE.okTint, 4.5],
  ['ok on paper (text)', PALETTE.ok, PALETTE.paper, 4.5],
  ['line on paper', PALETTE.ink, PALETTE.paper, 3.0],
]
let failed = 0
for (const [name, fg, bg, min] of CHECKS) {
  const r = contrast(fg, bg)
  const pass = r >= min
  if (!pass) failed += 1
  console.log(`[figures] ${pass ? 'ok  ' : 'FAIL'} ${name}: ${r.toFixed(2)} (min ${min})`)
}
if (failed) {
  console.error(`[figures] ${failed} contrast pair(s) below threshold`)
  process.exit(1)
}

const TONES = {
  paper: { fill: PALETTE.surface, stroke: PALETTE.ink, title: PALETTE.ink, sub: PALETTE.muted },
  accent: { fill: PALETTE.accent, stroke: PALETTE.accent, title: PALETTE.paper, sub: PALETTE.paper },
  alert: { fill: PALETTE.alert, stroke: PALETTE.ink, title: PALETTE.ink, sub: PALETTE.ink },
  ok: { fill: PALETTE.okTint, stroke: PALETTE.ok, title: PALETTE.ink, sub: PALETTE.ink },
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function anchor(n, side) {
  const cx = n.x + n.w / 2
  const cy = n.y + n.h / 2
  return { r: [n.x + n.w, cy], l: [n.x, cy], t: [cx, n.y], b: [cx, n.y + n.h] }[side]
}

// right-angle routes only: across the gap for 'h', down the gap for 'v'
function route(a, b, dir) {
  if (dir === 'h') {
    const [x1, y1] = anchor(a, 'r')
    const [x2, y2] = anchor(b, 'l')
    if (Math.abs(y1 - y2) < 0.5) return [[x1, y1], [x2, y2]]
    const xm = (x1 + x2) / 2
    return [[x1, y1], [xm, y1], [xm, y2], [x2, y2]]
  }
  const [x1, y1] = anchor(a, 'b')
  const [x2, y2] = anchor(b, 't')
  if (Math.abs(x1 - x2) < 0.5) return [[x1, y1], [x2, y2]]
  const ym = (y1 + y2) / 2
  return [[x1, y1], [x1, ym], [x2, ym], [x2, y2]]
}

function labelPoint(pts, dir) {
  const [sx, sy] = pts[0]
  const [ex, ey] = pts[pts.length - 1]
  if (dir === 'h') return { x: (sx + ex) / 2, y: sy - 9, anchor: 'middle' }
  return { x: sx + 10, y: (sy + ey) / 2 + 4, anchor: 'start' }
}

function drawFigure(name, spec) {
  const byId = Object.fromEntries(spec.nodes.map(n => [n.id, n]))
  const out = []
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.w}" height="${spec.h}" viewBox="0 0 ${spec.w} ${spec.h}" role="img" aria-label="${esc(name)}">`,
    `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.ink}"/></marker></defs>`,
    `<style>.title{font:600 14px ${FONT}}.sub{font:400 11px ${FONT}}.edge{font:400 11px ${FONT};fill:${PALETTE.muted}}.num{font:600 12px ${FONT}}</style>`,
    `<rect width="${spec.w}" height="${spec.h}" fill="${PALETTE.paper}"/>`,
  )
  for (const [from, to, dir, label] of spec.edges) {
    const pts = route(byId[from], byId[to], dir)
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
    out.push(`<path d="${d}" fill="none" stroke="${PALETTE.ink}" stroke-width="1.5" marker-end="url(#arrow)"/>`)
    if (label) {
      const p = labelPoint(pts, dir)
      out.push(`<text x="${p.x}" y="${p.y}" text-anchor="${p.anchor}" class="edge">${esc(label)}</text>`)
    }
  }
  for (const n of spec.nodes) {
    const t = TONES[n.tone || 'paper']
    out.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" fill="${t.fill}" stroke="${t.stroke}" stroke-width="1.5"/>`)
    out.push(`<text x="${n.x + 14}" y="${n.y + 30}" class="title" fill="${t.title}">${esc(n.title)}</text>`)
    n.sub.forEach((line, i) => out.push(`<text x="${n.x + 14}" y="${n.y + 52 + i * 15}" class="sub" fill="${t.sub}">${esc(line)}</text>`))
    if (n.n) {
      const cx = n.x - 2
      const cy = n.y - 2
      out.push(`<circle cx="${cx}" cy="${cy}" r="12" fill="${PALETTE.accent}" stroke="${PALETTE.paper}" stroke-width="2"/>`)
      out.push(`<text x="${cx}" y="${cy + 4}" text-anchor="middle" class="num" fill="${PALETTE.paper}">${n.n}</text>`)
    }
  }
  out.push('</svg>')
  return `${out.join('\n')}\n`
}

await fs.mkdir(OUT, { recursive: true })
for (const [name, spec] of Object.entries(FIGURES)) {
  await fs.writeFile(path.join(OUT, `${name}.svg`), drawFigure(name, spec))
  console.log(`[figures] wrote ${name}.svg (${spec.w}x${spec.h}, ${spec.nodes.length} nodes, ${spec.edges.length} edges)`)
}
