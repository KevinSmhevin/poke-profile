import type { PropsWithChildren } from 'react'

import { getPublicAssetPath } from '../../../services/assets/publicAsset'

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
            <div className="screen-kicker-row">
              <img
                className="screen-kicker-icon"
                src={getPublicAssetPath('icons/app-icon-pokeball.svg')}
                alt=""
                decoding="async"
              />
              <p className="screen-kicker">Poke Profile</p>
            </div>
            <h1>{title}</h1>
            {subtitle ? <p className="screen-subtitle">{subtitle}</p> : null}
          </header>
        ) : null}
        {children}
      </section>
    </main>
  )
}
