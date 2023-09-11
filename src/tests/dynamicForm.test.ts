import { act, renderHook } from '@testing-library/react-hooks'
import { useForm } from '../main'
import { rules } from './testUtils'

describe('dynamic form', () => {
    test('Change value in dynamic field', () => {
        const { result } = renderHook(() => useForm({}, { onSuccess: () => {}}))

        act(() => {
            result.current.addFields([
                {
                    key: 'test',
                    initialValue: ''
                }
            ])
        })

        act(() => {
            result.current.form.test?.onChangeValue('test')
        })

        expect(result.current.form.test?.value).toBe('test')

        act(() => {
            result.current.form.test?.onChangeValue('react')
        })

        expect(result.current.form.test?.value).toBe('react')
    })

    test('Validate dynamic field', () => {
        const { result } = renderHook(() => useForm({}, { onSuccess: () => {}}))

        act(() => {
            result.current.addFields([
                {
                    key: 'test',
                    initialValue: '',
                    isRequired: true,
                    validationRules: [ rules.empty ],
                    validateOnBlur: true
                }
            ])
        })

        act(() => {
            result.current.form.test?.onBlur()
        })

        expect(result.current.form.test?.hasError).toBe(true)
    })
})