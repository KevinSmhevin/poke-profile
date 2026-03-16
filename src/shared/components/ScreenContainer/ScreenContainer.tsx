import type { PropsWithChildren } from 'react'

type ScreenContainerProps = PropsWithChildren<{
  title: string
  subtitle?: string
}>

export function ScreenContainer({
  title,
  subtitle,
  children,
}: ScreenContainerProps) {
  return (
    <main className="screen-shell">
      <section className="screen-frame">
        <header className="screen-header">
          <p className="screen-kicker">Poke Profile</p>
          <h1>{title}</h1>
          {subtitle ? <p className="screen-subtitle">{subtitle}</p> : null}
        </header>
        {children}
      </section>
    </main>
  )
}
