/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeAll, mock, Mock, spyOn } from 'bun:test';
import { MockImplementation, ModuleKey, ModuleValue } from './types/types.js';

const activeSpies = new Set<Mock<(...args: any[]) => any>>();

export function boozle<T extends Record<string, ModuleValue>, TKey extends ModuleKey<T>>(
  module: T,
  functionName: TKey,
  ...implementations: Array<MockImplementation<T, TKey>>
): Mock<MockImplementation<T, TKey>> {
  if (typeof module[functionName] !== 'function') {
    throw new Error(`${String(functionName)} is not a function in the provided module.`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const isAsync = (fn: Function): boolean => Object.prototype.toString.call(fn) === '[object AsyncFunction]';

  const originalFunction = module[functionName] as (...args: any[]) => any;
  const isAsyncFunction = isAsync(originalFunction);

  const spy = spyOn(module, functionName) as Mock<MockImplementation<T, TKey>>;

  if (implementations.length === 0) {
    spy.mockImplementation(() => (isAsyncFunction ? Promise.resolve(undefined) : undefined));
  } else if (implementations.length === 1) {
    spy.mockImplementation((...args: Parameters<T[TKey]>) => {
      const result = implementations[0](...args);
      return isAsyncFunction ? Promise.resolve(result) : result;
    });
  } else {
    implementations.forEach((impl) => {
      spy.mockImplementationOnce((...args: Parameters<T[TKey]>) => {
        const result = impl(...args);
        return isAsyncFunction ? Promise.resolve(result) : result;
      });
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
