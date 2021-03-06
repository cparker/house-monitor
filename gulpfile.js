var gulp = require('gulp'),
  rename = require('gulp-rename'),
  webserver = require('gulp-webserver'),
  debug = require('gulp-debug'),
  sass = require('gulp-sass'),
  typescript = require('gulp-typescript'),
  tsConfig = require('./tsconfig.json');

// run init tasks
gulp.task('default', ['dependencies', 'js', 'html', 'images', 'sass']);

// run development task
gulp.task('dev', ['default', 'watch', 'serve']);

// serve the build dir
gulp.task('serve', function () {
  gulp.src('build')
    .pipe(webserver({
      host: '0.0.0.0',
      open: true,
      livereload: true
    }));
});

// watch for changes and run the relevant task
gulp.task('watch', function () {
  gulp.watch('src/**/*.ts', ['js']);
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.scss', ['sass']);
});

// move dependencies into build dir
gulp.task('dependencies', function () {
  return gulp.src([
    'node_modules/systemjs/dist/system-csp-production.src.js',
    'node_modules/es6-shim/es6-shim.min.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/angular2/bundles/angular2.js',
    'node_modules/angular2/bundles/http.dev.js',
    'node_modules/moment/moment.js',
    'node_modules/underscore/underscore.js'
  ])
    .pipe(debug())
    .pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(debug())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'))
});

// transpile & move js
gulp.task('js', function () {
  var tsResult = gulp.src(['src/**/*.ts'])
    .pipe(typescript(tsConfig.compilerOptions));

  return tsResult.js.pipe(gulp.dest('build'));
});

// move html
gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build'))
});

// move images
gulp.task('images', function () {
  return gulp.src('src/images/**/*.{jpg,png,gif,ico,avi,mp4}')
    .pipe(gulp.dest('build/images'))
});

