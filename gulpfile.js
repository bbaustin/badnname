var gulp = require('gulp');
var gls  = require('gulp-live-server');
var less = require('gulp-less');

// Transpile LESS into CSS
gulp.task('less', function() {
  gulp.src('./src/public/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('./src/public/css'));
});


// Watch for file changes
gulp.task('watch', function() {
  gulp.watch(['./src/public/less/**/*.less'], ['less']);
});


gulp.task('server', function() {
	var server = gls('./src/index.js');
	server.start();

	gulp.watch(['gulpfile.js', './src/index.js', './src/controllers/**/*.js'], function() {
		server.start.bind(server)()
	});
});

gulp.task('default', ['server']);
