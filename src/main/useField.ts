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
    const [localInitialValue, setLocalInitialValue] = useState(initialValue)
    const [field, setField] = useState<GateFieldState<T>>({
        value: localInitialValue,
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

        if (!isRequired && !Boolean(val)) {
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
        parentKey: '',
        value: field.value,
        hasChange: field.value !== localInitialValue,
        errorMessage: field.errorMessage,
        onBlur: () => validateOnBlur && setField(prevState => ({
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
        onChangeInitialValue: (value: T) => {
            if (field.value === localInitialValue) {
                setField(prevState => ({
                    ...prevState,
                    value
                }))
            }

            setLocalInitialValue(value)
        },
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
        resetState: () => setField(prevState => ({
            ...prevState,
            isPristine: true,
            errorMessage: '',
            value: initialValue
        })),
        validate: () => setField(prevState => ({
            ...prevState,
            errorMessage: computeErrorMessage(undefined, true)
        }))
    }
}
