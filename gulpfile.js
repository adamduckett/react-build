/*------------------------------------*\
    #LOCAL-SERVER
\*------------------------------------*/

/*
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var notify = require('gulp-notify');
var util = require('gulp-util');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var del = require('del');

// Local Server
var webserver = require('gulp-webserver');
var opn = require('opn');

// React
var react = require('react');
var reactDOM = require('react-dom');

// Babel
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

// CSS
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');


/**
 * Paths to project folders
 */
var bases = {
  base: './',
  input: 'src/',
  output: 'dist/'
};

var paths = {
  html: {
    input: bases.input,
    output: bases.output
  },
  scripts: {
    input: bases.input + 'js/**/*.js',
    output: bases.output + 'js/',
    entry: bases.input + 'js/index.js'
  },
  styles: {
    input: 'src/css/**/*.{scss,sass}',
    output: 'dist/css/'
  },
  server: {
    host: 'localhost',
    port: '1337',
    root: bases.output
  }
};


/**
 * Gulp Tasks
 */

// Error Handling
var onError = function ( err ) {
  util.beep();
  console.log( err );
  this.emit( 'end' );
};

// Start a webserver
gulp.task( 'webserver', [ 'copy' ], function() {
  gulp.src( paths.server.root )
    .pipe(webserver({
      host:             paths.server.host,
      port:             paths.server.port,
      livereload:       true,
      directoryListing: false,
      fallback: 'dist/index.html'
    }));
});

// Open our webserver in our default browser
gulp.task('open', function() {
  opn( 'http://' + paths.server.host + ':' + paths.server.port );
});

// HTML
gulp.task('copy', function () {
  return gulp.src( paths.html.input + 'index.html' )
  .pipe(gulp.dest( paths.html.output ));
});

// JS
gulp.task('scripts', function () {
  var bundleStream = browserify({
    entries: paths.scripts.entry,
    extensions: [ '.js' ],
    debug: true
  })
  .transform( 'babelify' )
  .bundle()

  return bundleStream
    .on( 'error', util.log )
    .pipe(source( 'scripts.js' ))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest( paths.scripts.output ))
    .pipe(notify({ message: 'Scripts task complete' }))
});

// CSS
gulp.task('styles', function() {
  return gulp.src( paths.styles.input )
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(sass({
    outputStyle: 'expanded',
    sourceComments: true
  }))
  .pipe(prefix({
    browsers: [ 'last 2 version' ]
  }))
  .pipe(gulp.dest( paths.styles.output ))
  .pipe(rename({ suffix: '.min' }))
  .pipe(minify({ compatibility: 'ie9' }))
  .pipe(gulp.dest( paths.styles.output ))
  .pipe(notify({ message: 'Styles task complete' }))
});

// Clean
gulp.task('clean', function() {
  return del.sync('dist');
});


/**
 * Task Runners
 */
gulp.task('watch', [ 'styles', 'scripts', 'copy' ], function() {
  gulp.watch( 'src/js/**/*.{js,jsx}', [ 'scripts' ] );
  gulp.watch( 'src/css/**/*.{scss,sass}', [ 'styles' ] );
  gulp.watch( paths.html.input + 'index.html', [ 'copy' ]);
});

gulp.task('build', function(callback) {
  runSequence('clean',
    [ 'scripts', 'styles', 'copy' ],
    callback
  )
});

gulp.task('default', function(callback) {
  runSequence('build',
  [ 'webserver', 'watch', 'open' ],
    callback
  )
});
