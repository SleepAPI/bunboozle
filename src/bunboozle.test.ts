import { afterAll, describe, expect, it } from 'bun:test';
import { boozle } from './bunboozle.js';

class MockModuleImpl {
  publicVariable: number = 0;

  public function1(arg: string): string {
    return `[1] Original implementation: ${arg}`;
  }
  public function2(arg: string): string {
    return `[2] Original implementation: ${arg}`;
  }
  public async asyncFunction(arg: string): Promise<string> {
    return `[async] Original implementation: ${arg}`;
  }
}
const MockModule = new MockModuleImpl();

describe('bunboozle', () => {
  describe('functions', () => {
    afterAll(() => {
      expect(MockModule.function1('Test1')).toBe('[1] Original implementation: Test1');
      expect(MockModule.function2('Test1')).toBe('[2] Original implementation: Test1');
    });

    it('should mock a single implementation', () => {
      const spy = boozle(MockModule, 'function1', (arg: string) => `Mocked with: ${arg}`);

      expect(MockModule.function1('Test1')).toBe('Mocked with: Test1');
      expect(spy).toHaveBeenCalledWith('Test1');
      expect(MockModule.function1('Test2')).toBe('Mocked with: Test2');
      expect(spy).toHaveBeenCalledWith('Test2');
    });

    it('should mock multiple implementations in sequence', () => {
      const mock1 = (arg: string) => `First call: ${arg}`;
      const mock2 = (arg: string) => `Second call: ${arg}`;
      const mock3 = (arg: string) => `Third call: ${arg}`;

      boozle(MockModule, 'function1', mock1, mock2, mock3);

      expect(MockModule.function1('Test1')).toBe('First call: Test1');
      expect(MockModule.function1('Test2')).toBe('Second call: Test2');
      expect(MockModule.function1('Test3')).toBe('Third call: Test3');
      expect(MockModule.function1('Test4')).toBe('[1] Original implementation: Test4');
    });

    it('should default implementation to undefined', () => {
      const spy = boozle(MockModule, 'function1');

      expect(MockModule.function1('Test1')).toBeUndefined();
      expect(spy).toHaveBeenCalledWith('Test1');
      expect(MockModule.function1('Test2')).toBeUndefined();
      expect(spy).toHaveBeenCalledWith('Test2');
    });

    it('should throw an error if the specified property does not exist on module', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => boozle(MockModule, 'notAFunction' as any, () => {})).toThrowError(
        'notAFunction is not a property of the provided module.'
      );
    });

    it('should infer Promise result if function is async', async () => {
      const spy = boozle(MockModule, 'asyncFunction', (arg: string) => `Mock async call: ${arg}`);

      expect(await MockModule.asyncFunction('Test1')).toBe('Mock async call: Test1');
      expect(spy).toHaveBeenCalledWith('Test1');
    });

    it('should support Promise if user provides Promise themselves', async () => {
      const spy = boozle(MockModule, 'asyncFunction', (arg: string) => Promise.resolve(`Mock async call: ${arg}`));

      expect(await MockModule.asyncFunction('Test1')).toBe('Mock async call: Test1');
      expect(spy).toHaveBeenCalledWith('Test1');
    });
  });

  describe('variables', () => {
    it('should mock a variable', () => {
      boozle(MockModule, 'publicVariable', 1);

      expect(MockModule.publicVariable).toBe(1);
    });

    it('should set variable to undefined if no implementation is provided', () => {
      boozle(MockModule, 'publicVariable');

      expect(MockModule.publicVariable).toBeUndefined();
    });
  });
});
