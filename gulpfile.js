var gulp = require('gulp');
var shell = require('gulp-shell');
var concat = require('gulp-concat');

gulp.task('clean', shell.task(['rm -f .fontcustom-manifest.json', 'rm -rf ./build/']) );

gulp.task('compile', shell.task('fontcustom compile'));

gulp.task('concat', ['compile'], function () {
  return gulp.src(['build/stylesheets/traffico.css', 'stylesheets/extend.css'])
    .pipe(concat('traffico.css'))
    .pipe(gulp.dest('build/stylesheets'))
});

gulp.task('default', ['compile', 'concat']);
