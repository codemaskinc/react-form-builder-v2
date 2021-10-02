/* eslint-disable  @typescript-eslint/no-explicit-any */
const isDefined = (subject: any) => typeof subject !== 'undefined' && subject !== null
const ifDefined = <T>(subject: any, then: (subject: any) => T) => isDefined(subject) && then(subject)

export {
    isDefined,
    ifDefined
}
