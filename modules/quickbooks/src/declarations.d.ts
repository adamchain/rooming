// This file provides explicit declarations for modules that TypeScript can't find

declare module 'react' {
    // React hooks
    export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
    export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
    export function useRef<T>(initialValue: T): { current: T };
    export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
    export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T;
    export function useContext<T>(context: React.Context<T>): T;

    // React component types
    export type FC<P = {}> = FunctionComponent<P>;
    export interface FunctionComponent<P = {}> {
        (props: P & { children?: ReactNode }): ReactElement | null;
    }

    export type ReactNode =
        | ReactElement
        | string
        | number
        | boolean
        | null
        | undefined;

    export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
        type: T;
        props: P;
        key: Key | null;
    }

    export type Key = string | number;

    export type JSXElementConstructor<P> =
        | ((props: P) => ReactElement | null)
        | (new (props: P) => Component<P, any>);

    export type ElementType<P = any> =
        | string
        | JSXElementConstructor<P>;

    export class Component<P = {}, S = {}> {
        constructor(props: P);
        readonly props: Readonly<P>;
        state: Readonly<S>;
        setState(state: S | ((prevState: Readonly<S>, props: Readonly<P>) => S), callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        render(): ReactNode;
    }
}

declare module 'react-dom' {
    export function render(element: React.ReactNode, container: Element | null): void;
    export function createRoot(container: Element | null): { render(element: React.ReactNode): void };
}

declare module 'recharts' {
    import { ComponentType, ReactNode } from 'react';

    export interface CommonProps {
        className?: string;
        children?: ReactNode;
        width?: number;
        height?: number;
    }

    export const LineChart: ComponentType<CommonProps & {
        data?: any[];
        margin?: { top?: number; right?: number; bottom?: number; left?: number };
    }>;

    export const Line: ComponentType<{
        type?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
        dataKey?: string;
        stroke?: string;
        strokeWidth?: number;
        dot?: boolean | object | ReactNode;
        activeDot?: boolean | object | ReactNode;
    }>;
}
export const CartesianGrid: Component