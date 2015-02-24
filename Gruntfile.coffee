"use strict"

module.exports = (grunt) ->

    
    require("load-grunt-tasks")(grunt); # Load grunt tasks automatically
    require("time-grunt")(grunt);       # Time grunt

    grunt.initConfig

        coffee:
            build:
                src: ["src/*.coffee"]
                dest: "abercrombie.js"
            specs:
                src: ["spec/*.spec.coffee"]
                dest: "spec/specs.js"
            helpers:
                src: ["spec/*.helper.coffee"]
                dest: "spec/helpers.js"

        connect:
            dev:
                options:
                    livereload: 8081
                    port: 8085
                    hostname: "*"

        watch:
            dev:
                options:
                    livereload: 8081
                files: ["src/**/*"]
                tasks: ["build"]
            test:
                files: ["**/*.coffee"]
                tasks: ["coffee", "jasmine:unit"]

        jasmine:
            unit:
                src: "abercrombie.js"
                options:
                    specs: "spec/specs.js"
                    helpers: "spec/helpers.js"

    grunt.registerTask "test", [
        "coffee"
        "jasmine:unit"
        "watch:test"
    ]

    grunt.registerTask "unit", [
        "coffee"
        "jasmine:unit"
    ]

    grunt.registerTask "build", [
        "coffee:build"
    ]

    grunt.registerTask "serve", [
        "coffee:build"
        "connect:dev"
        "watch:dev"
    ]