module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true,
        browser: true,
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
    extends: [
        // 'airbnb-typescript/base',
        'plugin:node/recommended-module',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    plugins: ['import', '@typescript-eslint', 'prettier'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            },
        },
    },
    rules: {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                mjs: 'never',
                jsx: 'never',
                ts: 'always',
                tsx: 'never',
            },
        ],
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
        'import/prefer-default-export': 'off',
        //
        'no-underscore-dangle': 'off',
        'no-param-reassign': ['warn', { props: true }],
        radix: 0,
        // Node
        'node/exports-style': ['error', 'module.exports'],
        'node/file-extension-in-import': ['error', 'always'],
        'node/prefer-global/buffer': ['error', 'always'],
        'node/prefer-global/console': ['error', 'always'],
        'node/prefer-global/process': ['error', 'always'],
        'node/prefer-global/url-search-params': ['error', 'always'],
        'node/prefer-global/url': ['error', 'always'],
        'node/prefer-promises/dns': 'error',
        'node/prefer-promises/fs': 'error',
        //
        'class-methods-use-this': 'off',
    },
};
