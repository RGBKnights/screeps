module.exports = function (grunt) {
    var screepsDirectory = process.env.LOCALAPPDATA + '\\Screeps\\scripts\\127_0_0_1___21025\\default';

    grunt.initConfig({
        clean: {
            options: {
                force: true
            },
            preBuild: ['dist'],
            postBuild: ['app\\.baseDir.ts', 'dist\\.baseDir.js', screepsDirectory + '\\**']
        },
        ts: {
            default : {
                src: ["app\\**\\*.ts"],
                outDir: 'dist\\',
                options: {
                    target: 'es5',
                    sourceMap: false,
                }
			}
        },
        copy: {
            default: {
                force: true,
                expand: true,
                cwd: 'dist',
                src: '**',
                dest: screepsDirectory,
            }
        }
    });

    grunt.registerTask("build", ['clean:preBuild', 'ts:default', 'clean:postBuild', 'copy:default']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-ts");
};