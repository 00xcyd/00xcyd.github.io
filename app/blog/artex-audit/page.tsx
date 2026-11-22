import Link from 'next/link'
import type { Metadata } from 'next'
import PageCol from '@/components/PageCol'

export const metadata: Metadata = {
  title: 'the artex audit — cyber.dach',
  description:
    'one index for the four rows of the ARTEX agent audit: memory poisoning, plan hijacking, goal drift and tool abuse, plus the wrap-up.',
}

const ROWS = [
  {
    row: 'row one',
    title: 'tying a fact to the work that produced it: server-side provenance for row one',
    href: '/blog/tying-a-fact-to-the-work-that-produced-it/',
    date: '2026-11-21',
    verdict: 'patched and merged',
    line:
      'a fact has to quote a line of the intent\'s recorded activity before it counts as evidence, and captured target bytes are labelled target_response whatever the model declared. Merged as 2411943; the capture-off limits are written into the post.',
  },
  {
    row: 'row two',
    title: 'plan hijacking row: the planner already reads the target as data',
    href: '/blog/plan-hijacking-row-the-planner-reads-data/',
    date: '2026-11-21',
    verdict: 'holds',
    line:
      'a code-owned data rule plus a per-message nonce envelope frame every target-derived field, and a deterministic bench proves the frame survives a hostile page. The limit is that framing is an instruction, not a sandbox.',
  },
  {
    row: 'rows three and four',
    title: 'rows three and four: the goal anchor and the typed bbot parser',
    href: '/blog/rows-three-and-four-goal-anchor-and-bbot-parser/',
    date: '2026-11-22',
    verdict: 'hold',
    line:
      'the planner message ends with a code-owned goal anchor, and bbot output is parsed typed-only with inert free text. Command templates shell-quote their parameters before the target gate sees the call.',
  },
  {
    row: 'wrap-up',
    title: 'what four rows of an agent audit actually proved',
    href: '/blog/what-four-rows-of-an-agent-audit-actually-proved/',
    date: '2026-11-22',
    verdict: 'the pattern',
    line:
      'one patch, three negative results, and the column that matters: which protections are structural, which depend on ordering, and which configuration switch turns each one off.',
  },
]

export default function ArtexAuditIndex() {
  return (
    <PageCol>
      <Link href="/blog" className="text-xs text-[var(--muted)] underline-link">
        ← all posts
      </Link>

      <header className="mt-5 mb-8 stagger-1">
        <h1 className="text-2xl font-medium leading-snug mb-2">the artex audit</h1>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          four rows of one agent audit, read at main <code>22ae88a</code>: one
          merged patch and three negative results. This page is the index; each
          entry links to the writeup with its own evidence and limits.
        </p>
      </header>

      <div className="divide-y divide-[var(--border)] stagger-2">
        {ROWS.map(entry => (
          <article key={entry.href} className="py-5 first:pt-0">
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
                {entry.row}
              </span>
              <span className="text-[10px] text-[var(--muted)] whitespace-nowrap">
                {entry.date} · {entry.verdict}
              </span>
            </div>
            <h2 className="text-[15px] font-medium leading-snug mb-1.5">
              <Link href={entry.href} className="underline-link">
                {entry.title}
              </Link>
            </h2>
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">{entry.line}</p>
          </article>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] mt-8 leading-relaxed">
        the audit thread is{' '}
        <a
          href="https://github.com/BaaRai/ARTEX/issues/124"
          className="underline-link font-medium text-[var(--fg)]"
        >
          ARTEX issue #124
        </a>
        ; the provenance patch is{' '}
        <a
          href="https://github.com/BaaRai/ARTEX/pull/441"
          className="underline-link font-medium text-[var(--fg)]"
        >
          pull request #441
        </a>{' '}
        and the doc-comment follow-up is{' '}
        <a
          href="https://github.com/BaaRai/ARTEX/pull/469"
          className="underline-link font-medium text-[var(--fg)]"
        >
          #469
        </a>
        .
      </p>
    </PageCol>
  )
}
