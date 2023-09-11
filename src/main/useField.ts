import { useState } from 'react'
import { GateField, FieldConfig, GateFieldState } from './types'
import { generateField } from './generateField'

export function useField<T>(fieldConfig: FieldConfig<T>): GateField<T> {
    const [field, setField] = useState<GateFieldState<T>>({
        value: fieldConfig.initialValue as T,
        localInitialValue: fieldConfig.initialValue as T,
        isPristine: true,
        errorMessage: '',
        hasError: false
    })

    return generateField({
        fieldConfig,
        field,
        setField
    })
}
