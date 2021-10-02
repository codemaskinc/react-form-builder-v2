import { useState } from 'react'
import { isEmpty } from 'ramda'
import { R } from 'lib/utils'
import { GateField, FieldConfig, GateFieldState } from './types'

export function useField<T>({
    key,
    label,
    initialValue,
    validationRules,
    isRequired,
    placeholder,
    validateOnBlur = false,
    liveParser,
    submitParser
}: FieldConfig<T>): GateField<T> {
    const [field, setField] = useState<GateFieldState<T>>({
        value: initialValue,
        isPristine: true,
        errorMessage: ''
    })

    const computeErrorMessage = (value?: T, forceCheck: boolean = false) => {
        if ((!forceCheck && field.isPristine) || !validationRules) {
            return ''
        }

        const val = (R.isDefined(value)
            ? value
            : field.value) as T

        if (isRequired && isEmpty(val)) {
            return validationRules[0].errorMessage
        }

        if (!isRequired && isEmpty(val)) {
            return ''
        }

        const firstError = validationRules
            .find(rule => !rule.validate(val))

        return firstError
            ? firstError.errorMessage
            : ''
    }

    return {
        key,
        label,
        isRequired,
        placeholder,
        submitParser,
        value: field.value,
        hasChange: field.value !== initialValue,
        errorMessage: field.errorMessage,
        onBlur: () => setField(prevState => ({
            ...prevState,
            isPristine: false,
            errorMessage: computeErrorMessage(undefined, true)
        })),
        onChangeValue: (newValue: T) => setField(prevState => ({
            ...prevState,
            value: liveParser
                ? liveParser(newValue)
                : newValue,
            isPristine: prevState.isPristine
                ? validateOnBlur
                : prevState.isPristine,
            errorMessage: computeErrorMessage(newValue)
        })),
        validateOnSubmit: () => {
            const errorMessage = computeErrorMessage(undefined, true)

            if (errorMessage) {
                setField(prevState => ({
                    ...prevState,
                    errorMessage
                }))

                return errorMessage
            }

            return ''
        },
        setError: (errorMessage: string) => setField(prevState => ({
            ...prevState,
            errorMessage
        })),
        setField: (value: T) => setField(prevState => ({
            ...prevState,
            value
        }))
    }
}
