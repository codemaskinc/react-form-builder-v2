type VoidFunction = () => void

type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T): boolean
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
    children?: Array<Field<T>>,
    hasError: boolean,
    validateOnSubmit(): string,
    onChangeValue(newValue: T): void,
    submitParser?(value: T): T,
    setError(errorMessage: string): void
}

export type FieldConfig<T> = {
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

type FieldValue<T, K extends keyof T> = T[K] extends Field<infer F> ? F : never

type UseFormReturn<T> = {
    form: T,
    hasError: boolean,
    isFilled: boolean,
    resetForm: VoidFunction,
    submit: VoidFunction,
    validateAll(): boolean,
    formHasChanges(): boolean,
    setError(field: string, errorMessage: string): void,
    setFieldValue<K extends keyof T | string>(field: K, value: K extends keyof T ? FieldValue<T, K> : any): void,
    setFieldInitialValue<K extends keyof T | string>(field: K, value: K extends keyof T ? FieldValue<T, K> : any): void,
    addFields(fields: Array<FieldConfig<any>>): void,
    removeFieldIds(fields: Array<string>)
}

type FormGateCallbacks<T> = {
    onSuccess(form: {[K in keyof T]: FieldValue<T, K>}): void,
    onError?(form: Record<keyof T, string>): void
}

declare function useForm<T extends Record<PropertyKey, Field<any>>>(
    formFields: T,
    callbacks: FormGateCallbacks<T>
): UseFormReturn<T>

declare function useField<T>(props: FieldConfig<T>): Field<T>

export {
    useForm,
    useField,
    Field,
    UseFormReturn
}
