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
            return ''
        }

        const val = (R.isDefined(value)
            ? value
            : field.value) as T

        if (field.isRequired && isEmpty(val)) {
            return field.validationRules[0].errorMessage
        }

        if (!field.isRequired && !Boolean(val)) {
            return ''
        }

        const firstError = field.validationRules
            .find(rule => !rule.validate(val))

        return firstError
            ? firstError.errorMessage
            : ''
    }

    return {
        ...fieldConfig,
        value: '',
        hasChange: false,
        isPristine: true,
        parentKey,
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

            return {
                ...prevState,
                [fieldConfig.key]: {
                    ...changedField,
                    errorMessage: computeErrorMessage(changedField, value)
                }
            }
        }),
        onBlur: () => fieldConfig.validateOnBlur && setState(prevState => ({
            ...prevState,
            [fieldConfig.key]: {
                ...prevState[fieldConfig.key],
                isPristine: false,
                errorMessage: computeErrorMessage(prevState[fieldConfig.key], undefined, true)
            }
        })),
        validateOnSubmit: () => {
            const errorMessage = computeErrorMessage(prevState[fieldConfig.key], undefined, true)

            if (errorMessage) {
                setState(prevState => ({
                    ...prevState,
                    [fieldConfig.key]: {
                        ...prevState[fieldConfig.key],
                        errorMessage
                    }
                }))

                return errorMessage
            }

            return ''
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
        validate: () => setState(prevState => ({
            ...prevState,
            [fieldConfig.key]: {
                ...prevState[fieldConfig.key],
                errorMessage: computeErrorMessage(prevState[fieldConfig.key], undefined, true)
            }
        }))
    } as ExtendedConfig<T>
}
