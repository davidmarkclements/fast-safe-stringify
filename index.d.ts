declare function stringify(
  value: any,
  replacer?: (key: string, value: any) => any,
  space?: string | number,
  options?: { depthLimit: number; edgesLimit: number }
): string;

declare namespace stringify {
  export function stable(
    value: any,
    replacer?: (key: string, value: any) => any,
    space?: string | number,
    options?: { depthLimit: number; edgesLimit: number }
  ): string;
  export function stableStringify(
    value: any,
    replacer?: (key: string, value: any) => any,
    space?: string | number,
    options?: { depthLimit: number; edgesLimit: number }
  ): string;
}

export default stringify;
