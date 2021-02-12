module.exports = {
  env: {
    browser: true,
  },
  parser: "@babel/eslint-parser",
  extends: [
    'plugin:react/recommended',
    'standard',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    requireConfigFile: false,
  },
  plugins: [
    'react',
    '@babel'
  ],
  settings: {
    react: {
      version: 'detect',
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
    semi: ['error', 'always'],
    // we use 2 spaces to indent our code
    indent: ['error', 2],
    // we want to avoid useless spaces
    'no-multi-spaces': ['error'],

    "react/display-name": 0,

    "@babel/semi": ['error'],

    "node/no-callback-literal": 0,

    // // Allow free standing if clauses
    // "curly": 0
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
