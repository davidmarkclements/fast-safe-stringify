declare function stringify(data: any): string;

declare namespace stringify {
  export declare function stable(data: any): string;
  export declare function stableStringify(data: any): string;
}

export default stringify;
