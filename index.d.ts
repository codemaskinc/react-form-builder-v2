type VoidFunction = () => void

type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T): boolean
}

type Field<T, TRequired extends boolean = boolean> = {
    value: T,
    label?: string,
    isRequired: TRequired,
    hasChange: boolean,
    placeholder?: string,
    errorMessage: string,
    onBlur: VoidFunction,
    resetState: VoidFunction,
    validate: VoidFunction,
    children?: Array<ChildrenField<T>>,
    hasError: boolean,
    validateOnSubmit(): string,
    onChangeValue(newValue: T): void,
    submitParser?(value: T): T,
    setError(errorMessage: string): void
}

type ChildrenField<T, TRequired extends boolean = boolean> = Field<T, TRequired> & {
    key: string
}

export type FieldConfig<T, Required extends boolean = boolean> = {
    label?: string,
    initialValue: T,
    isRequired: Required,
    placeholder?: string,
    validateOnBlur?: boolean,
    validationRules?: Array<ValidationRule<T>>,
    liveParser?(value: T): T,
    submitParser?(value: T): T
}

export type ChildrenFieldConfig<T, Required extends boolean = boolean> = FieldConfig<T, Required> & {
    key: string
}

// ...args: Array<any> - otherwise typescript throws an error when we pass parameters into config function
export type InferForm<T extends (...args: Array<any>) => Record<string, Field<any> | undefined>> = {
    [K in keyof ReturnType<T>]: RequiredFieldValue<ReturnType<T>, K>
}

type FieldValue<T, K extends keyof T> = T[K] extends Field<infer F> ? F : never

type RequiredFieldValue<T, K extends keyof T> = T[K] extends Field<infer F>
    ? T[K] extends Field<F, true>
        ? NonNullable<F>
        : F
    : never

type UseFormReturn<T extends Record<PropertyKey, Field<any> | undefined>> = {
    // If we are using dynamic form we need that Partial to be able to access any key of the form
    form: T & Partial<Record<string, Field<any>>>,
    hasError: boolean,
    isFilled: boolean,
    resetForm: VoidFunction,
    submit: VoidFunction,
    validateAll(): boolean,
    formHasChanges(): boolean,
    setError(field: string, errorMessage: string): void,
    setFieldValue<K extends keyof T | (string & {})>(field: K, value: K extends keyof T ? FieldValue<T, K> : any): void,
    setFieldInitialValue<K extends keyof T | (string & {})>(field: K, value: K extends keyof T ? FieldValue<T, K> : any): void,
    addFields(fields: Array<ChildrenFieldConfig<any>>): void,
    removeFieldIds(fields: Array<string>): void
}

type FormGateCallbacks<T> = {
    onSuccess(form: {[K in keyof T]: RequiredFieldValue<T, K>}): void,
    onError?(form: Record<keyof T, string>): void
}

declare function useForm<T extends Record<PropertyKey, Field<any> | undefined>>(
    formFields: T,
    callbacks: FormGateCallbacks<T>
): UseFormReturn<T>

declare function useField<T, Required extends boolean = boolean>(props: FieldConfig<T, Required>): Field<T, Required>

export {
    useForm,
    useField,
    Field,
    UseFormReturn
}
