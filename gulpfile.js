var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('scripts', function() {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src("lib/**/*.ts").pipe(tsProject());
    var destation = gulp.dest('release');

    return tsResult.js.pipe(destation);
});
