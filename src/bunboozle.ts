/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeAll, mock, Mock, spyOn } from 'bun:test';
import { ExtractFunction, ModuleKey, ModuleValue } from './types/types.js';

const activeSpies = new Set<Mock<(...args: any[]) => any>>();

// export function boozle<T extends Record<string, ModuleValue>>(module: T): Mock<T>;

export function boozle<
  T extends Record<string, ModuleValue>,
  TKey extends ModuleKey<T>,
  TFunc extends ExtractFunction<T, TKey>
>(module: T, functionName: TKey, ...implementations: Array<TFunc>): Mock<TFunc> {
  if (typeof module[functionName] !== 'function') {
    throw new Error(`${String(functionName)} is not a function in the provided module.`);
  }

  const spy = spyOn(module, functionName) as Mock<TFunc>;

  if (implementations.length === 1) {
    spy.mockImplementation(implementations[0]);
  } else {
    implementations.forEach((impl) => {
      spy.mockImplementationOnce(impl);
    });
  }

  activeSpies.add(spy);

  return spy;
}

export function boozleAllProperties<T extends object>(obj: T): T {
  const prototype = Object.getPrototypeOf(obj);
  const allKeys = new Set([...Object.keys(obj), ...Object.getOwnPropertyNames(prototype)]);

  for (const key of allKeys) {
    if (typeof obj[key as keyof T] === 'function') {
      obj[key as keyof T] = mock() as T[keyof T];
    }
  }

  return obj;
}

/**
 * Use beforeAll to attach afterEach to the test suite's lifecycle
 */
beforeAll(() => {
  afterEach(() => {
    for (const spy of activeSpies) {
      spy.mockRestore();
    }
    activeSpies.clear();
  });
});
