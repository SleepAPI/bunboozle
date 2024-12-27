/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock, spyOn } from 'bun:test';
import { ExtractFunction, MockImplementation, ModuleKey, ModuleValue } from './types/types.js';

const activeSpies = new Set<Mock<(...args: any[]) => any>>();

/**
 * Main boozle function to mock functions or variables.
 */
export function boozle<T extends Record<string, ModuleValue>, TKey extends ModuleKey<T>>(
  module: T,
  property: TKey,
  ...implementations: Array<MockImplementation<T, TKey>>
): Mock<MockImplementation<T, TKey>> {
  if (!(property in module)) {
    throw new Error(`${String(property)} is not a property of the provided module.`);
  }

  const originalValue = module[property];
  const isFunction = typeof originalValue === 'function';

  if (isFunction) {
    return mockFunction(module, property, originalValue, implementations);
  } else {
    return mockVariable(module, property, originalValue, implementations);
  }
}

/**
 * Handles mocking for functions.
 */
function mockFunction<T extends Record<string, ModuleValue>, TKey extends ModuleKey<T>>(
  module: T,
  property: TKey,
  originalValue: ExtractFunction<T, TKey>,
  implementations: Array<MockImplementation<T, TKey>>
): Mock<MockImplementation<T, TKey>> {
  const isAsyncFunction = (fn: ExtractFunction<T, TKey>): boolean =>
    Object.prototype.toString.call(fn) === '[object AsyncFunction]';

  const isAsync = isAsyncFunction(originalValue);
  const spy = spyOn(module, property) as Mock<MockImplementation<T, TKey>>;

  if (implementations.length === 0) {
    spy.mockImplementation(() => (isAsync ? Promise.resolve(undefined) : undefined) as T[TKey]);
  } else if (implementations.length === 1) {
    spy.mockImplementation((...args: Parameters<T[TKey]>) => {
      const impl = implementations[0];
      const result = typeof impl === 'function' ? impl(...args) : impl;
      return isAsync ? Promise.resolve(result) : result;
    });
  } else {
    implementations.forEach((impl) => {
      if (typeof impl === 'function') {
        spy.mockImplementationOnce(impl as (...args: any[]) => any);
      } else {
        spy.mockImplementationOnce(() => (isAsync ? Promise.resolve(impl) : impl) as T[TKey]);
      }
    });
  }

  activeSpies.add(spy);
  return spy;
}

/**
 * Handles mocking for variables.
 */
function mockVariable<T extends Record<string, ModuleValue>, TKey extends ModuleKey<T>>(
  module: T,
  property: TKey,
  originalValue: T[TKey],
  implementations: Array<MockImplementation<T, TKey>>
): Mock<MockImplementation<T, TKey>> {
  const setMockValue = (newValue: T[TKey]) => {
    Object.defineProperty(module, property, {
      configurable: true,
      enumerable: true,
      value: newValue,
      writable: true
    });
  };

  const spy: Mock<MockImplementation<T, TKey>> = {
    mockRestore: () => {
      setMockValue(originalValue);
    },
    mockImplementation: (impl: MockImplementation<T, TKey>) => {
      setMockValue(impl as T[TKey]);
    },
    mockImplementationOnce: (impl: MockImplementation<T, TKey>) => {
      setMockValue(impl as T[TKey]);
    }
  } as unknown as Mock<MockImplementation<T, TKey>>;

  if (implementations.length === 0) {
    setMockValue(undefined as T[TKey]);
  } else if (implementations.length === 1) {
    spy.mockImplementation(implementations[0]);
  } else {
    // not working as intended, only works for functions
    implementations.forEach((impl) => {
      spy.mockImplementationOnce(impl);
    });
  }

  activeSpies.add(spy);
  return spy;
}

export function unboozle() {
  for (const spy of activeSpies) {
    spy.mockRestore();
  }
  activeSpies.clear();
}
