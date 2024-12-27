[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org/en/v1.0.0/)
[![Semantic Release](https://img.shields.io/badge/Semantic_Release-semver-blue)](https://semver.org/)

# Bunboozle - the simplified Bun mock

Mock the module and function, set the mocked implementation and spy on the result all in one quick call.

The mock will automatically revert to the original functionality afterEach test.

## Features

- Mock functions and variables in any module (files, classes, objects)
- Automatically attach a spy that is returned
- Automatically restore the original implementation afterEach
- Full Typescript support, get type hints for any module property

### Simple function mock

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

### Simple variable mock

```typescript
import * as mockModule from 'some-module.js';

it('should mock a variable', () => {
  boozle(mockModule, 'myVariable', 42);

  expect(mockModule.myVariable).toBe(42);
});
```

### Skip the explicit function call if not interested in parameters

```typescript
import * as mockModule from 'some-module.js';

it('should mock a function', () => {
  boozle(mockModule, 'myFunction', 'Mocked string');

  expect(mockModule.myFunction).toBe('Mocked string');
});
```

### Mock functions with `mockImplementationOnce`

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

## Roadmap

- [x] Mock functions with mockImplementation.
- [x] Mock functions with mockImplementationOnce for sequential mocking.
- [x] Automatically restore original implementation after each test.
- [x] Mock variables with a single value.
- [ ] Mock variables with mockImplementationOnce for sequential values.
- [x] Built-in support for spying on function calls without mocking.
