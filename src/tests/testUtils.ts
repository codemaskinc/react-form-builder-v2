export enum Errors {
    Empty = 'Empty',
    InvalidFormat = 'InvalidFormat'
}

export const rules = {
    empty: {
        errorMessage: Errors.Empty,
        validate: (value: string) => Boolean(value)
    },
    name: {
        errorMessage: Errors.InvalidFormat,
        validate: (value: string) => value.length > 3
    }
}
