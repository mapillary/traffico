var gulp = require('gulp');
var shell = require('gulp-shell');
var concat = require('gulp-concat');
var cson = require('gulp-cson');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

gulp.task('clean', shell.task(['rm -f .fontcustom-manifest.json', 'rm -rf ./build/']));

gulp.task('compile-font', ['clean'], shell.task('fontcustom compile'));

gulp.task('cson-signs', ['clean'], function() {
  return gulp.src('dev/*.cson')
    .pipe(cson())
    .pipe(gulp.dest('build/json'));
});

gulp.task('cson-transformations', ['clean'], function() {
  return gulp.src('stylesheets/transformations.cson')
    .pipe(cson())
    .pipe(gulp.dest('build'))
});

gulp.task('concat-traffico-css', ['compile-font'], function() {
  return gulp.src(['build/stylesheets/traffico.css', 'stylesheets/extend.css'])
    .pipe(concat('traffico.css'))
    .pipe(gulp.dest('build/stylesheets'))
});

gulp.task('gen-overview-css', ['clean'], function() {
  return gulp.src('stylesheets/examples.scss').pipe(sass()).pipe(gulp.dest('build/stylesheets'));
});

gulp.task('gen-overview-scss', ['clean'], function() {
  return gulp.src('stylesheets/examples.scss').pipe(gulp.dest('build/gh-pages'));
});

gulp.task('gen-overview', ['cson-signs', 'cson-transformations'], function () {
  return gulp.src('scripts/generate-overview.js').pipe(shell(['mkdir -p build/gh-pages && node <%= file.path %>']));
});

gulp.task('gen-html-strings', ['cson-signs', 'cson-transformations'], function () {
  return gulp.src('scripts/generate-html-strings.js').pipe(shell(['node <%= file.path %>']));
});

gulp.task('default', ['concat-traffico-css', 'gen-overview', 'gen-html-strings', 'gen-overview-scss', 'gen-overview-css']);
