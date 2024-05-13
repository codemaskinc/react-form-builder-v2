import { act, renderHook } from '@testing-library/react-hooks'
import { useField, useForm } from '../main'
import { rules } from './testUtils'

describe('isValid', () => {
    const useConfig = () => {
        const field = useField({
            initialValue: '',
            isRequired: true,
            validateOnBlur: true,
            validationRules: [
                rules.empty,
                rules.name
            ]
        })

        return {
            field
        }
    }

    test('isValid should update', () => {
        const { result } = renderHook(() => useForm(useConfig(), {
            onSuccess: () => {}
        }))

        expect(result.current.isValid).toBe(false)

        act(() => {
            result.current.form.field.onChangeValue('re')
        })

        expect(result.current.form.field.value).toBe('re')
        expect(result.current.isValid).toBe(false)
        expect(result.current.hasError).toBe(false)

        act(() => {
            result.current.form.field.onChangeValue('react')
        })
        
        expect(result.current.form.field.value).toBe('react')
        expect(result.current.isValid).toBe(true)
        expect(result.current.hasError).toBe(false)
    })
})
