import { getDeterministicPokemonResult } from '../../features/result/lib/deterministicScoring'
import { TypewriterPrompt } from '../../features/survey/components/TypewriterPrompt/TypewriterPrompt'
import { surveyQuestions } from '../../features/survey/data/questions'
import { ScreenContainer } from '../../shared/components/ScreenContainer/ScreenContainer'

const previewAnswers = { starter: 'observe' }
const previewResult = getDeterministicPokemonResult(previewAnswers)

export function HomePage() {
  return (
    <ScreenContainer
      title="Begin Your Pokemon Journey"
      subtitle="Mobile-first static app scaffold with deterministic survey results."
    >
      <div className="game-panel">
        <TypewriterPrompt
          key={surveyQuestions[0].id}
          text={surveyQuestions[0].prompt}
        />
        <p>
          Deterministic preview result: <strong>{previewResult}</strong>
        </p>
        <button type="button" className="pixel-button">
          Start Survey
        </button>
      </div>
    </ScreenContainer>
  )
}
