<p align="center">
    <img src="https://cdn.codegate.pl/react-form-builder-v2/react-form-builder-v2.png" width="400"/>
</p>

## <a href='https://www.typescriptlang.org/'><img src='https://badges.frapsoft.com/typescript/code/typescript.png?v=101' alt='typescript' height=20/></a> <a href='http://opensource.org/licenses/MIT'><img src='http://img.shields.io/badge/license-MIT-brightgreen.svg' alt='MIT' /></a> <a href="https://badge.fury.io/js/@codegateinc%2Freact-form-builder-v2"><img src="https://badge.fury.io/js/@codegateinc%2Freact-form-builder-v2.svg" alt="npm version" height="18"></a>

React-form-builder-v2 is a library that allows you to create highly customizable forms by rendering your own components and simply storing the state. It works perfectly with ReactJS, React Native, and monorepo with React Native Web.

Create your own components and simply pass callbacks, errors, and values. You can store any type of value in the useField. It can be a string, boolean, number, array, or even an object.

### Features

- Fully working on hooks
- Relies only on react and ramda
- Highly customizable components
- Well typed (Typescript)

### [Live demo](https://codesandbox.io/embed/focused-firefly-j96uom)

## Install
`yarn add @codegateinc/react-form-builder-v2` or `npm install --save @codegateinc/react-form-builder-v2`

## Hooks

### useField

```typescript
type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T): boolean
}

useField(config)
```

#### useField config

| Property        | Type                       | Description                                                                                                                               |
|-----------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| key             | string                     | Default: `undefined`.<br> This field is required, must be a unique within whole form.                                                     |
| label           | string                     | Default: `undefined`.<br> The label value that will be passed through the field.                                                          |
| initialValue    | generic (T)                | Default: `undefined`.<br> This field is required. This will define the initial value of the field.                                        |
| isRequired      | boolean                    | Default: `false`.<br> Defines if the field is required and should be mandatory. With `validation rules` it can be additionally validated. |
| placeholder     | string                     | Default: `undefined`.<br> Placeholder value that will be passed via the field                                                             |
| validateOnBlur  | boolean                    | Default: `false`.<br> Defines if the field should be validated when blurred. This field is required only for text inputs.                 |
| validationRules | Array<ValidationRule`<T>`> | Default: `undefined`.<br> Array of validation objects that will define if the field is valid                                              |
| liveParser      | (value: T) => T            | Default: `undefined`.<br> Function that, if defined, will be invoked every time the value changes.                                        |
| submitParser    | (value: T) => T            | Default: `undefined`.<br> Function that, if defined, will be invoked after the submit function is invoked.                                |

#### validationRules example

```typescript
validationRule: [
    {
        errorMessage: 'this field should be at least 2 chars',
        validate: (value: string) => value.length >= 2
    }
]
```

### useForm

```typescript
const statesAndFunctions = useForm(config, callbacks)
```

#### States and functions
| Property             | Type                                        | Description                                                                                                                                                      |
|----------------------|---------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| form                 | Record<string, T>                           | Form with all values.                                                                                                                                            |
| hasError             | boolean                                     | Indicates if the form has an error.                                                                                                                              |
| isFilled             | boolean                                     | Determines whether or not all fields have changed.                                                                                                               |
| formHasChanges       | () => boolean                               | Returns a boolean indicating whether any fields have changed.                                                                                                    |
| setError             | (key: string, errorMessage: string) => void | Sets an error to a field, even if the field is valid. After revalidation, this error disappears. It can be useful for server-side validation.                    |
| setFieldValue        | (key: string, value: T) => void             | Sets the field value.                                                                                                                                            |
| setFieldInitialValue | (key: string, initialValue: string) => void | Sets a field's initial value. The value of the field will change if it is pristine.                                                                              |
| addFields            | (fields: Array`<Field<any>>`) => void       | Adds new fields to the form. It allows users to create recurring forms or add new fields during runtime.                                                         |
| removeFieldIds       | (ids: Array`<string>`) => void              | Removes fields from the form at runtime. Deletes only fields that were added with the "addFields" function. Fields passed in by configuration cannot be removed. |
| resetForm            | () => void                                  | Resets all fields and forms to their initial values and states.                                                                                                  |
| submit               | () => void                                  | Submits the form, validating all the fields that are required.                                                                                                   |
| validateAll          | () => void                                  | Validates all fields.                                                                                                                                            |

## Usage

### Basic

Let's create our first component
```typescript jsx
    import React from 'react'
    import { ReactSmartScroller } from '@codegateinc/react-form-builder-v2'
    
    const getConfig = () => {
        const name = useField({
            key: 'name',
            initialValue: '',
            isRequired: true,
            placeholder: 'name'
        })
        const surname = useField({
            key: 'surname',
            initialValue: '',
            isRequired: true,
            placeholder: 'surname'
        })
    
        return {
            name,
            surname
        }
    }
    
    export const FormBuilder: React.FunctionComponent = () => {
        const { form, submit } = useForm(getConfig(), {
            onSuccess: validForm => console.log(validForm)
        })

        return (
            <Container>
                <Input {...form.name}/>
                <Input {...form.surname}/>
                <Button onClick={submit}>
                    save
                </Button>
            </Container>
        )
    }

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        padding: 100px;
        align-items: center;
        input {
            margin-bottom: 20px;
        }
    `
    
    const Button = styled.div`
        background-color: green;
        padding: 10px 15px;
        color: white;
        border-radius: 20px;
        cursor: pointer;
    `
```
## Contribution

Library created by [Jacek Pudysz](https://github.com/jpudysz) and [Grzegorz Tarnopolski](https://github.com/gtarnopolski)
