module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            default : {
                src: ["app/**/*.ts"],
                outDir: 'dist/',
                options: {
                    target: 'es5',
                    sourceMap: false,
                }
			}
        },
        clean: {
            preBuild: {
                src: ["dist/*"]
            },
            postBuild: {
                src: ['app/.baseDir.ts', 'dist/.baseDir.js']
            }
        }
    });

    grunt.registerTask("build", ['clean:preBuild', 'ts:default', 'clean:postBuild']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-ts");
};