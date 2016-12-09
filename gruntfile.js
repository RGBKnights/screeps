module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            options: {
                target: 'es5',
                sourceMap: true,
                comments: true
            },
            default : {
                src: ["**/*.ts", "!node_modules/**/*.ts", "!typings/**/*.ts"],
                outDir: "dist"
			}
        },
        clean: ["bin/*"]
    });

    grunt.registerTask("build", ['clean', 'ts']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-ts");
};