import { R } from 'lib/utils'
import { FormFieldLike } from 'main/types'

export const useFormValidator = (formFields: Array<FormFieldLike>) => {
    const hasMissingOptions = formFields
        .some(field => field.isRequired && R.isEmpty(field.value))
    const hasError = formFields
        .some(field => !R.isEmpty(field.errorMessage))

    return {
        hasError: hasError || hasMissingOptions
    }
}
