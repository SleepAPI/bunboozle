// @ts-check

/**
 * @type {import('prettier').Config}
 */
export default {
  $schema: 'https://json.schemastore.org/prettierrc',
  useTabs: false,
  printWidth: 120,
  singleQuote: true,
  tabWidth: 2,
  endOfLine: 'lf',
  trailingComma: 'none',
  overrides: [
    {
      files: '*.json',
      excludeFiles: ['**/package-lock.json'],
      options: { parser: 'json' }
    }
  ]
};
