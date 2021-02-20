module.exports = {
  env: {
    browser: true,
    jest: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    'plugin:react/recommended',
    'standard',
    'standard-react',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    requireConfigFile: false,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@babel'
  ],
  settings: {
    react: {
      version: 'latest',
    }
  },

  rules: {
    // don't force es6 functions to include space before paren
    'space-before-function-paren': ['error'],

    // allow specifying true explicitly for boolean props
    'react/jsx-boolean-value': ['error'],

    // allow double quotes
    'jsx-quotes': ['error', 'prefer-single'],

    // allow trailing commas
    'comma-dangle': 0,

    // we want to force semicolons
    // but for later ... for now so many errors
    semi: 0,
    '@babel/semi': 0,
    // we use 2 spaces to indent our code
    indent: ['error', 2, { SwitchCase: 1 }],
    // we want to avoid useless spaces
    'no-multi-spaces': ['error'],

    'react/display-name': 0,

    'node/no-callback-literal': 0,

    "no-use-before-define": 0,

    "jsx-quotes": 0,

    // Allow free standing if clauses
    "curly": 0
  }
};

/*
{
  "env": {
    "node": true,
    "jest": true
  },
  "extends": ["airbnb-base", "plugin:jest/recommended", "plugin:security/recommended", "plugin:prettier/recommended"],
  "plugins": ["jest", "security", "prettier"],
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "no-console": "error",
    "func-names": "off",
    "no-underscore-dangle": "off",
    "consistent-return": "off",
    "jest/expect-expect": "off",
    "security/detect-object-injection": "off"
  }
}
*/
