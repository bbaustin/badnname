var gulp = require('gulp');
var gls  = require('gulp-live-server');
var less = require('gulp-less');

gulp.task('server', function() {
	var server = gls('./src/index.js');
	server.start();

// will we get a conflict if i type this? 

	gulp.watch(['gulpfile.js', './src/index.js', './src/controllers/**/*.js'], function() {
		server.start.bind(server)()
	});
});

gulp.task('default', ['server']);
