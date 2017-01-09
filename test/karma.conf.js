module.exports = function(config) {
    config.set({
        autoWatch: false,
        files: [
            "./node_modules/jasmine-promises/dist/jasmine-promises.js",
            "./node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js",
            "./node_modules/phantomjs-polyfill-find/find-polyfill.js",
            "test/**/*.spec.js"
        ],
        basePath: "..",
        frameworks: [
            "browserify",
            "jasmine"
        ],
        browsers: ["PhantomJS"],
        preprocessors: {
            "test/**/*.spec.js": ["babel", "browserify"]
        },
        singleRun: true,

        browserify: {
            debug: true,
            transform: ["babelify"]
        }
    });
};
