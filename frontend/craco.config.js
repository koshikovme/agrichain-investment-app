const webpack = require("webpack");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                assert: require.resolve("assert"),
                buffer: require.resolve("buffer"),
                util: require.resolve("util"),
                process: require.resolve("process/browser.js"), // Important!
            };
            webpackConfig.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ["buffer", "Buffer"],
                    process: "process/browser.js", // Important!
                })
            );
            return webpackConfig;
        },
    },
};
// This is a craco.config.js file for a React application that uses craco to customize the webpack configuration.