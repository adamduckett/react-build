/*------------------------------------*\
    #LOCAL-SERVER
\*------------------------------------*/

/*
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var notify = require('gulp-notify');

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


/**
 * Paths to project folders
 */
var bases = {
  base: './',
  app: 'app/',
  web: 'web/'
};

var paths = {
  scripts: {
    input : bases.app + '**/*.js',
    output: bases.web + 'js/'
  },
  server: {
    host: 'localhost',
    port: '1337'
  },
  html: 'index.html'
};


/**
 * Gulp Tasks
 */

// Start a webserver
gulp.task( 'webserver', function() {
  gulp.src( bases.base )
    .pipe(webserver({
      host:             paths.server.host,
      port:             paths.server.port,
      livereload:       true,
      directoryListing: false,
      fallback: 'index.html'
    }));
});

// Open our webserver in our default browser
gulp.task('open', function() {
  opn( 'http://' + paths.server.host + ':' + paths.server.port );
});

// Scripts
gulp.task('scripts', function () {
  browserify({
    entries: bases.app + 'app.js',
    extensions: ['.js'],
    debug: true
  })
  .transform('babelify')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(paths.scripts.output))
  .pipe(notify({ message: 'Scripts task complete' }))
});


/**
 * Task Runners
 */
gulp.task('watch', function(){
  // Run this task on file changes
  gulp.watch(paths.scripts.input, ['scripts']);
});

gulp.task('default', ['scripts', 'webserver', 'watch', 'open']);
