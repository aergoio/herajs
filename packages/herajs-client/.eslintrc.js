module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-console": [
            "warn"
        ],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "brace-style": [
            "error",
            "1tbs"
        ],
        "prefer-arrow-callback": "warn",
        "prefer-const": "warn",
        "no-var": "error",
        "no-unused-vars": "warn"
    }
};