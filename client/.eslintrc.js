module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true,
    },
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        project: './tsconfig.json',
        createDefaultProgram: true,
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
        modules: true,
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react,
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        'prettier/prettier': 'error',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-empty-interface': [
            'warn',
            {
                allowSingleExtends: true,
            },
        ],
        // '@typescript-eslint/no-unnecessary-condition': [
        //     'warn',
        //     {
        //         ignoreRhs: true,
        //     },
        // ],
        '@typescript-eslint/no-unnecessary-qualifier': 'warn',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
        '@typescript-eslint/prefer-optional-chain': 'warn',
        '@typescript-eslint/return-await': 'warn',
        // '@typescript-eslint/strict-boolean-expressions': [
        //     'warn',
        //     {
        //         allowNullable: true,
        //         allowSafe: true,
        //         ignoreRhs: true,
        //     },
        // ],
        '@typescript-eslint/switch-exhaustiveness-check': 'warn',
        '@typescript-eslint/no-inferrable-types': [
            'warn',
            {
                ignoreParameters: true,
                ignoreProperties: true,
            },
        ],
        '@typescript-eslint/explicit-function-return-type': [
            'warn',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true,
            },
        ],
        'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
        //
        // ESLint Plugin React
        // https://github.com/yannickcr/eslint-plugin-react
        //
        'react/void-dom-elements-no-children': 'error',
        'react/require-render-return': 'error',
        'react/react-in-jsx-scope': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-no-undef': 'error',
        'react/no-typos': 'error',
        'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
        'react/jsx-no-comment-textnodes': 'warn',
        'react/no-direct-mutation-state': 'warn',
        'react/no-danger-with-children': 'warn',
        'react/jsx-no-duplicate-props': 'warn',
        'react/jsx-no-target-blank': 'warn',
        'react/style-prop-object': 'warn',
        'react/self-closing-comp': 'warn',
        'react/jsx-pascal-case': 'warn',
        'react/jsx-uses-vars': 'warn',
        'react/no-is-mounted': 'warn',
        'react/jsx-key': ['warn', { checkFragmentShorthand: true }],

        //
        // ESLint Plugin React Hooks
        // https://github.com/facebook/react
        //
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
};
