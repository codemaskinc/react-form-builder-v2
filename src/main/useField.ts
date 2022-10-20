import { useRef, useState } from 'react'
import { isEmpty } from 'ramda'
import { R } from 'lib/utils'
import { GateField, FieldConfig, GateFieldState } from './types'

type ComputerErrorMessage<T> = {
    value?: T,
    forceCheck?: boolean
}

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
    const stateRef = useRef<Record<keyof T, GateField<any>>>({} as Record<keyof T, GateField<any>>)
    const [localInitialValue, setLocalInitialValue] = useState(initialValue)
    const [field, setField] = useState<GateFieldState<T>>({
        value: localInitialValue,
        isPristine: true,
        errorMessage: ''
    })

    const computeErrorMessage = ({ value, forceCheck = false }: ComputerErrorMessage<T>) => {
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
            .find(rule => !rule.validate(val, stateRef.current))

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
        hasChange: field.value !== localInitialValue,
        errorMessage: field.errorMessage,
        onBlur: () => validateOnBlur && setField(prevState => ({
            ...prevState,
            isPristine: false,
            errorMessage: computeErrorMessage({
                value: undefined,
                forceCheck: true
            })
        })),
        onChangeValue: (newValue: T) => setField(prevState => ({
            ...prevState,
            value: liveParser
                ? liveParser(newValue)
                : newValue,
            isPristine: prevState.isPristine
                ? validateOnBlur
                : prevState.isPristine,
            errorMessage: computeErrorMessage({
                value: newValue
            })
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
            const errorMessage = computeErrorMessage({
                value: undefined,
                forceCheck: true
            })

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
            errorMessage: computeErrorMessage({
                value: undefined,
                forceCheck: true
            })
        })),
        setRef: (state: Record<keyof T, GateField<any>>) => stateRef.current = state
    }
}
