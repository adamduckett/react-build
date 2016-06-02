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
var reactDom = require('react-dom');


/**
 * Paths to project folders
 */
var paths = {
  input: 'app/',
  output: 'dist/',
  server: {
    host: 'localhost',
    port: '1337'
  }
};


/**
 * Gulp Tasks
 */

// Start a webserver
gulp.task( 'webserver', function() {
  gulp.src( paths.input )
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


/**
 * Task Runners
 */
gulp.task('watch', function(){
  // Run this task on file changes
  //gulp.watch(paths.input, ['sass']);
});

gulp.task('default', ['webserver', 'watch', 'open']);
