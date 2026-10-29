declare function stringify(
  value: any,
  replacer?: (key: string, value: any) => any,
  space?: string | number,
  options?: { depthLimit: number | undefined; edgesLimit: number | undefined }
): string | undefined;

declare namespace stringify {
  import _default = stringify;
  export { _default as default };

  export function stable(
    value: any,
    replacer?: (key: string, value: any) => any,
    space?: string | number,
    options?: { depthLimit: number | undefined; edgesLimit: number | undefined }
  ): string | undefined;
  export function stableStringify(
    value: any,
    replacer?: (key: string, value: any) => any,
    space?: string | number,
    options?: { depthLimit: number | undefined; edgesLimit: number | undefined }
  ): string | undefined;
}

export = stringify;
