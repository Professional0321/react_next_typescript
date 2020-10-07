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
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
    ],
    plugins: ['react', '@typescript-eslint', 'prettier'],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
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
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': ['error'],
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': ['error'],
        'no-extra-semi': 'off',
        '@typescript-eslint/no-extra-semi': ['error'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn'],
        'require-await': 'off',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/no-shadow': ['warn'],
        '@typescript-eslint/naming-convention': ['warn'],
        //
        //
        // ESLint Plugin React
        // https://github.com/yannickcr/eslint-plugin-react
        //
        'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
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
        'react/display-name': 'off',
        //
        'react/jsx-filename-extension': 'off',
        'react/no-access-state-in-setstate': 'warn',
        'react/jsx-one-expression-per-line': 'off',
        'react/destructuring-assignment': 'warn',
        'react/no-unescaped-entities': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/prefer-default-export': 'off',

        //
        // ESLint Plugin React Hooks
        // https://github.com/facebook/react
        //
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        //
        'jsx-a11y/anchor-is-valid': 'off',
        'no-underscore-dangle': 'off',
        'no-param-reassign': ['warn', { props: true }],
        radix: 0,
    },
};
