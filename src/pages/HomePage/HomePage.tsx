import { useState } from 'react'
import { SurveyFlow } from '../../features/survey/components/SurveyFlow/SurveyFlow'
import { ScreenContainer } from '../../shared/components/ScreenContainer/ScreenContainer'

export function HomePage() {
  const [hasStartedJourney, setHasStartedJourney] = useState(false)

  return (
    <ScreenContainer
      title="Begin Your Pokemon Profile Journey"
      subtitle="A retro-style pokemon quiz to get your pokemon profile."
      showHeader={!hasStartedJourney}
    >
      <SurveyFlow onHasStartedJourneyChange={setHasStartedJourney} />
    </ScreenContainer>
  )
}
