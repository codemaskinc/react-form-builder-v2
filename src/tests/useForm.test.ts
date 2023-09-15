import { renderHook } from '@testing-library/react-hooks'
import { useField, useForm } from '../main'

type FieldConfig = {
    isRequired: boolean,
    initialValue: any
}

type TestCase = {
    expect: boolean,
    fieldConfig: FieldConfig
}

describe('useForm', () => {
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
                key: 'test',
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
