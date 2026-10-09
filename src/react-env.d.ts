// Type declarations for React, ReactDOM, and ES/Vite environment
// Standalone definitions without requiring external @types packages.

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
    | Iterable<ReactNode>
    | any;

  export type FC<P = {}> = (props: P & { key?: any }) => ReactElement<any, any> | null;
  export type FunctionComponent<P = {}> = FC<P>;
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };

  export function useState<T>(
    initialState: T | (() => T)
  ): [T, (action: T | ((prevState: T) => T)) => void];

  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useContext<T>(context: any): T;
  export function useReducer<R extends (...args: any[]) => any>(reducer: R, initialState: any, initialAction?: any): [any, any];

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
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    preventDefault(): void;
  }

  export interface SyntheticEvent<T = any> {
    preventDefault(): void;
    stopPropagation(): void;
    target: T;
  }

  export interface SVGProps<T = any> {
    className?: string;
    viewBox?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: string | number;
    xmlns?: string;
    width?: string | number;
    height?: string | number;
    [key: string]: any;
  }

  export const createElement: any;
  export const Fragment: any;
  export const StrictMode: any;

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
    FunctionComponent: FunctionComponent<any>;
    useState: typeof useState;
    useMemo: typeof useMemo;
    useEffect: typeof useEffect;
    useCallback: typeof useCallback;
    useRef: typeof useRef;
    useContext: typeof useContext;
    useReducer: typeof useReducer;
    createElement: any;
    Fragment: any;
    StrictMode: any;
    [key: string]: any;
  };

  export default React;
}

declare module 'react-dom' {
  export interface Root {
    render(children: any): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment | null, options?: any): Root;
  export function render(element: any, container: any): void;
  export function createPortal(children: any, container: any): any;
  export function unmountComponentAtNode(container: any): boolean;

  const ReactDOM: {
    createRoot: typeof createRoot;
    render: typeof render;
    createPortal: typeof createPortal;
    unmountComponentAtNode: typeof unmountComponentAtNode;
    [key: string]: any;
  };

  export default ReactDOM;
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: any): void;
    unmount(): void;
  }

  export function createRoot(
    container: Element | DocumentFragment | null,
    options?: { identifierPrefix?: string; onRecoverableError?: (error: any) => void }
  ): Root;

  export function hydrateRoot(
    container: Element | DocumentFragment | null,
    initialChildren: any,
    options?: any
  ): Root;

  const ReactDOMClient: {
    createRoot: typeof createRoot;
    hydrateRoot: typeof hydrateRoot;
    [key: string]: any;
  };

  export default ReactDOMClient;
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

declare module 'lucide-react' {
  import React from 'react';
  export type IconComponent = (props: React.SVGProps<SVGSVGElement> & { size?: number | string; color?: string; strokeWidth?: number | string; className?: string; [key: string]: any }) => any;
  export const Sparkles: IconComponent;
  export const Send: IconComponent;
  export const Globe: IconComponent;
  export const Trash2: IconComponent;
  export const Copy: IconComponent;
  export const Check: IconComponent;
  export const FileText: IconComponent;
  export const ChevronDown: IconComponent;
  export const BookOpen: IconComponent;
  export const Filter: IconComponent;
  export const GraduationCap: IconComponent;
  export const X: IconComponent;
  export const ThumbsUp: IconComponent;
  export const ThumbsDown: IconComponent;
  export const Bot: IconComponent;
  export const User: IconComponent;
  export const Calendar: IconComponent;
  export const Flame: IconComponent;
  export const CheckCircle: IconComponent;
  export const CheckCircle2: IconComponent;
  export const Bookmark: IconComponent;
  export const Circle: IconComponent;
  export const ExternalLink: IconComponent;
  export const Play: IconComponent;
  export const Eye: IconComponent;
  export const Clock: IconComponent;
  export const Download: IconComponent;
  export const Search: IconComponent;
  export const Plus: IconComponent;
  export const ArrowRight: IconComponent;
}

declare namespace React {
  export type FC<P = {}> = (props: P & { key?: any }) => any;
  export type FunctionComponent<P = {}> = FC<P>;
  export type ReactElement<P = any, T = any> = any;
  export type ReactNode = any;
  export type ChangeEvent<T = any> = { target: T & { value: string } };
  export type MouseEvent<T = any> = { preventDefault(): void; stopPropagation(): void };
  export type FormEvent<T = any> = { preventDefault(): void; stopPropagation(): void };
  export interface KeyboardEvent<T = any> {
    key: string;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    preventDefault(): void;
  }
  export interface SVGProps<T = any> {
    className?: string;
    viewBox?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: string | number;
    xmlns?: string;
    width?: string | number;
    height?: string | number;
    [key: string]: any;
  }
  export const StrictMode: any;
  export const Fragment: any;
  export const createElement: any;

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

declare namespace ReactDOM {
  export interface Root {
    render(children: any): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment | null, options?: any): Root;
  export function render(element: any, container: any): void;
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

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
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
