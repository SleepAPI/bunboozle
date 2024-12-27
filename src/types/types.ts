/* eslint-disable @typescript-eslint/no-explicit-any */
export type ModuleValue = ((...args: any[]) => any) | any;
export type Module<T> = T;
export type ModuleKey<T> = keyof T & string;

export type ExtractFunction<T, K extends keyof T> = T[K] extends (...args: any[]) => any ? T[K] : never;
export type MockImplementation<T extends Record<string, ModuleValue>, TKey extends keyof T> = T[TKey] extends (
  ...args: any[]
) => any
  ? (...args: Parameters<T[TKey]>) => ReturnType<T[TKey]> | Awaited<ReturnType<T[TKey]>>
  : T[TKey] | (() => T[TKey]);
