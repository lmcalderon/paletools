const path = require("path");
var WebpackObfuscator = require("webpack-obfuscator");


module.exports = (env) => {
    process.env = {
        ...(process.env || {}),
        COMPARE_MIN_MAX_PRICES: true,
        DUPLICATED_TO_SBC: true,
        GRID_MODE: true,
        IMPROVED_PLAYER_SEARCH: true,
        MARK_DUPLICATED: true,
        MARKET_SEARCH_FILTERS: true,
        PLAYER_ACTIONS: true,
        SETTINGS_MENU: true,
        SNIPE_MOBILE: true,
        SELECT_CHEAPEST: true,
        TRANSFER_TARGETS_LIMBO: true,
        UNASSIGNED_LIMBO: true,
        FILTER_SBCS: true,
        SBC_TIMES_COMPLETED: true,
        COUNT_MY_PACKS: true,
        GROUP_MY_PACKS: true,
        TRANSFER_LIST_SEND_ALL_TO_CLUB: true,
        SBC_BUILDER_ENHACER: true,
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