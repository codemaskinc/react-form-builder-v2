import { useState } from 'react'
import { isEmpty } from 'ramda'
import { R } from 'lib/utils'
import { GateField, FieldConfig, GateFieldState } from './types'

export function useField<T>({
    key,
    label,
    initialValue,
    validationRules = [],
    isRequired = false,
    placeholder,
    validateOnBlur = false,
    liveParser,
    submitParser
}: FieldConfig<T>): GateField<T> {
    const [localInitialValue, setLocalInitialValue] = useState(initialValue)
    const [field, setField] = useState<GateFieldState<T>>({
        value: localInitialValue as T,
        isPristine: true,
        errorMessage: '',
        hasError: false
    })

    const computeErrorMessage = (value?: T, forceCheck: boolean = false) => {
        if ((!forceCheck && field.isPristine) || !validationRules) {
            return {
                errorMessage: '',
                hasError: false
            }
        }

        const val = (R.isDefined(value)
            ? value
            : field.value) as T

        if (isRequired && isEmpty(val)) {
            return {
                errorMessage: validationRules[0]?.errorMessage,
                hasError: true
            }
        }

        if (!isRequired && !Boolean(val) && !validationRules) {
            return {
                errorMessage: '',
                hasError: false
            }
        }

        const firstError = validationRules
            .find(rule => !rule.validate(val))

        return {
            errorMessage: firstError
                ? firstError.errorMessage
                : '',
            hasError: Boolean(firstError?.errorMessage)
        }
    }

    return {
        key,
        label,
        isRequired,
        placeholder,
        submitParser,
        parentKey: '',
        hasError: field.hasError,
        value: field.value,
        hasChange: field.value !== localInitialValue,
        errorMessage: field.errorMessage,
        onBlur: () => {
            if (validateOnBlur) {
                const { errorMessage, hasError } = computeErrorMessage(undefined, true)

                setField(prevState => ({
                    ...prevState,
                    isPristine: false,
                    errorMessage,
                    hasError
                }))
            }
        },
        onChangeValue: (newValue: T) => {
            const { hasError, errorMessage } = computeErrorMessage(newValue, !validateOnBlur)

            setField(prevState => ({
                ...prevState,
                value: liveParser
                    ? liveParser(newValue)
                    : newValue,
                isPristine: prevState.isPristine
                    ? validateOnBlur
                    : prevState.isPristine,
                errorMessage,
                hasError
            }))
        },
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
            const { hasError, errorMessage } = computeErrorMessage(undefined, true)

            setField(prevState => ({
                ...prevState,
                errorMessage,
                hasError
            }))

            return {
                hasError,
                errorMessage
            }
        },
        setError: (errorMessage: string) => setField(prevState => ({
            ...prevState,
            errorMessage
        })),
        resetState: () => setField(prevState => ({
            ...prevState,
            isPristine: true,
            errorMessage: '',
            value: localInitialValue as T
        })),
        validate: () => {
            const { hasError, errorMessage } = computeErrorMessage(undefined, true)

            setField(prevState => ({
                ...prevState,
                errorMessage,
                hasError
            }))

            return hasError
        }
    }
}
