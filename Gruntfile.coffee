'use strict'

module.exports = (grunt) ->

    
    require('load-grunt-tasks')(grunt); # Load grunt tasks automatically
    require('time-grunt')(grunt); # Time grunt

    grunt.initConfig

        coffee:
            build:
                src: ['src/*.coffee']
                dest: 'abercrombie.js'

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

    grunt.registerTask "test", [
        "karma:unit"
    ]

    grunt.registerTask "build", [
        "coffee:build"
    ]

    grunt.registerTask "serve", [
        "coffee:build"
        "connect:dev"
        "watch:dev"
    ]