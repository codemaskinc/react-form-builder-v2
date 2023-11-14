import { VoidFunction } from 'lib/types'

export type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T): boolean
}

export type GateFieldState<T> = {
    value: T | string,
    isPristine: boolean,
    errorMessage: string,
    localInitialValue: T,
    hasError: boolean
}

export type FieldConfig<T> = {
    label?: string,
    initialValue?: T,
    isRequired?: boolean,
    placeholder?: string,
    validateOnBlur?: boolean,
    validationRules?: Array<ValidationRule<T>>,
    children?: Array<ChildrenFieldConfig<T>>,
    liveParser?(value: T): T,
    submitParser?(value: T): T
}

export type ChildrenFieldConfig<T> = FieldConfig<T> & {
    key: string
}

type ValidateOnSubmitProps = {
    hasError: boolean,
    errorMessage: string
}

export type GateField<T> = {
    value: T | string,
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

export type ExtendedConfig<T> = GateField<T> & {
    key: string,
    localInitialValue: T,
    isPristine: boolean,
    validationRules: Array<ValidationRule<T>>,
    validateOnBlur: boolean
}

export type InnerForm<T> = Record<string, ExtendedConfig<T>>
