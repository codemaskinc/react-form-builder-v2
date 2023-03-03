import { VoidFunction } from 'lib/types'

export type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T): boolean
}

export type GateFieldState<T> = {
    value: T | string,
    isPristine: boolean,
    errorMessage: string,
    hasError: boolean
}

export type FieldConfig<T> = {
    key: string,
    label?: string,
    initialValue?: T,
    isRequired?: boolean,
    placeholder?: string,
    validateOnBlur?: boolean,
    validationRules?: Array<ValidationRule<T>>,
    children?: Array<FieldConfig<T>>,
    liveParser?(value: T): T,
    submitParser?(value: T): T
}

export type FormFieldLike = {
    value: any,
    isRequired: boolean,
    errorMessage: string
}

type ValidateOnSubmitProps = {
    hasError: boolean,
    errorMessage: string
}

export type GateField<T> = {
    value: T | string,
    key: string,
    label?: string,
    isRequired: boolean,
    hasChange: boolean,
    placeholder?: string,
    errorMessage: string,
    onBlur: VoidFunction,
    parentKey: string,
    hasError: boolean,
    validate(): boolean,
    validateOnSubmit(): ValidateOnSubmitProps,
    onChangeValue(newValue: T): void,
    submitParser?(value: T): T,
    onChangeInitialValue(value: T): void,
    resetState(): void,
    setError(errorMessage: string): void
}

export type SinglePickerOption = {
    key: string,
    value: any
}

export type ExtendedConfig<T> = GateField<T> & {
    localInitialValue: T,
    isPristine: boolean,
    validationRules: Array<ValidationRule<T>>,
    validateOnBlur: boolean
}

export type InnerForm<T> = Record<string, ExtendedConfig<T>>
