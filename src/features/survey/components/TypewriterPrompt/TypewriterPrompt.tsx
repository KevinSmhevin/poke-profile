import { useEffect, useState } from 'react'

type TypewriterPromptProps = {
  text: string
  speedMs?: number
}

export function TypewriterPrompt({ text, speedMs = 24 }: TypewriterPromptProps) {
  const [visibleCharacters, setVisibleCharacters] = useState(0)
  const safeSpeed = Math.max(10, speedMs)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= text.length) {
          window.clearInterval(timer)
          return current
        }

        return current + 1
      })
    }, safeSpeed)

    return () => window.clearInterval(timer)
  }, [safeSpeed, text])

  return (
    <p className="typewriter-line" aria-live="polite">
      {text.slice(0, visibleCharacters)}
      <span className="cursor" aria-hidden="true">
        _
      </span>
    </p>
  )
}
