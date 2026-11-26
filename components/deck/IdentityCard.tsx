import Link from 'next/link'

/**
 * Mobile identity header: the hero copy as the top block of the deck's
 * mission-brief card, SELA style: role chips, a plain sentence, and the nav
 * items as black/outline buttons next to sponsor. The live counts sit on the
 * projects page, not here. "home" stays off the card (the logo in the bar is home).
 */
export default function IdentityCard() {
  return (
    <div>
      <h2 className="text-[34px] leading-none font-bold tracking-[-0.035em]">00xcyd</h2>

      <div className="chips mt-4">
        <span>telecom engineer</span>
        <span>cybersecurity engineer</span>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-[var(--muted)]">
        building resilient systems across networks, security, and software. writing down what i
        learn along the way.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link href="/projects" className="btn-solid text-center">
          projects
        </Link>
        <Link href="/blog" className="btn-line text-center">
          blog
        </Link>
        <Link href="/freelance" className="btn-line text-center">
          services
        </Link>
        <a
          href="https://github.com/sponsors/00xcyd"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-line text-center"
        >
          ♥ sponsor
        </a>
      </div>
    </div>
  )
}
