import { isEmpty } from 'ramda'
import { ExtendedConfig, FieldConfig, GateFieldState } from './types'

type GenerateFieldProps<T> = {
    fieldConfig: FieldConfig<T>,
    field: GateFieldState<T> | undefined,
    setField: React.Dispatch<React.SetStateAction<GateFieldState<T>>>,
    parentKey?: string
}

export const generateField = <T>({
    fieldConfig,
    field,
    setField,
    parentKey = ''
}: GenerateFieldProps<T>) => {
    const computeErrorMessage = (value?: T | string, forceCheck = false) => {
        if ((!forceCheck && field?.isPristine && !fieldConfig.isRequired) || !fieldConfig.validationRules) {
            return {
                errorMessage: '',
                hasError: false
            }
        }

        if (fieldConfig.isRequired && isEmpty(value)) {
            return {
                errorMessage: fieldConfig.validationRules[0]?.errorMessage ?? '',
                hasError: true
            }
        }

        if (!fieldConfig.isRequired && !Boolean(value) && !fieldConfig.validationRules) {
            return {
                errorMessage: '',
                hasError: false
            }
        }

        const firstError = fieldConfig.validationRules.find(rule => !rule.validate(value as T))

        return {
            errorMessage: firstError?.errorMessage ?? '',
            hasError: Boolean(firstError?.errorMessage)
        }
    }

    return {
        ...fieldConfig,
        validationRules: fieldConfig.validationRules ?? [],
        value: field?.value ?? fieldConfig.initialValue,
        hasChange: field?.value !== field?.localInitialValue,
        isPristine: field?.isPristine ?? true,
        parentKey,
        hasError: field?.hasError ?? false,
        isRequired: fieldConfig.isRequired ?? false,
        validateOnBlur: fieldConfig.validateOnBlur ?? false,
        localInitialValue: fieldConfig.initialValue ?? '',
        errorMessage: field?.errorMessage ?? '',
        onChangeValue: (value: T) => setField(prevState => {
            const newValue = fieldConfig.liveParser
                ? fieldConfig.liveParser(value)
                : value

            return {
                ...prevState,
                value: newValue,
                hasChange: value !== prevState?.localInitialValue,
                isPristine: prevState?.isPristine
                    ? fieldConfig.validateOnBlur ?? false
                    : prevState?.isPristine,
                // we do not validate when there is no error and validateOnBlur is false
                ...fieldConfig.validateOnBlur && !prevState.hasError ? {} : computeErrorMessage(newValue, true)
            }
        }),
        onBlur: () => {
            if (!fieldConfig.validateOnBlur) {
                return
            }

            const { hasError, errorMessage } = computeErrorMessage(field?.value, true)
            const isFieldEmpty = !fieldConfig.isRequired && isEmpty(field?.value)

            setField(prevState => ({
                ...prevState,
                isPristine: isFieldEmpty,
                errorMessage: isFieldEmpty ? '' : errorMessage,
                hasError: isFieldEmpty ? false : hasError
            }))
        },
        validateOnSubmit: () => {
            const { hasError, errorMessage } = computeErrorMessage(field?.value)

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
        onChangeInitialValue: (value: T) => {
            if (field?.localInitialValue === value) {
                return
            }

            setField(prevState => ({
                ...prevState,
                localInitialValue: value
            }))
        },
        setError: (errorMessage: string) => setField(prevState => ({
            ...prevState,
            errorMessage,
            hasError: Boolean(errorMessage)
        })),
        resetState: () => setField(prevState => ({
            ...prevState,
            isPristine: true,
            hasError: false,
            errorMessage: '',
            value: prevState.localInitialValue
        })),
        validate: () => {
            const { hasError, errorMessage } = computeErrorMessage(field?.value, true)

            setField(prevState => ({
                ...prevState,
                errorMessage,
                hasError
            }))

            return hasError
        }
    } as unknown as ExtendedConfig<T>
}
