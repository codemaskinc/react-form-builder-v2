import { isEmpty } from 'ramda'
import { FormFieldLike } from 'main/types'

export const useFormValidator = (formFields: Array<FormFieldLike>) => {
    const hasMissingOptions = formFields
        .some(field => field.isRequired && Boolean(field.value))
    const hasError = formFields
        .some(field => !isEmpty(field.errorMessage))

    return {
        hasError: hasError || hasMissingOptions
    }
}
