import { R } from 'lib/utils'
import { GateField } from './types'
import { useFormValidator } from './useValidator'

type FormGateCallbacks<T> = {
    onSuccess(form: T): void,
    onError?(form: T): void
}

export function useForm<T>(
    formFields: Record<keyof T, GateField<any>>,
    callbacks: FormGateCallbacks<T>
) {
    const form = Object
        .entries(formFields)
        .reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value
        }), {}) as Record<keyof T, GateField<any>>

    const { hasError } = useFormValidator(Object.values(formFields))

    return {
        form,
        hasError,
        formHasChanges: () => Object
            .values<GateField<any>>(form)
            .some(field => field.hasChange),
        setError: (field: keyof T, errorMessage: string) => {
            form[field].setError(errorMessage)

            R.ifDefined(callbacks.onError, onError => onError({
                [field]: errorMessage
            }))
        },
        setField: (field: keyof T, value: any) => {
            form[field].onChangeValue(value)
        },
        resetForm: () => Object
            .keys(form)
            .forEach(key => (form[key] as GateField<any>).resetState()),
        submit: () => {
            const errors = Object
                .values<GateField<any>>(form)
                .map(field => ({
                    key: field.key,
                    errorMessage: field.validateOnSubmit()
                }))
                .filter(field => Boolean(field.errorMessage))
                .reduce((acc, { key, errorMessage}) => ({
                    ...acc,
                    [key]: errorMessage
                }), {})
            const hasErrors = Object.values(errors).length > 0

            if (hasErrors) {
                return R.ifDefined(callbacks.onError, onError => onError(errors))
            }

            const parsedForm = Object
                .values<GateField<any>>(form)
                .reduce((acc, { key, value, submitParser }) => ({
                    ...acc,
                    [key]: submitParser
                        ? submitParser(value)
                        : value,
                }), {}) as T

            callbacks.onSuccess(parsedForm)
        }
    }
}
