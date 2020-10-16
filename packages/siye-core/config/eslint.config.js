/**
 * eslint 配置
 * TODO: 参考 elemefe 将规则抽离，通过 extends 扩展规则
 */

module.exports = {
  // 引入处自行设置 root 配置
  // root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    // 为兼容 workspace，关闭此校验
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'func-names': ['error', 'never'],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'consistent-return': 'off',
    'import/extensions': ['error', 'always', { js: 'never', vue: 'never' }],
    // START stylistic
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off', // 单行过长需要换行
    'object-curly-newline': [
      'error',
      {
        consistent: true,
      },
    ], // 提高 git diff 可读性
    'array-bracket-newline': ['error', 'consistent'],
    'max-len': 'off',
    'prefer-destructuring': [
      'error',
      {
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
    ],
    'linebreak-style': 'off',
    // END stylistic
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
