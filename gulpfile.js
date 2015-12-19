var gulp = require('gulp')
var shell = require('gulp-shell')
var concat = require('gulp-concat')
var cson = require('gulp-cson')
var sass = require('gulp-sass')

gulp.task('clean', shell.task(['rm -f .fontcustom-manifest.json', 'rm -rf ./build/']))

gulp.task('compile-font', shell.task('fontcustom compile'))

gulp.task('pngs', function () {
  return gulp.src('./scripts/scrape-pngs.js')
    .pipe(shell(['phantomjs  <%= file.path %>']))
    .pipe(gulp.dest('build'))
})

gulp.task('cson-mapillary-mappings', function () {
  return gulp.src('mapillary-mappings/*.cson')
    .pipe(cson())
    .pipe(gulp.dest('build/mapillary-mappings'))
})

gulp.task('cson-signs', function () {
  return gulp.src('dev/*.cson')
    .pipe(cson())
    .pipe(gulp.dest('build/signs'))
})

gulp.task('cson-transformations', function () {
  return gulp.src('stylesheets/transformations.cson')
    .pipe(cson())
    .pipe(gulp.dest('build'))
})

gulp.task('concat-traffico-css', ['compile-font'], function () {
  return gulp.src(['build/stylesheets/traffico.css', 'stylesheets/extend.css'])
    .pipe(concat('traffico.css'))
    .pipe(gulp.dest('build/stylesheets'))
})

gulp.task('gen-overview-css', function () {
  return gulp.src('stylesheets/examples.scss').pipe(gulp.dest('build/gh-pages')).pipe(sass()).pipe(gulp.dest('build/stylesheets'))
})

gulp.task('gen-overview', ['cson-signs', 'cson-transformations'], function () {
  return gulp.src('scripts/generate-overview.js').pipe(shell(['mkdir -p build/gh-pages && node <%= file.path %>']))
})

gulp.task('gen-html-map', ['resolve-transformations'], function () {
  return gulp.src('scripts/generate-html-string-dict.js').pipe(shell(['mkdir -p build/string-maps && node <%= file.path %>']))
})

gulp.task('resolve-transformations', ['cson-signs', 'cson-transformations'], function () {
  return gulp.src('scripts/resolve-transformations.js').pipe(shell(['mkdir -p build/signs-simple && node <%= file.path %>']))
})

gulp.task('generate_gh-pages_config', function () {
  return gulp.src('scripts/generate_gh-pages_config.js').pipe(shell(['mkdir -p build/gh-pages && node <%= file.path %>']))
})

gulp.task('patch-names', ['gen-overview'], function () {
  return gulp.src('scripts/patch-names.js').pipe(shell(['node <%= file.path %>']))
})

gulp.task(
  'build',
  [
    'concat-traffico-css',
    'cson-mapillary-mappings',
    'gen-overview',
    'gen-overview-css',
    'generate_gh-pages_config',
    'gen-html-map'
  ]
)

gulp.task('lint', shell.task('node node_modules/standard/bin/cmd.js gulpfile.js scripts/*.js'))

gulp.task('check-for-duplicate-signs', ['build'], function () {
  return gulp.src('scripts/check-for-duplicate-signs.js').pipe(shell(['node <%= file.path %>']))
})

gulp.task(
  'check',
  [
    'check-for-duplicate-signs',
    'lint'
  ]
)

gulp.task(
  'default',
  ['check']
)
