"use strict";

module.exports = function (grunt) {

  // Load grunt tasks automatically, when needed
  require("jit-grunt")(grunt, {
    buildcontrol: "grunt-build-control"
  });

  grunt.initConfig({
    clean: {
      demo: ["build"]
    },
    copy: {
      demo: {
        files: {
          "build/index.html": ["demo/demo.html"]
        }
      }
    },

    browserify: {
      options: {
        alias: {
          "google-color-palette": "./src/palette.js"
        }
      },
      demo: {
        files: {
          "build/index.js": ["demo/demo.js"]
        },
        options: {
          watch: true
        }
      }
    },

    buildcontrol: {
      options: {
        dir: "build",
        commit: true,
        push: true,
        connectCommits: false,
        message: "Built live demo from commit %sourceCommit%"
      }
    },

    connect: {
      dev: {
        options: {
          base: "build",
          hostname: "localhost",
          port: 3000,
          livereload: true
        }
      }
    },

    watch: {
      dev: {
        files: "build/index.js",
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask("build", ["clean", "copy", "browserify"]);
  grunt.registerTask("serve", ["build", "connect", "watch"]);
  grunt.registerTask("default", ["serve"]);
};
