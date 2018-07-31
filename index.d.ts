declare function stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string;

declare namespace stringify {
  export function stable(data: any): string;
  export function stableStringify(data: any): string;
}

export default stringify;
