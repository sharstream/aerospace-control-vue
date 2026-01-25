module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'airbnb-base',
        'plugin:vue/vue3-recommended'
    ],
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module'
    },
    plugins: ['@babel'],
    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            MemberExpression: 1,
            FunctionDeclaration: { parameters: 1, body: 1 },
            FunctionExpression: { parameters: 1, body: 1 },
            CallExpression: { arguments: 1 },
            ArrayExpression: 1,
            ObjectExpression: 1,
            ImportDeclaration: 1,
            flatTernaryExpressions: false,
            ignoreComments: false,
            ignoredNodes: ['TemplateLiteral *', 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
            offsetTernaryExpressions: false
        }],
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
            },
            {
                selector: 'LabeledStatement',
                message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
            },
            {
                selector: 'WithStatement',
                message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
            }
        ],
        'import/prefer-default-export': [0],
        'no-async-promise-executor': [0],
        'prefer-rest-params': [0],
        'vue/html-indent': ['error', 2],
        'vue/script-indent': ['error', 4, {
            baseIndent: 0,
            switchCase: 1,
            ignores: []
        }],
        'vue/html-self-closing': ['error', {
            html: {
                void: 'always',
                normal: 'never',
                component: 'always'
            }
        }],
        'no-underscore-dangle': [2, { allow: ['_uid'] }],
        'vue/no-mutating-props': [0],
        'arrow-parens': [2, 'as-needed', { requireForBlockBody: true }],
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'always'
        }],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/prop-name-casing': 'off',
        'vue/attribute-hyphenation': [2, 'never'],
        'comma-dangle': [2, 'never'],
        'no-param-reassign': [0],
        'max-len': [0],
        'import/no-extraneous-dependencies': [0],
        'import/extensions': [0],
        'import/no-unresolved': [0],
        'import/first': [0],
        'linebreak-style': [0],
        'no-plusplus': [0],
        'no-debugger': [0],
        'no-console': [0],
        'no-cond-assign': [2, 'except-parens'],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'vue/multi-word-component-names': [0],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'prefer-destructuring': [0],
        'consistent-return': [0],
        'no-shadow': [0],
        'no-use-before-define': [0],
        'object-shorthand': [1],
        'no-nested-ternary': [1],
        'no-mixed-operators': [0],
        radix: [1],
        'object-curly-newline': ['error', {
            ObjectExpression: { consistent: true },
            ObjectPattern: { consistent: true },
            ImportDeclaration: { consistent: true },
            ExportDeclaration: { consistent: true }
        }]
    }
};
