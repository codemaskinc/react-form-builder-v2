import { act, renderHook } from '@testing-library/react-hooks'
import { jest } from '@jest/globals'
import { useField, useForm } from '../main'
import { rules } from './testUtils'

type FieldConfig = {
    isRequired: boolean,
    initialValue: any
}

type TestCase = {
    expect: boolean,
    fieldConfig: FieldConfig
}

describe('useForm - isFilled', () => {
    const formFields: Array<TestCase> = [
            {
                expect: false,
                fieldConfig: {
                    isRequired: true,
                    initialValue: ''
                }
            },
            {
                expect: false,
                fieldConfig: {
                    isRequired: true,
                    initialValue: undefined
                }
            },
            {
                expect: false,
                fieldConfig: {
                    isRequired: true,
                    initialValue: null
                }
            },
            {
                expect: false,
                fieldConfig: {
                    isRequired: true,
                    initialValue: {}
                }
            },
            {
                expect: false,
                fieldConfig: {
                    isRequired: true,
                    initialValue: []
                }
            },
            {
                expect: false,
                fieldConfig: {
                    isRequired: true,
                    initialValue: false
                }
            },
            {
                expect: true,
                fieldConfig: {
                    isRequired: false,
                    initialValue: false
                }
            },
            {
                expect: true,
                fieldConfig: {
                    isRequired: true,
                    initialValue: '123',
                }
            },
            {
                expect: true,
                fieldConfig: {
                    isRequired: true,
                    initialValue: {
                        test: 'test'
                    }
                }
            },
            {
                expect: true,
                fieldConfig: {
                    isRequired: false,
                    initialValue: {}
                }
            },
            {
                expect: false,
                fieldConfig: {
                    isRequired: true,
                    initialValue: null
                }
            }
    ]


    formFields.forEach(testCase => {
        test(JSON.stringify(testCase), () => {
            const { isRequired, initialValue } = testCase.fieldConfig
            const { result: field } = renderHook(() => useField({
                initialValue,
                isRequired
            }))
            const testField = {
                field: field.current
            }
            const { result } = renderHook(() => useForm(testField, {
                    onError: () => {},
                    onSuccess: () => {}
                })
            )

            expect(result.current.isFilled).toBe(testCase.expect)
        })
    })
})

describe('useForm - submit form', () => {
    const useConfig = () => {
        const field = useField({
            initialValue: '',
            isRequired: true,
            validationRules: [ rules.empty ]
        })

        const nonRequired = useField({
            initialValue: '',
            isRequired: false,
            validationRules: [ rules.empty ]
        })

        return {
            field,
            nonRequired
        }
    }

    test('One field is required, the other one is not', () => {
        const callback = jest.fn()
        const { result } = renderHook(() => useForm(useConfig(), {
            onSuccess: callback
        }))

        act(() => {
            result.current.form.field.onChangeValue('test')
        })

        act(() => {
            result.current.submit()
        })

        expect(callback).toBeCalled()
    })
})
