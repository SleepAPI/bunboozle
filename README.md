[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org/en/v1.0.0/)
[![Semantic Release](https://img.shields.io/badge/Semantic_Release-semver-blue)](https://semver.org/)

# Bunboozle - the simplified Bun mock

Mock the module and function, set the mocked implementation and spy on the result all in one quick call.

The mock will automatically revert to the original functionality afterEach test.

### Simple mock

```typescript
import * as mockModule from 'some-module.js';

it('should mock a single implementation', () => {
  const spy = boozle(mockModule, 'myFunction', (arg: string) => `Mocked with: ${arg}`);

  expect(mockModule.myFunction('Test1')).toBe('Mocked with: Test1');
  expect(spy).toHaveBeenCalledWith('Test1');
  expect(mockModule.myFunction('Test2')).toBe('Mocked with: Test2');
  expect(spy).toHaveBeenCalledWith('Test2');
});
```

### Mock with `mockImplementationOnce`

```typescript
import * as mockModule from 'some-module.js';

it('should mock multiple implementations in sequence', () => {
  const mock1 = (arg: string) => `First call: ${arg}`;
  const mock2 = (arg: string) => `Second call: ${arg}`;
  const mock3 = (arg: string) => `Third call: ${arg}`;

  boozle(mockModule, 'myFunction', mock1, mock2, mock3);

  expect(mockModule.myFunction('Test1')).toBe('First call: Test1');
  expect(mockModule.myFunction('Test2')).toBe('Second call: Test2');
  expect(mockModule.myFunction('Test3')).toBe('Third call: Test3');
  expect(mockModule.myFunction('Test4')).toBe('Original implementation: Test4');
});
```
