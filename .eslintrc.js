module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    'space-before-function-paren': 'off',
    'keyword-spacing': ['error', { 'after': false, 'overrides': {
      'return': { 'after': true },
      'else': { 'after': true },
      'do': { 'after': true },
      'from': { 'after': true },
      'import': { 'after': true },
      'export': { 'after': true },
      'try': { 'after': true },
      'const': { 'after': true },
      'var': { 'after': true },
      'case': { 'after': true },
      'let': { 'after': true }
    }}],
    'no-console': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'space-before-function-paren': ['error', {
      'named': 'never',
      'anonymous': 'never',
      'asyncArrow': 'always',
    }],
    'func-names': 0,
    'new-cap': 0,
    'max-len': ['error', 140],
    'comma-dangle': 0,
    'padded-blocks': 0,
    'no-nested-ternary': 'off',
    'object-curly-newline': ['error', { 'minProperties': 5, 'consistent': true }]
  },
  settings: {
    'import/resolver': {
      'babel-module': {}
    }
  }
};
