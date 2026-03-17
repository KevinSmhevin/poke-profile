import type { PropsWithChildren } from 'react'

type ScreenContainerProps = PropsWithChildren<{
  title: string
  subtitle?: string
  showHeader?: boolean
}>

export function ScreenContainer({
  title,
  subtitle,
  showHeader = true,
  children,
}: ScreenContainerProps) {
  return (
    <main className="screen-shell">
      <section className="screen-frame">
        {showHeader ? (
          <header className="screen-header">
            <p className="screen-kicker">Poke Profile</p>
            <h1>{title}</h1>
            {subtitle ? <p className="screen-subtitle">{subtitle}</p> : null}
          </header>
        ) : null}
        {children}
      </section>
    </main>
  )
}
