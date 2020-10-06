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
    plugins: [
        '@typescript-eslint',
        'prettier',
    ],
    rules: {
        'prettier/prettier': 'error',
    },
};
