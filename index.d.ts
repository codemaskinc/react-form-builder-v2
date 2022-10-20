import { GateField } from './src/main/types'

type VoidFunction = () => void

type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T, state: Record<keyof T, GateField<any>>): boolean
}

type Field<T> = {
    value: T,
    key: string,
    label?: string,
    isRequired: boolean,
    hasChange: boolean,
    placeholder?: string,
    errorMessage: string,
    onBlur: VoidFunction,
    resetState: VoidFunction,
    validate: VoidFunction,
    validateOnSubmit(): string,
    onChangeValue(newValue: T): void,
    submitParser?(value: T): T,
    setError(errorMessage: string): void
}

type FieldConfig<T> = {
    key: string,
    label?: string,
    initialValue: T,
    isRequired: boolean,
    placeholder?: string,
    validateOnBlur?: boolean,
    validationRules?: Array<ValidationRule<T>>,
    liveParser?(value: T): T,
    submitParser?(value: T): T
}

type UseFormReturn<T> = {
    form: Record<keyof T, Field<any>>,
    hasError: boolean,
    resetForm: VoidFunction,
    submit: VoidFunction,
    validateAll: VoidFunction,
    formHasChanges(): boolean,
    setError(field: keyof  T, errorMessage: string): void,
    setFieldValue(field: keyof T, value: any): void,
    setFieldInitialValue(field: keyof T, value: any): void
}

type FormGateCallbacks<T> = {
    onSuccess(form: T): void,
    onError?(form: T): void
}

declare function useForm<T>(
    formFields: Record<keyof T, Field<any>>,
    callbacks: FormGateCallbacks<T>
): UseFormReturn<T>

declare function useField<T>(props: FieldConfig<T>): Field<T>

export {
    useForm,
    useField,
    Field
}
