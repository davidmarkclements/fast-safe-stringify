declare function stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string;

declare namespace stringify {
  export function stable(data: any): string;
  export function stableStringify(data: any): string;
  export function decycle(val: any, replacer?: (val: any, k: string, stack: [any, any][], parent?: any) => any | void): any;
}

export default stringify;