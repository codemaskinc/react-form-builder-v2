import { useEffect, useRef, useState } from 'react'
import { isEmpty } from 'ramda'
import { R } from 'lib/utils'
import { generateField } from './generateField'
import { FieldConfig, GateField, InnerForm } from './types'

type FormGateCallbacks<T> = {
    onSuccess(form: T): void,
    onError?(form: Record<keyof T, string>): void
}

export function useForm<T extends Record<PropertyKey, GateField<any>>>(
    formFields: T,
    callbacks: FormGateCallbacks<T>
) {
    const injectedForm = Object
        .entries(formFields)
        .reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value
        }), {}) as {[K in keyof T]: T[K]}
    const [innerForm, setInnerForm] = useState<InnerForm<T>>({} as InnerForm<T>)
    const innerFormRef = useRef(innerForm)
    const form = {
        ...injectedForm,
        ...Object
            .entries<GateField<any>>(innerForm)
            .reduce((acc, [key, field]) => {
                const fieldKeys = field.parentKey
                    .split('.')
                    .filter(Boolean)

                if (fieldKeys.length > 0) {
                    const mappedField = fieldKeys
                        .reduce((localAcc, localKey, index) => ({
                            ...acc,
                            ...localAcc,
                            [localKey]: {
                                ...acc[localKey],
                                ...(localAcc[localKey] || {}),
                                ...(index === fieldKeys.length - 1 ? {
                                    children: [
                                        ...(localAcc[localKey]?.children || []),
                                        field
                                    ]
                                } : {})
                            }
                        }), {})
                    const removeEmptyObjects = Object
                        .keys(mappedField)
                        .filter(key => Object.keys(mappedField[key]).length)
                        .reduce((acc, key) => ({
                            ...acc,
                            [key]: mappedField[key]
                        }), {})

                    return {
                        ...acc,
                        ...removeEmptyObjects
                    }
                }

                return {
                    ...acc,
                    [key]: field
                }
            }, {})
    }

    const hasError = Object
        .values<GateField<any>>(form)
        .filter(item => item.isRequired)
        .some(item => Boolean(item.errorMessage))

    const addFieldsRecurrence = (field: FieldConfig<any>, parentKey: string): any => {
        if (field.children) {
            return field.children.reduce((acc, child) => ({
                ...acc,
                ...addFieldsRecurrence(child, `${parentKey}.${field.key}`)
            }), {})
        }

        return {
            [field.key]: generateField(field, innerFormRef, setInnerForm, parentKey)
        }
    }

    useEffect(() => {
        innerFormRef.current = innerForm
    }, [innerForm])

    return {
        form,
        hasError,
        isFilled: Object
            .values<GateField<any>>(form)
            .filter(item => item.isRequired)
            .every(item => !isEmpty(item.value)),
        formHasChanges: () => Object
            .values<GateField<any>>(form)
            .some(field => field.hasChange),
        setError: (field: keyof T, errorMessage: string) => {
            form[field].setError(errorMessage)

            R.ifDefined(callbacks.onError, onError => onError({
                [field]: errorMessage
            }))
        },
        setFieldValue: (field: keyof T, value: any) => {
            form[field].onChangeValue(value)
        },
        setFieldInitialValue: (field: keyof T, value: any) => {
            form[field].onChangeInitialValue(value)
        },
        addFields: (fields: Array<FieldConfig<any>>) => setInnerForm(prevState => ({
            ...prevState,
            ...fields.reduce((acc, item) => ({
                ...acc,
                ...addFieldsRecurrence(item, '')
            }), {})
        })),
        removeFieldIds: (fields: Array<string>) => setInnerForm(prevState => Object
            .keys(prevState)
            .reduce((acc, key) => {
                if (fields.includes(key)) {
                    return acc
                }

                return {
                    ...acc,
                    [key]: prevState[key]
                }
            }, {} as InnerForm<T>)
        ),
        resetForm: () => Object
            .keys(form)
            .forEach(key => (form[key] as GateField<any>).resetState()),
        submit: () => {
            const errors = Object
                .values<GateField<any>>(form)
                .map(field => {
                    const { hasError, errorMessage } = field.validateOnSubmit()

                    return {
                        key: field.key,
                        errorMessage: errorMessage || (hasError ? 'This field is required' : '')
                    }
                })
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
        },
        validateAll: () => Object
            .values<GateField<any>>(form)
            .forEach(field => field.validate())
    }
}
