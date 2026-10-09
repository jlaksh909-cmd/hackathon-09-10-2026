// Type declarations for React, DOM, and ES globals in standalone environment
// without requiring external @types/react packages or node_modules.

declare module 'react' {
  export interface ReactElement<P = any, T = any> {
    type: T;
    props: P;
    key: any;
  }

  export type ReactNode =
    | ReactElement<any, any>
    | string
    | number
    | boolean
    | null
    | undefined
    | any;

  export type FC<P = {}> = (props: P) => ReactElement<any, any> | null;
  export type FunctionComponent<P = {}> = FC<P>;

  export function useState<T>(
    initialState: T | (() => T)
  ): [T, (action: T | ((prevState: T) => T)) => void];

  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;

  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;

  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;

  export function useRef<T>(initialValue: T): { current: T };
  export function useRef<T>(initialValue: T | null): { current: T | null };

  export interface ChangeEvent<T = any> {
    target: T & { value: string };
  }

  export interface MouseEvent<T = any> {
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface FormEvent<T = any> {
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface KeyboardEvent<T = any> {
    key: string;
    preventDefault(): void;
  }

  export const createElement: any;
  export const Fragment: any;

  export namespace JSX {
    interface Element {
      type: any;
      props: any;
      key: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  const React: {
    FC: FC<any>;
    useState: typeof useState;
    useMemo: typeof useMemo;
    useEffect: typeof useEffect;
    useCallback: typeof useCallback;
    useRef: typeof useRef;
    createElement: any;
    Fragment: any;
  };

  export default React;
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {
      type: any;
      props: any;
      key: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react/jsx-dev-runtime' {
  export namespace JSX {
    interface Element {
      type: any;
      props: any;
      key: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  export const jsxDEV: any;
  export const Fragment: any;
}

declare namespace React {
  export type FC<P = {}> = (props: P) => any;
  export type ReactElement<P = any, T = any> = any;
  export type ReactNode = any;
  export type ChangeEvent<T = any> = { target: T & { value: string } };
  export type MouseEvent<T = any> = { preventDefault(): void; stopPropagation(): void };
  export namespace JSX {
    interface Element {
      type: any;
      props: any;
      key: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare namespace JSX {
  interface Element {
    type: any;
    props: any;
    key: any;
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

interface String {
  includes(searchString: string, position?: number): boolean;
  startsWith(searchString: string, position?: number): boolean;
  endsWith(searchString: string, position?: number): boolean;
}

interface Array<T> {
  includes(searchElement: T, fromIndex?: number): boolean;
  find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
  filter(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];
}

interface Set<T> {
  add(value: T): this;
  clear(): void;
  delete(value: T): boolean;
  has(value: T): boolean;
  readonly size: number;
  forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
}

interface SetConstructor {
  new <T = any>(values?: readonly T[] | null | any): Set<T>;
  readonly prototype: Set<any>;
}

declare var Set: SetConstructor;
