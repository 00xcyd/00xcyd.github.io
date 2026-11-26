// Figure specs. Every figure is drawn at the 680px article column, so the labels
// stay at true size. The rules are documd-visuals': one diagram per figure,
// right-angle connectors, arrows only where a relationship exists, numbers only
// for ordered steps, and every fact also stated in the post's prose.

export const PALETTE = {
  paper: '#f5efe1',
  surface: '#fbf7ee',
  ink: '#201d17',
  muted: '#5e5649',
  line: '#7b705c',
  accent: '#0b3d91',
  alert: '#fc3d21',
  ok: '#2f6b3a',
  okTint: '#e4ecd9',
}

const W = 680
const ROW = 46

const node = (id, x, y, title, sub, tone = 'paper', extra = {}) => ({ id, x, y, w: 184, h: 86, title, sub, tone, ...extra })

// three nodes across the column, joined left to right
const across = (items) => items.map(([title, sub, tone], i) => node(`a${i}`, 12 + i * 236, 42, title, sub, tone, { n: undefined }))
const acrossEdges = (labels) => labels.map((label, i) => [`a${i}`, `a${i + 1}`, 'h', label])

// stacked steps, top to bottom, numbered
const stackH = (count) => 40 + count * 86 + (count - 1) * ROW + 40
const stack = (items) =>
  items.map(([title, sub, tone = 'paper'], i) => ({
    id: `s${i}`,
    x: 170,
    y: 40 + i * (86 + ROW),
    w: 340,
    h: 86,
    title,
    sub,
    tone,
    n: i + 1,
  }))
const stackEdges = (count, labels = []) =>
  Array.from({ length: count - 1 }, (_, i) => [`s${i}`, `s${i + 1}`, 'v', labels[i] || ''])

export const FIGURES = {
  // hero: the local CA becomes trusted on the laptop, and the browser agrees
  'hero-trust': {
    w: W,
    h: 170,
    nodes: across([
      ['local cluster', ['cert-manager signs', 'the Lab Root CA'], 'accent'],
      ['laptop keychain', ['root imported to', 'the system trust']],
      ['browser and curl', ['app.lab.localhost', 'one valid chain'], 'ok'],
    ]),
    edges: acrossEdges(['exports', 'trusts']),
  },

  // bootstrapping: self-signed issuer, then the root, then the issuer that signs everything
  'ca-chain': {
    w: W,
    h: 170,
    nodes: across([
      ['self-signed issuer', ['signs one thing:', 'the root'], 'paper'],
      ['CA certificate', ['isCA: true', 'the root of trust'], 'accent'],
      ['CA issuer', ['signs everything', 'else in the cluster']],
    ]).map((n, i) => ({ ...n, n: i + 1 })),
    edges: acrossEdges(['signs', 'roots']),
  },

  // Gateway API: three objects where Ingress had one
  'gateway-anatomy': {
    w: W,
    h: 170,
    nodes: across([
      ['GatewayClass', ['which controller', 'handles the traffic']],
      ['Gateway', ['the front door: ports', 'and a cert per listener'], 'accent'],
      ['HTTPRoute', ['where requests go', 'once inside']],
    ]),
    edges: acrossEdges(['owns', 'routes']),
  },

  // kubectl apply: the ordered steps that follow
  'cert-flow': {
    w: W,
    h: stackH(4),
    nodes: stack([
      ['kubectl apply -f app.yaml', ['a Gateway with the cluster-issuer', 'annotation']],
      ['cert-manager notices', ['the listener names the secret', 'app-lab-tls']],
      ['Certificate created', ['for app.lab.localhost, signed', 'by the lab CA']],
      ['secret stored', ['app-lab-tls, served on the', 'Gateway listener'], 'accent'],
    ]),
    edges: stackEdges(4),
  },

  // HTTP-01: the four ordered steps of the challenge
  'http01-flow': {
    w: W,
    h: stackH(4),
    nodes: stack([
      ["Let's Encrypt asks for a file", ['GET /.well-known/acme-challenge/...', 'on the domain we want']],
      ['port 80 on the Gateway', ['a plain HTTP listener must', 'exist for the challenge']],
      ['cert-manager answers', ['a temporary HTTPRoute, attached', 'to our Gateway']],
      ['certificate issued', ['Let\u2019s Encrypt fetches the file', 'and signs the certificate'], 'accent'],
    ]),
    edges: stackEdges(4),
  },

  // DNS-01: only the DNS provider is reached, so the cluster can stay offline
  'dns01-flow': {
    w: W,
    h: 170,
    nodes: across([
      ['laptop cluster', ['cert-manager writes', 'a TXT record']],
      ['DNS provider', ['the one host both', 'sides reach'], 'accent'],
      ["Let's Encrypt", ['checks the record', 'over public DNS']],
    ]),
    edges: acrossEdges(['writes', 'answers']),
  },

  // AgentLens: the same run, read two ways
  'agentlens-checkpoints': {
    w: W,
    h: 300,
    nodes: [
      { id: 'claim', x: 12, y: 107, w: 184, h: 86, title: 'model says done', sub: ['at the done claim'], tone: 'paper' },
      { id: 'snap', x: 248, y: 27, w: 184, h: 86, title: 'snapshot at claim', sub: ['hidden check: FAIL', 'first attempt was wrong'], tone: 'alert' },
      { id: 'final', x: 248, y: 187, w: 184, h: 86, title: 'final state', sub: ['hidden check: PASS', 'final state correct'], tone: 'ok' },
      { id: 'first', x: 484, y: 27, w: 184, h: 86, title: 'first try', sub: ['did not pass'], tone: 'paper' },
      { id: 'transcript', x: 484, y: 187, w: 184, h: 86, title: 'transcript view', sub: ['scores it a success'], tone: 'paper' },
    ],
    edges: [
      ['claim', 'snap', 'h', ''],
      ['claim', 'final', 'h', ''],
      ['snap', 'first', 'h', ''],
      ['final', 'transcript', 'h', ''],
    ],
  },

  // the compose tiers: browser, reverse proxy, app tier, data tier
  'tiers-compose': {
    w: W,
    h: stackH(4),
    nodes: stack([
      ['browser', ['host port 8080']],
      ['nginx', ['reverse proxy']],
      ['Flask API', ['app tier, port 8000']],
      ['Postgres', ['data tier, port 5432'], 'accent'],
    ]),
    edges: stackEdges(4),
  },

  // the lab CA chain: the self-signed issuer issues the root, which signs the CA
  'cert-chain-lab': {
    w: W,
    h: stackH(4),
    nodes: stack([
      ['lab-selfsigned', ['a self-signed issuer']],
      ['lab-root-ca', ['a Certificate: the root'], 'accent'],
      ['lab-ca', ['a ClusterIssuer']],
      ['ingress leaf', ['the certificate the Ingress asks for']],
    ]),
    edges: stackEdges(4, ['issues', 'signs', 'signs']),
  },

  // the same tiers on the desktop host
  'tiers-container': {
    w: W,
    h: stackH(4),
    nodes: stack([
      ['host', ['port 8080']],
      ['nginx', ['1.27-alpine']],
      ['api', ['flask, python 3.13-alpine']],
      ['postgres', ['16-alpine'], 'accent'],
    ]),
    edges: stackEdges(4),
  },
}
