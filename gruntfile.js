module.exports = function (grunt) {
    var screepsDirectory = 'C:/Users/Jamie Webster/AppData/Local/Screeps/scripts/127_0_0_1___21025/default';

    grunt.initConfig({
        remove: {
            preBuild: {
                dirList: ['dist/*']
            },
            postBuild: {
                fileList: ['app/.baseDir.ts', 'dist/.baseDir.js'],
                dirList: [screepsDirectory]
            }
        },
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
        copy: {
            default: {
                expand: true,
                cwd: 'dist',
                src: '**',
                dest: screepsDirectory,
            }
        }
    });

    grunt.registerTask("build", ['remove:preBuild', 'ts:default', 'remove:postBuild', 'copy:default']);

    grunt.loadNpmTasks('grunt-remove');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-ts");
};