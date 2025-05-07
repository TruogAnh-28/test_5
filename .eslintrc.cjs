/** @type {import("eslint").Linter.Config} */
const config = {
  globals: {
    Headers: "readonly",
    fetch: "readonly",
    localStorage: "readonly",
    Request: "readonly",
    RequestInfo: "readonly", // eslint-disable-line no-restricted-syntax
    RequestInit: "readonly",
    Response: "readonly",
    sessionStorage: "readonly",
    Storage: "readonly",
    URL: "readonly",

    // DOM
    window: "readonly",
    document: "readonly",
    HTMLButtonElement: "readonly",
    HTMLInputElement: "readonly",
    HTMLOptionElement: "readonly",
    HTMLSelectElement: "readonly",
    HTMLTextAreaElement: "readonly",
    RadioNodeList: "readonly", // eslint-disable-line no-restricted-syntax
  },

  parser: "@typescript-eslint/parser",

  parserOptions: {
    project: true,
    sourceType: "module",
  },

  settings: {
    react: {
      version: "detect",
    },
    tailwindcss: {
      callees: [
        "classnames",
        "clsx",
        "ctl",
      ],
      config: "tailwind.config.js",
      cssFiles: [
        "**/*.css",
        "!**/node_modules",
        "!**/.*",
        "!**/dist",
        "!**/build",
      ],
      cssFilesRefreshRate: 5_000,
      removeDuplicates: true,
      skipClassAttribute: false,
      whitelist: [],
      tags: [],
      classRegex: "^class(Name)?$",
    },
  },

  extends: [
    "next",
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:tailwindcss/recommended",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:@stylistic/recommended-extends",
    // "plugin:@tanstack/query/recommended",
  ],

  plugins: [
    "custom-rules",
    "@stylistic",
  ],

  overrides: [
    {
      files: [
        "*.ts",
        "*.tsx",
        "*.js",
      ],
      parser: "@typescript-eslint/parser",
    },
    {
      files: ["src/components/ui/**/*.{js,jsx,ts,tsx}"],
      rules: {
        "react/prop-types": "off",
        "react/jsx-no-constructed-context-values": "off",
        "no-use-before-define": "off",
      },
    },
  ],

  rules: {
    // Custom rules
    "custom-rules/encourage-object-params": [
      "warn",
      {
        minParams: 2,
      },
    ],

    // Next.js rules
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-img-element": "error",
    "@next/next/no-unwanted-polyfillio": "warn",
    "@next/next/no-page-custom-font": "warn",
    "@next/next/no-sync-scripts": "error",
    "@next/next/no-script-component-in-head": "error",
    "@next/next/no-duplicate-head": "error",
    "@next/next/inline-script-id": "error",
    "@next/next/no-typos": "error",
    "@next/next/no-css-tags": "error",
    "@next/next/no-head-element": "error",
    "@next/next/no-styled-jsx-in-document": "error",
    "@next/next/no-title-in-document-head": "error",
    "@next/next/google-font-display": "warn",
    "@next/next/google-font-preconnect": "warn",
    "@next/next/next-script-for-ga": "warn",
    "@next/next/no-before-interactive-script-outside-document": "warn",
    "@next/next/no-document-import-in-page": "error",

    // TypeScript rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "off",

    // React rules
    "react/prop-types": ["error"],
    "react/jsx-key": "error",
    "react/no-unused-state": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/no-array-index-key": "error",
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-pascal-case": "error",
    "react/no-direct-mutation-state": "error",
    "react/self-closing-comp": "error",
    "react/jsx-curly-brace-presence": "error",
    "react/no-deprecated": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/no-children-prop": "error",
    "react/function-component-definition": [
      "off",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "function-expression",
      },
    ],
    "react/jsx-handler-names": [
      "error",
      {
        eventHandlerPrefix: "handle",
        eventHandlerPropPrefix: "on",
      },
    ],
    "react/no-typos": "error",
    "react/forbid-prop-types": "error",
    "react/no-unused-prop-types": "error",
    "react/jsx-boolean-value": "error",
    "react/no-multi-comp": [
      "error",
      {
        ignoreStateless: true,
      },
    ],
    "react/no-unknown-property": "error",
    "react/no-string-refs": "error",
    "react/jsx-child-element-spacing": "error",
    "react/no-unstable-nested-components": "off",
    "react/boolean-prop-naming": [
      "error",
      {
        rule: "^(is|has|allow|.*ed)[A-Z]?([A-Za-z0-9]?)+",
      },
    ],
    "react/default-props-match-prop-types": "error",
    "react/no-danger-with-children": "error",
    "react/style-prop-object": "error",
    "react/jsx-no-constructed-context-values": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/destructuring-assignment": "off",
    "react/no-adjacent-inline-elements": "error",
    "react/button-has-type": "error",
    "react/forward-ref-uses-ref": "error",
    "react/hook-use-state": [
      "error",
      {
        allowDestructuredState: true,
      },
    ],
    "react/jsx-closing-bracket-location": [
      "error",
      {
        selfClosing: "tag-aligned",
      },
    ],
    "react/jsx-closing-tag-location": "error",
    "react/jsx-curly-spacing": [
      "error",
      {
        when: "never",
      },
    ],
    "react/jsx-curly-newline": [
      "error",
      {
        multiline: "require",
        singleline: "consistent",
      },
    ],
    "react/jsx-equals-spacing": [
      "error",
      "never",
    ],
    "react/jsx-first-prop-new-line": [
      "error",
      "multiline-multiprop",
    ],
    "react/jsx-max-props-per-line": [
      "error",
      {
        maximum: 1,
      },
    ],
    "react/jsx-fragments": [
      "error",
      "element",
    ],
    "react/jsx-indent-props": [
      "error",
      2,
    ],
    "react/jsx-indent": [
      "error",
      2,
    ],
    "react/jsx-newline": [
      "error",
      {
        prevent: false,
      },
    ],
    "react/jsx-no-leaked-render": "error",
    "react/jsx-no-literals": "off",
    "react/jsx-no-undef": "error",
    "react/jsx-one-expression-per-line": [
      "error",
      {
        allow: "non-jsx",
      },
    ],
    "react/jsx-props-no-multi-spaces": "error",
    "react/jsx-props-no-spread-multi": "error",
    "react/jsx-tag-spacing": [
      "error",
      {
        beforeSelfClosing: "always",
      },
    ],
    "react/jsx-wrap-multilines": "error",
    "react/no-access-state-in-setstate": "error",
    "react/no-this-in-sfc": "error",

    // General JavaScript rules
    "no-console": "error",
    "no-unused-vars": "off", // Using TypeScript's no-unused-vars instead
    "prefer-const": "warn",
    "no-var": "error",
    "eqeqeq": [
      "error",
      "always",
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: "CallExpression[callee.type=MemberExpression][callee.property.name=/^(every|filter|find|findIndex|findLast|findLastIndex|flatMap|forEach|group|groupToMap|map|reduce|reduceRight|some)$/] IfStatement",
        message: "Never use if in higher-order function",
      },
      {
        selector: "DoWhileStatement",
        message: "Never use do-while",
      },
      {
        selector: "ForInStatement",
        message: "Never use for-in",
      },
      {
        selector: "ForOfStatement",
        message: "Never use for-of",
      },
      {
        selector: "ForStatement",
        message: "Never use for",
      },
      {
        selector: `
          Identifier[name=/.+(Data|Info|(<?![gs]et)Item|List|Manager)$/]:not(
            :matches(
              // Built-in với suffix "Data"
              [name="FormData"],
              [name="DataView"],
              // Built-in với suffix "List"
              [name="NodeList"],
              [name="HTMLCollection"],
              // Built-in với suffix "Item"
              [name="TreeItem"],
              [name="ListItem"],
              [name="MenuItem"],
            )
          )
        `,
        message: "Not allowed to use 'Data', 'Info', 'Item', 'List', and 'Manager' as suffix of identifier, except for built-in JavaScript/TypeScript names.",
      },
      {
        selector: "IfStatement IfStatement",
        message: "Never use nested-if including else-if",
      },
      {
        selector: "SwitchStatement",
        message: "Never use switch",
      },
    ],
    "no-else-return": "error",
    "callback-return": "error",
    "no-lonely-if": "error",
    "no-unneeded-ternary": "error",
    "no-useless-return": "error",
    "no-useless-concat": "error",
    "no-useless-escape": "error",

    // Import rules
    "import/no-unresolved": "off",
    "import/newline-after-import": [
      "error",
      {
        count: 1,
      },
    ],
    "import/no-duplicates": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
          "unknown",
        ],
        "pathGroups": [
          // React & Next.js core
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "react-dom/**",
            group: "external",
            position: "before",
          },
          {
            pattern: "react/**",
            group: "external",
            position: "before",
          },
          {
            pattern: "next/**",
            group: "external",
            position: "before",
          },

          // Types (both shared and features)
          {
            pattern: "~/*/types/**",
            group: "internal",
            position: "before",
          },

          // Hooks
          {
            pattern: "~/hooks/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "~/*/hooks/**",
            group: "internal",
            position: "before",
          },

          // Utils
          {
            pattern: "~/utils/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "~/*/utils/**",
            group: "internal",
            position: "before",
          },

          // API
          {
            pattern: "~/*/api/**",
            group: "internal",
            position: "before",
          },

          // Stores
          {
            pattern: "~/*/stores/**",
            group: "internal",
            position: "before",
          },

          // Catch all internal imports
          {
            pattern: "~/**",
            group: "internal",
          },

          // Components (at the end)
          {
            pattern: "~/*/components/**",
            group: "internal",
            position: "after",
          },
        ],
        "pathGroupsExcludedImportTypes": [
          "react",
          "react-dom",
          "react/**",
          "next/**",
        ],
        "newlines-between": "always",
        "alphabetize": {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "../*",
              "./*",
              "./**/*",
              "../**/*",
            ],
            message: "Use absolute imports with the \"~\" alias instead of relative imports.",
          },
        ],
      },
    ],

    // Tailwind CSS rules
    "tailwindcss/classnames-order": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/no-contradicting-classname": "error",
    "tailwindcss/enforces-negative-arbitrary-values": "error",
    "tailwindcss/enforces-shorthand": "warn",
    "tailwindcss/migration-from-tailwind-2": "warn",
    "tailwindcss/no-arbitrary-value": "off",

    // Removed all @stylistic rules as they are likely covered by @stylistic/recommended-extends
    "@stylistic/multiline-ternary": "off",
    "@stylistic/max-statements-per-line": [
      "error",
      {
        max: 2,
      },
    ],
    "@stylistic/indent": [
      "error",
      2,
    ],
    "@stylistic/array-bracket-newline": [
      "error",
      {
        multiline: true,
        minItems: 2,
      },
    ],
    "@stylistic/array-element-newline": [
      "error",
      "always",
    ],
    "@stylistic/function-paren-newline": [
      "error",
      {
        minItems: 2,
      },
    ],
    "@stylistic/quotes": [
      "error",
      "double",
    ],
    "@stylistic/object-curly-newline": [
      "error",
      {
        ObjectExpression: "always",
        ObjectPattern: {
          minProperties: 2,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 1,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 1,
        },
      },
    ],
    "@stylistic/object-property-newline": [
      "error",
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],

  },
}

module.exports = config
