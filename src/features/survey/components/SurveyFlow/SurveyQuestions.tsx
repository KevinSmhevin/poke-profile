import { DateQuestionStep } from '../DateQuestionStep/DateQuestionStep'
import { PseudoLegendaryQuestionStep } from '../PseudoLegendaryQuestionStep/PseudoLegendaryQuestionStep'
import { PokemonTypeQuestionStep } from '../PokemonTypeQuestionStep/PokemonTypeQuestionStep'
import { RegionQuestionStep } from '../RegionQuestionStep/RegionQuestionStep'
import { StarterQuestionStep } from '../StarterQuestionStep/StarterQuestionStep'
import { TextQuestionStep } from '../TextQuestionStep/TextQuestionStep'
import { TraitsQuestionStep } from '../TraitsQuestionStep/TraitsQuestionStep'
import { WildEncounterQuestionStep } from '../WildEncounterQuestionStep/WildEncounterQuestionStep'
import type { SurveyAnswers, SurveyQuestion } from '../../types'

type SurveyQuestionsProps = {
  question: SurveyQuestion | null
  value: string
  answers: SurveyAnswers
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function SurveyQuestions({
  question,
  value,
  answers,
  onValueChange,
  onSubmit,
}: SurveyQuestionsProps) {
  if (!question) {
    return null
  }

  if (question.type === 'text') {
    return (
      <TextQuestionStep
        question={question}
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
      />
    )
  }

  if (question.type === 'date') {
    return (
      <DateQuestionStep
        question={question}
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
      />
    )
  }

  if (question.type === 'region') {
    return (
      <RegionQuestionStep
        question={question}
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
      />
    )
  }

  if (question.type === 'starter') {
    return (
      <StarterQuestionStep
        question={question}
        selectedRegionId={answers.trainerRegion ?? ''}
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
      />
    )
  }

  if (question.type === 'traits') {
    return (
      <TraitsQuestionStep
        question={question}
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
      />
    )
  }

  if (question.type === 'pseudoLegendary') {
    return (
      <PseudoLegendaryQuestionStep
        question={question}
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
      />
    )
  }

  if (question.type === 'wildEncounter') {
    return (
      <WildEncounterQuestionStep
        question={question}
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
      />
    )
  }

  return (
    <PokemonTypeQuestionStep
      question={question}
      value={value}
      onValueChange={onValueChange}
      onSubmit={onSubmit}
    />
  )
}
