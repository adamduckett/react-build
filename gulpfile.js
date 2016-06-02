/*------------------------------------*\
    #LOCAL-SERVER
\*------------------------------------*/

/*
 * Gulp Packages
 */

// Default
var gulp = require('gulp');

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
var util = require('gulp-util');


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
    entries: './app/app.js',
    debug: true
  })
  .transform('babelify')
  .bundle()
  .on('error', util.log)
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(paths.scripts.output));
});


/**
 * Task Runners
 */
gulp.task('watch', function(){
  // Run this task on file changes
  gulp.watch('./app/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'webserver', 'watch', 'open']);
