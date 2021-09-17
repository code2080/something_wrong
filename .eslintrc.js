module.exports = {
  env: {
    browser: true,
    jest: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'standard',
    'standard-react',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    requireConfigFile: false,
    sourceType: 'module',
  },
  plugins: ['react', '@babel', '@typescript-eslint'],
  settings: {
    react: {
      version: '17',
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // disable no undef as TS already checks this.
        'no-undef': 'off',
      },
    },
    // Disabled advanced ts linting for later
    //   {
    //     files: ['**/*.ts', '**/*.tsx'],
    //     extends: [
    //       'plugin:@typescript-eslint/recommended',
    //       'plugin:@typescript-eslint/recommended-requiring-type-checking',
    //     ],
    //     parserOptions: {
    //       tsconfigRootDir: __dirname,
    //       project: ['./tsconfig.json'],
    //     },
    //     rules: {
    //       '@typescript-eslint/no-extra-semi': 0,
    //     }
    //   }
  ],
  rules: {
    // allow specifying true explicitly for boolean props
    'react/jsx-boolean-value': ['error'],
    // we want to avoid useless spaces
    'no-multi-spaces': ['error'],
    'react/display-name': 0,
    'node/no-callback-literal': 0,
    // Allow free standing if clauses
    curly: 0,
    // Enforce consistend <></> Fragment syntax, unless keyed
    'react/jsx-fragments': ['error', 'syntax'],
    // Disable jsx uses react, not needed with react 17
    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'import/no-cycle': 'warn',
    'import/order': 0,

    /* [Typescript overrides] */
    // note you must disable the base rule as it can report incorrect errors,
    // using TS no unused vars instead
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
  },
};
