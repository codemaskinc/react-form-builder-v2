import { act, renderHook } from '@testing-library/react-hooks'
import { useField, useForm } from '../main'

describe('initial value', () => {
    const useConfig = () => {
        const field = useField({
            initialValue: 'test',
            isRequired: true
        })

        return {
            field
        }
    }

    test('Change initial value', () => {
        const { result } = renderHook(() => useForm(useConfig(), {
            onSuccess: () => {}
        }))

        expect(result.current.form.field.value).toBe('test')

        act(() => {
            result.current.form.field.onChangeInitialValue('react')
        })

        act(() => {
            result.current.form.field.resetState()
        })

        expect(result.current.form.field.value).toBe('react')
    })
})
