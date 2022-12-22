import React from 'react'
import { isEmpty } from 'ramda'
import { R } from '../lib/utils'
import { ExtendedConfig, FieldConfig, InnerForm } from './types'

export const generateField = <T>(
    fieldConfig: FieldConfig<T>,
    prevState: InnerForm<T>,
    setState: React.Dispatch<React.SetStateAction<InnerForm<T>>>,
    parentKey: string = ''
): ExtendedConfig<T> => {
    const computeErrorMessage = (field: ExtendedConfig<T>, value?: T, forceCheck: boolean = false) => {
        if ((!forceCheck && field.isPristine) || !field.validationRules) {
            return {
                errorMessage: '',
                hasError: false
            }
        }

        const val = (R.isDefined(value)
            ? value
            : field.value) as T

        if (field.isRequired && isEmpty(val)) {
            return {
                errorMessage: field.validationRules[0]?.errorMessage,
                hasError: true
            }
        }

        if (!field.isRequired && !Boolean(val)) {
            return {
                errorMessage: '',
                hasError: false
            }
        }

        const firstError = field.validationRules
            .find(rule => !rule.validate(val))

        return {
            errorMessage: firstError
                ? firstError.errorMessage
                : '',
            hasError: Boolean(firstError?.errorMessage)
        }
    }

    return {
        ...fieldConfig,
        value: '',
        hasChange: false,
        isPristine: true,
        parentKey,
        hasError: prevState[fieldConfig.key].hasError,
        isRequired: fieldConfig.isRequired || false,
        validateOnBlur: fieldConfig.validateOnBlur || false,
        localInitialValue: (fieldConfig.initialValue || '') as T,
        errorMessage: prevState[fieldConfig.key]?.errorMessage,
        onChangeValue: (value: T) => setState(prevState => {
            const changedField = {
                ...prevState[fieldConfig.key],
                value: fieldConfig.liveParser
                    ? fieldConfig.liveParser(value)
                    : value,
                hasChange: value !== prevState[fieldConfig.key]?.localInitialValue,
                isPristine: prevState[fieldConfig.key].isPristine
                    ? fieldConfig.validateOnBlur || false
                    : prevState[fieldConfig.key].isPristine
            }

            const { errorMessage, hasError } = computeErrorMessage(changedField, value)

            return {
                ...prevState,
                [fieldConfig.key]: {
                    ...changedField,
                    errorMessage,
                    hasError
                }
            }
        }),
        onBlur: () => {
            if (fieldConfig.validateOnBlur) {
                const { errorMessage, hasError } = computeErrorMessage(prevState[fieldConfig.key], undefined, true)

                setState(prevState => ({
                    ...prevState,
                    [fieldConfig.key]: {
                        ...prevState[fieldConfig.key],
                        isPristine: false,
                        errorMessage,
                        hasError
                    }
                }))
            }
        },
        validateOnSubmit: () => {
            const { errorMessage, hasError } = computeErrorMessage(prevState[fieldConfig.key], undefined, true)

            setState(prevState => ({
                ...prevState,
                [fieldConfig.key]: {
                    ...prevState[fieldConfig.key],
                    errorMessage,
                    hasError
                }
            }))

            return {
                errorMessage,
                hasError
            }
        },
        onChangeInitialValue: (value: T) => {
            if (prevState.value === prevState.localInitialValue) {
                setState(prevState => ({
                    ...prevState,
                    [fieldConfig.key]: {
                        ...prevState[fieldConfig.key],
                        value,
                        localInitialValue: value
                    }
                }))
            }
        },
        setError: (errorMessage: string) => setState(prevState => ({
            ...prevState,
            [fieldConfig.key]: {
                ...prevState[fieldConfig.key],
                errorMessage
            }
        })),
        resetState: () => setState(prevState => ({
            ...prevState,
            [fieldConfig.key]: {
                ...prevState[fieldConfig.key],
                isPristine: true,
                errorMessage: '',
                value: fieldConfig.initialValue || ''
            }
        })),
        validate: () => {
            const { hasError, errorMessage } = computeErrorMessage(prevState[fieldConfig.key], undefined, true)

            setState(prevState => ({
                ...prevState,
                [fieldConfig.key]: {
                    ...prevState[fieldConfig.key],
                    errorMessage,
                    hasError
                }
            }))
        }
    } as ExtendedConfig<T>
}
