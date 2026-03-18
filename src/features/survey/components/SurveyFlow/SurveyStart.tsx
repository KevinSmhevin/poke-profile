import { TypewriterPrompt } from '../TypewriterPrompt/TypewriterPrompt'

type SurveyStartProps = {
  onStartJourney: () => void
}

export function SurveyStart({ onStartJourney }: SurveyStartProps) {
  return (
    <div className="game-panel">
      <TypewriterPrompt text="Click `Begin journey` to get your pokemon profile" />
      <button type="button" className="pixel-button" onClick={onStartJourney}>
        Begin Journey
      </button>
    </div>
  )
}
