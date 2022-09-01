import { VoidFunction } from 'lib/types'

export type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T): boolean
}

export type GateFieldState<T> = {
    value: T,
    isPristine: boolean,
    errorMessage: string
}

export type FieldConfig<T> = {
    key: string,
    label?: string,
    initialValue: T,
    isRequired: boolean,
    placeholder?: string,
    validateOnBlur?: boolean,
    validationRules?: Array<ValidationRule<T>>,
    dependencies?: Array<any>,
    liveParser?(value: T): T,
    submitParser?(value: T): T
}

export type FormFieldLike = {
    value: any,
    isRequired: boolean,
    errorMessage: string
}

export type GateField<T> = {
    value: T,
    key: string,
    label?: string,
    isRequired: boolean,
    hasChange: boolean,
    placeholder?: string,
    errorMessage: string,
    onBlur: VoidFunction,
    validateOnSubmit(): string,
    onChangeValue(newValue: T): void,
    submitParser?(value: T): T,
    resetState(): void,
    setError(errorMessage: string): void
}

export type SinglePickerOption = {
    key: string,
    value: any
}
