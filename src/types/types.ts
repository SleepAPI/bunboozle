/* eslint-disable @typescript-eslint/no-explicit-any */
export type ModuleValue = ((...args: any[]) => any) | any;
export type Module<T> = T;
export type ModuleKey<T> = keyof T & string;

export type ExtractFunction<T, K extends ModuleKey<T>> = T[K] extends (...args: any[]) => any ? T[K] : never;
