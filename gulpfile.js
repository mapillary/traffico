var gulp = require('gulp');
var shell = require('gulp-shell');
var concat = require('gulp-concat');
var cson = require('gulp-cson');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

gulp.task('clean', shell.task(['rm -f .fontcustom-manifest.json', 'rm -rf ./build/']));

gulp.task('compile-font', ['clean'], shell.task('fontcustom compile'));

gulp.task('cson-signs', function() {
  return gulp.src('dev/*.cson')
    .pipe(cson())
    .pipe(gulp.dest('build/json'));
});

gulp.task('cson-transformations', function() {
  return gulp.src('stylesheets/transformations.cson')
    .pipe(cson())
    .pipe(gulp.dest('build'))
});

gulp.task('concat-traffico-css', ['compile-font'], function() {
  return gulp.src(['build/stylesheets/traffico.css', 'stylesheets/extend.css'])
    .pipe(concat('traffico.css'))
    .pipe(gulp.dest('build/stylesheets'))
});

gulp.task('gen-overview-css', function() {
  return gulp.src('stylesheets/examples.scss').pipe(sass()).pipe(gulp.dest('build/stylesheets'));
});

gulp.task('gen-overview-scss', function() {
  return gulp.src('stylesheets/examples.scss').pipe(gulp.dest('build/gh-pages'));
});

gulp.task('gen-overview', ['cson-signs', 'cson-transformations'], function () {
  return gulp.src('scripts/generate-overview.js').pipe(shell(['node <%= file.path %>']));
});

gulp.task('default', ['concat-traffico-css', 'gen-overview', 'gen-overview-scss', 'gen-overview-css']);
