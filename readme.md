<p align="center">
    <img src="https://cdn.codegate.pl/react-form-builder-v2/react-form-builder-v2.png" width="400"/>
</p>

## <a href='https://www.typescriptlang.org/'><img src='https://badges.frapsoft.com/typescript/code/typescript.png?v=101' alt='typescript' height=20/></a> <a href='http://opensource.org/licenses/MIT'><img src='http://img.shields.io/badge/license-MIT-brightgreen.svg' alt='MIT' /></a> <a href="https://badge.fury.io/js/@codegateinc%2Freact-form-builder-v2"><img src="https://badge.fury.io/js/@codegateinc%2Freact-form-builder-v2.svg" alt="npm version" height="18"></a>

React-form-builder-v2 is a library that allows you to create highly customizable forms, rendering your own components, simply storing only the state. It works perfectly with ReactJS, React Native and monorepo ReactJS React Native

Create your own components and simply pass callbacks, errors and value. In the useField you can store any type of value you want. It can be an string, boolean, number, array or even object.

### Features

- Fully working on hooks
- Relies only on react and ramda
- Highly customizable components
- Well typed (Typescript)

### [Live demo](https://codesandbox.io/embed/focused-firefly-j96uom)

## Install
`yarn add @codegateinc/react-form-builder-v2 ramda` or `npm install --save @codegateinc/react-form-builder-v2 ramda`

## Hooks

### useField

```
type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T): boolean
}

useField(config)
```

#### useField config

| Property        | Type                       | Description                                                                                       |
|-----------------|----------------------------|---------------------------------------------------------------------------------------------------|
|  key            | string                     | Default: `undefined`.<br> This field is required.                                                 |
| label           | string                     | Default: `undefined`.<br> Label value that will be passed via field.                              |
| initialValue    | generic (T)                | Default: `undefined`.<br> This field is required.                                                 |
| isRequired      | boolean                    | Default: `false`.<br> Defines if the field is required and should be validated.                   |
| placeholder     | string                     | Default: `undefined`.<br> Placeholder value that will be passed via field.                        |
| validateOnBlur  | boolean                    | Default: `false`.<br> Defines if the field should be validated when blurred                       |
| validationRules | Array<ValidationRule`<T>`> | Default: `undefined`.<br> Array of validation objects that will define if the field is valid      |
| liveParser      | (value: T) => T            | Default: `undefined`.<br> Function that if defined, will be invoked everytime the value changes   |
| submitParser    | (value: T) => T            | Default: `undefined`.<br> Function that if defined, will be invoked after submit function invoked |

### useForm

```
const statesAndFunctions = useForm(config, callbacks)
```

#### statesAndFunctions
| Property             | Type                                        | Description                                                                                                                                             |
|----------------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| form                 | Record<string, T>                           | Form with all values.                                                                                                                                   |
| hasError             | boolean                                     | Defines if form got an error.                                                                                                                           |
| isFilled             | boolean                                     | Defines if all fields did change.                                                                                                                       |
| formHasChanges       | () => boolean                               | Returns boolean that indicates if any field did change.                                                                                                 |
| setError             | (key: string, errorMessage: string) => void | Sets error to a field, even if the field is valid. After re-validation this error disappears.                                                           |
| setFieldValue        | (key: string, value: T) => void             | Sets field value.                                                                                                                                       |
| setFieldInitialValue | (key: string, initialValue: string) => void | Sets initial value of a field. This function will change the value too if it was not changed yet.                                                       |
| addFields            | (fields: Array`<Field<any>>`) => void       | Adds new fields to the form. It allows users to create recurring forms or to add new fields during the runtime.                                         |
| removeFieldIds       | (ids: Array`<string>`) => void              | Removes fields from the form at a runtime. Deletes only fields that were added with `addFields` function. Fields passed in by config cannot be removed. |
| resetForm            | () => void                                  | Resets form to initial values.                                                                                                                          |
| submit               | () => void                                  | Submits form, validating all the fields that are required.                                                                                              |
| validateAll          | () => void                                  | Validates all fields.                                                                                                                                   |

## Usage

### Basic

Let's create our first component

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


This is what you'll see in your browser:

<p align="center">
  <img src="https://cdn.codegate.pl/react-form-builder-v2/base-view.png" />
</p>

## Contribution

Library created by Jacek Pudysz and Grzegorz Tarnopolski
