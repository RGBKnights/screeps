module.exports = function (grunt) {
    var screepsDirectory = process.env.LOCALAPPDATA + '\\Screeps\\scripts\\99_224_226_247___21025\\default\\';
    console.log(screepsDirectory);

    grunt.initConfig({
        clean: {
            preBuild: ['dist'],
            postBuild: ['src\\.baseDir.ts', 'dist\\.baseDir.js']
        },
        ts: {
            default : {
                src: ["src\\**\\*.ts"],
                outDir: 'dist\\',
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

    grunt.registerTask("build", ['clean:preBuild', 'ts:default', 'clean:postBuild', 'copy:default']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-ts");
};