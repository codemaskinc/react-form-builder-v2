export declare global {
  interface ObjectConstructor extends globalThis.ObjectConstructor {
      keys<TObj>(object: TObj): Array<keyof TObj>,
      entries<TObj>(object: TObj): Array<[keyof TObj, TObj[keyof TObj]]>
  }

  interface Array<T> {
      includes(searchElement: any, fromIndex?: number): searchElement is T
  }
}
