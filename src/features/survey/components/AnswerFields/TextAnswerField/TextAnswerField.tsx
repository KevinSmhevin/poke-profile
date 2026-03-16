type TextAnswerFieldProps = {
  id: string
  label: string
  value: string
  maxLength: number
  placeholder?: string
  autoComplete?: string
  onValueChange: (value: string) => void
}

export function TextAnswerField({
  id,
  label,
  value,
  maxLength,
  placeholder,
  autoComplete,
  onValueChange,
}: TextAnswerFieldProps) {
  return (
    <>
      <label className="pixel-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="pixel-input"
        type="text"
        inputMode="text"
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.currentTarget.value)}
      />
    </>
  )
}
