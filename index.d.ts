declare function stringify(data: any): string;

declare namespace stringify {
  export function stable(data: any): string;
  export function stableStringify(data: any): string;
  export function decirc(val: any, k: string, stack: any[], parent?: any): void;
}

export default stringify;