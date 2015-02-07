var gulp = require('gulp');
var shell = require('gulp-shell');
var concat = require('gulp-concat');
var cson = require('gulp-cson');
var watch = require('gulp-watch');

gulp.task('clean', shell.task(['rm -f .fontcustom-manifest.json', 'rm -rf ./build/']));

gulp.task('compile', ['clean'], shell.task('fontcustom compile'));

gulp.task('cson', ['clean'], function() {
  gulp.src('dev/*.cson')
    .pipe(cson())
    .pipe(gulp.dest('build/json'))

  watch('dev/*.cson')
    .pipe(cson())
    .pipe(gulp.dest('build/json'))
});

gulp.task('concat', ['compile'], function() {
  return gulp.src(['build/stylesheets/traffico.css', 'stylesheets/extend.css'])
    .pipe(concat('traffico.css'))
    .pipe(gulp.dest('build/stylesheets'))
});

gulp.task('generate-overview', shell.task(['mkdir build/gh-pages', 'node ./scripts/generate-overview.js']));

gulp.task('default', ['compile', 'concat', 'cson'], function() {
  gulp.start('generate-overview');
});
