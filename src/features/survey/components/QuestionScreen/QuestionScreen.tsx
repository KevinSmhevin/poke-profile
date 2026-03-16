import type { PropsWithChildren } from 'react'
import { TypewriterPrompt } from '../TypewriterPrompt/TypewriterPrompt'

type QuestionScreenProps = PropsWithChildren<{
  prompt: string
  submitLabel?: string
  errorMessage?: string
  onSubmit: () => void
}>

export function QuestionScreen({
  prompt,
  submitLabel = 'Continue',
  errorMessage,
  onSubmit,
  children,
}: QuestionScreenProps) {
  return (
    <form
      className="game-panel"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <TypewriterPrompt text={prompt} />
      {children}
      {errorMessage ? <p className="input-error">{errorMessage}</p> : null}
      <button type="submit" className="pixel-button">
        {submitLabel}
      </button>
    </form>
  )
}
