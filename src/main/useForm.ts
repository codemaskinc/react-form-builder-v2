import { useEffect, useRef, useState } from 'react'
import { isEmpty } from 'ramda'
import { R } from 'lib/utils'
import { generateField } from './generateField'
import { ChildrenFieldConfig, DynamicForm, ExtendedConfig, ExtractForm, FieldConfig, Form, GateField, InnerForm } from './types'

type FormGateCallbacks<T extends Form> = {
    onSuccess(form: ExtractForm<T>): void,
    onError?(form: Record<keyof T, string>): void
}

export function useForm<T extends Form>(
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
            .entries(innerForm)
            .reduce((acc, [key, field]) => {
                const fieldKeys = field.parentKey
                    .split('.')
                    .filter(Boolean)

                if (fieldKeys.length > 0) {
                    const mappedField = fieldKeys
                        .reduce((localAcc, localKey, index) => {
                            return {
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
                            }
                        }, {} as FieldConfig<any>)
                    const removeEmptyObjects = Object
                        .keys(mappedField)
                        .filter(key => Object.keys(mappedField[key]).length)
                        .reduce((acc, key) => ({
                            ...acc,
                            [key]: mappedField[key]
                        }), {} as Record<string, FieldConfig<any>>)

                    return {
                        ...acc,
                        ...removeEmptyObjects
                    }
                }

                return {
                    ...acc,
                    [key]: field
                }
            }, {} as Record<string, FieldConfig<any>>)
    } as DynamicForm<T>

    const hasError = Object
        .values(form)
        .filter(item => item.isRequired)
        .some(item => Boolean(item.errorMessage))

    const addFieldsRecurrence = (field: ChildrenFieldConfig<any>, parentKey: string): Record<string, ExtendedConfig<any>> => {
        if (field.children) {
            return field.children.reduce((acc, child) => ({
                ...acc,
                ...addFieldsRecurrence(child, `${parentKey}.${field.key}`)
            }), {} as Record<string, ExtendedConfig<any>>)
        }

        return {
            [field.key]: generateField({
                fieldConfig: field,
                field: innerFormRef[field.key],
                parentKey,
                setField: getNewState => {
                    if (typeof getNewState !== 'function') {
                        return
                    }

                    setInnerForm(prevState => ({
                        ...prevState,
                        [field.key]: {
                            ...innerFormRef.current[field.key],
                            ...getNewState(innerFormRef.current[field.key])
                        }
                    }))
                }
            })
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
            .every(item => Boolean(item.value) && !isEmpty(item.value)),
        isValid: Object
            .values<GateField<any>>(form)
            .filter(item => item.isRequired)
            .every(item => Boolean(item.value) && !isEmpty(item.value) && item.computeErrorMessage(item.value).hasError === false),
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
        addFields: (fields: Array<ChildrenFieldConfig<any>>) => setInnerForm(prevState => ({
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
                .keys(form)
                .reduce<Record<string, string>>((acc, fieldKey) => {
                    const field = form[fieldKey] as GateField<any>
                    const { hasError, errorMessage } = field.validateOnSubmit()

                    if (!errorMessage) {
                        return acc
                    }

                    return {
                        ...acc,
                        [fieldKey]: errorMessage || (hasError ? 'This field is required' : '')
                    }
                }, {})
            const hasErrors = Object.values(errors).length > 0

            if (hasErrors) {
                return R.ifDefined(callbacks.onError, onError => onError(errors))
            }

            const parsedForm = Object
                .keys(form)
                .reduce((acc, fieldKey) => {
                    const { value, submitParser } = form[fieldKey] as GateField<any>

                    return {
                        ...acc,
                        [fieldKey]: submitParser
                            ? submitParser(value)
                            : value,
                    }
                }, {} as ExtractForm<T>)

            callbacks.onSuccess(parsedForm)
        },
        validateAll: () => Object
            .values(form)
            .some(field => field.validate())
    }
}
