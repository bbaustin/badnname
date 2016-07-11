// Require Dependencies
var gulp = require('gulp');
var gls  = require('gulp-live-server');
var less = require('gulp-less');

// Transpile LESS into CSS
gulp.task('less', function() {
  gulp.src('./src/public/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('./src/public/style.css'));
});


// Run a local server
gulp.task('server', function() {
  var server = gls('./src/index.js', {NODE_ENV: 'development', PORT: 8008});
  server.start(); // Start the server

  gulp.watch(['gulpfile.js', './src/app.js', './src/controllers/**/*.js'], function() {
    server.start.bind(server)()
  });
});


// Watch for file changes
gulp.task('watch', function() {
  gulp.watch(['./src/public/less/**/*.less'], ['less']);
});

// gulp.watch(['gulpfile.js', './src/index.js', './src/controllers/**/*.js'], function() {
// 	server.start.bind(server)()
// 	});


// Default Task
gulp.task('default', ['watch', 'less', 'server']);
