import { act, renderHook } from '@testing-library/react-hooks'
import { useField } from '../main'
import { ValidationRule } from '../main/types'
import { rules } from './testUtils'

type Test = {
    validateOnBlur: boolean,
    required: boolean,
    rules: Array<ValidationRule<any>>,
    onChangeValue?: string,
    blur: boolean,
    expectValue?: string,
    expectError: boolean
}

describe('useField', () => {
    const testsCases = [
        {
            required: true,
            rules: [ rules.empty ],
            validateOnBlur: true,
            blur: true,
            expectError: true
        },
        {
            required: true,
            rules: [ rules.empty ],
            validateOnBlur: true,
            blur: false,
            expectError: false
        },
        {
            required: false,
            rules: [ rules.empty ],
            validateOnBlur: true,
            blur: false,
            expectError: false
        },
        {
            required: false,
            rules: [ rules.empty ],
            validateOnBlur: true,
            blur: true,
            expectError: false
        },
        {
            required: true,
            rules: [ rules.empty, rules.name ],
            validateOnBlur: true,
            onChangeValue: 't',
            expectValue: 't',
            blur: false,
            expectError: false
        },
        {
            required: true,
            rules: [ rules.empty, rules.name ],
            validateOnBlur: true,
            onChangeValue: 't',
            expectValue: 't',
            blur: true,
            expectError: true
        },
        {
            required: true,
            rules: [ rules.empty, rules.name ],
            onChangeValue: 'test',
            expectValue: 'test',
            blur: true,
            expectError: false
        },
        {
            required: false,
            onChangeValue: 'test',
            rules: [ rules.empty, rules.name ],
            expectValue: 'test',
            blur: true,
            expectError: false
        },
        {
            required: false,
            rules: [ rules.empty, rules.name ],
            onChangeValue: 't',
            expectValue: 't',
            blur: true,
            expectError: true
        }
    ] as Array<Test>

    testsCases.forEach(testCase => {
        test(JSON.stringify(testCase), () => {
            const { result } = renderHook(() => useField({
                key: 'test',
                initialValue: '',
                isRequired: testCase.required,
                validateOnBlur: testCase.validateOnBlur,
                validationRules: testCase.rules
            }))

            act(() => {
                if (testCase.onChangeValue) {
                    result.current.onChangeValue(testCase.onChangeValue)
                }

                if (testCase.blur) {
                    result.current.onBlur()
                }
            })

            if (testCase.expectValue) {
                expect(result.current.value).toBe(testCase.expectValue)
            }

            expect(result.current.hasError).toBe(testCase.expectError)
        })
    })

    test('Test if field gets pristine after correct value has been passed', () => {
        const { result } = renderHook(() => useField({
            key: 'test',
            initialValue: '',
            isRequired: true,
            validateOnBlur: true,
            validationRules: [ rules.empty, rules.name ]
        }))

        act(() => {
            result.current.onChangeValue('t')
            result.current.onBlur()    
        })
        expect(result.current.hasError).toBe(true)

        act(() => {
            result.current.onChangeValue('test')
        })
        expect(result.current.hasError).toBe(false)

        act(() => {
            result.current.onBlur()
        })
        expect(result.current.hasError).toBe(false)

        act(() => {
            result.current.onChangeValue('t')
        })
        expect(result.current.hasError).toBe(false)

        act(() => {
            result.current.onBlur()
        })
        expect(result.current.hasError).toBe(true)
    })
})
