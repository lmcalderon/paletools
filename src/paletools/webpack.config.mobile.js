const plugins = require("./webpack.base");
const path = require("path");
var WebpackObfuscator = require("webpack-obfuscator");

module.exports = (env) => {
    process.env = {
        ...(process.env || {}),
        ...plugins,
        SELECT_CHEAPEST: false,
        DONATION: false,
        FILL_SBC_FROM_FUTBIN: false,
        WIDE_MODE: false,
        SNIPE: false,
        CLUB_ANALYZER: false,
        SBC_BUILDER_ENHACER: false,
        SELL_MULTIPLE: false,
    
        SBC_SMART_BUILDER: false,
        CLUB_SEARCH_ENHACER: false,
        EA_BUG_FIXER: false,
        ...env
    };

    return [
        {
            mode: "development",
            entry: "./src/index.js",
            output: {
                path: path.resolve(__dirname, "dist"),
                filename: "paletools-mobile.js"
            },
            module: {
                rules: [
                    {
                        test: /\.css$/i,
                        use: ["raw-loader"]
                    },
                    {
                        test: /\.js$/i,
                        exclude: [/node_modules/],
                        use: [path.resolve("webpack/loaders/conditional.js")]
                    }
                ]
            }
        },
        {
            mode: "production",
            entry: "./src/index.js",
            output: {
                path: path.resolve(__dirname, "dist"),
                filename: "paletools-mobile.prod.js"
            },
            plugins: [
                new WebpackObfuscator({ rotateStringArray: true, reservedStrings: ["\s*"] }, [])
            ],
            module: {
                rules: [
                    {
                        test: /\.css$/i,
                        use: ["raw-loader"]
                    },
                    {
                        test: /\.js$/i,
                        exclude: [/node_modules/],
                        use: [path.resolve("webpack/loaders/conditional.js")]
                    }
                ]
            }
        }
    ];
};