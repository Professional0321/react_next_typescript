module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        project: './tsconfig.json',
        createDefaultProgram: true,
    },
    env: {
        es6: true,
        node: true,
        jest: true,
    },
    extends: [
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
    },
};
