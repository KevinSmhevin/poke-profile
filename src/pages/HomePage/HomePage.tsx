import { SurveyFlow } from '../../features/survey/components/SurveyFlow/SurveyFlow'
import { ScreenContainer } from '../../shared/components/ScreenContainer/ScreenContainer'

export function HomePage() {
  return (
    <ScreenContainer
      title="Begin Your Pokemon Journey"
      subtitle="A retro-style trainer quiz with deterministic results."
    >
      <SurveyFlow />
    </ScreenContainer>
  )
}
