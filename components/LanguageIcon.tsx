import type { CSSProperties } from 'react'
import { SiC, SiCplusplus, SiGnubash, SiGo, SiHtml5, SiJavascript, SiPython, SiRuby, SiRust, SiTypescript } from 'react-icons/si'
import { languageColor } from '@/lib/github'

/** Real brand marks for the languages the account uses; a dot for any other. */
const ICONS: Record<string, typeof SiC> = {
  C: SiC,
  'C++': SiCplusplus,
  Go: SiGo,
  HTML: SiHtml5,
  JavaScript: SiJavascript,
  Python: SiPython,
  Ruby: SiRuby,
  Rust: SiRust,
  Shell: SiGnubash,
  TypeScript: SiTypescript,
}

export default function LanguageIcon({ language, size = 12 }: { language: string; size?: number }) {
  const color = languageColor(language)
  const Icon = ICONS[language]
  if (!Icon) {
    return (
      <span
        className="inline-block rounded-full"
        style={{ width: size * 0.7, height: size * 0.7, background: color }}
        aria-hidden
      />
    )
  }
  return <Icon size={size} aria-hidden style={{ color, flexShrink: 0 } as CSSProperties} />
}
