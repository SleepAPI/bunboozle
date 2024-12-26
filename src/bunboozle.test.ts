import { afterAll, describe, expect, it } from 'bun:test';
import { boozle } from './bunboozle.js';

const mockModule = {
  function1: (arg: string) => `[1] Original implementation: ${arg}`,
  function2: (arg: string) => `[2] Original implementation: ${arg}`
};

describe('bunboozle', () => {
  afterAll(() => {
    expect(mockModule.function1('Test1')).toBe('[1] Original implementation: Test1');
    expect(mockModule.function2('Test1')).toBe('[2] Original implementation: Test1');
  });

  it('should mock a single implementation', () => {
    const spy = boozle(mockModule, 'function1', (arg: string) => `Mocked with: ${arg}`);

    expect(mockModule.function1('Test1')).toBe('Mocked with: Test1');
    expect(spy).toHaveBeenCalledWith('Test1');
    expect(mockModule.function1('Test2')).toBe('Mocked with: Test2');
    expect(spy).toHaveBeenCalledWith('Test2');
  });

  it('should mock a single implementation', () => {
    const spy = boozle(mockModule, 'function1', (arg: string) => `Mocked with: ${arg}`);

    expect(mockModule.function1('Test1')).toBe('Mocked with: Test1');
    expect(spy).toHaveBeenCalledWith('Test1');
    expect(mockModule.function1('Test2')).toBe('Mocked with: Test2');
    expect(spy).toHaveBeenCalledWith('Test2');
  });

  it('should mock multiple implementations in sequence', () => {
    const mock1 = (arg: string) => `First call: ${arg}`;
    const mock2 = (arg: string) => `Second call: ${arg}`;
    const mock3 = (arg: string) => `Third call: ${arg}`;

    boozle(mockModule, 'function1', mock1, mock2, mock3);

    expect(mockModule.function1('Test1')).toBe('First call: Test1');
    expect(mockModule.function1('Test2')).toBe('Second call: Test2');
    expect(mockModule.function1('Test3')).toBe('Third call: Test3');
    expect(mockModule.function1('Test4')).toBe('[1] Original implementation: Test4');
  });

  it('should throw an error if the specified property is not a function', () => {
    const mockModuleWithNonFunction = { notAFunction: 'This is not a function' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => boozle(mockModuleWithNonFunction, 'notAFunction' as any, () => {})).toThrowError(
      'notAFunction is not a function in the provided module.'
    );
  });
});
