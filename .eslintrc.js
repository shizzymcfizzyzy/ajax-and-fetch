module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "airbnb-base",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    indent: ["error", 2],
    semi: ["warn", "never"],
    "no-console": "off",
    camelcase: "off",
    "no-unused-vars": "warn",
    "max-classes-per-file": ["error", 5],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
        maxConsecutive: 0,
      },
    ],
    "object-curly-spacing": ["error", "never"],
    "eol-last": ["error", "always"],
  },
};
