declare module 'react-mobile-datepicker' {
  import type { ComponentType } from 'react'

  type DateUnitConfig = {
    format: string | ((date: Date) => string)
    caption?: string
    step?: number
  }

  type DatePickerProps = {
    isOpen: boolean
    value: Date
    min?: Date
    max?: Date
    theme?: 'default' | 'dark' | 'ios' | 'android' | 'android-dark'
    headerFormat?: string
    dateConfig?: Partial<Record<'year' | 'month' | 'date' | 'hour' | 'minute' | 'second', DateUnitConfig>>
    onSelect: (value: Date) => void
    onCancel: () => void
    confirmText?: string
    cancelText?: string
  }

  const DatePicker: ComponentType<DatePickerProps>
  export default DatePicker
}
