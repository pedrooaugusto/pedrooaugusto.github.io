const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-clean-css');
const jsmin = require('gulp-uglify');
//jsf-api-2.2.8
//jsf-impl-2.2.8
gulp.task('minify-html', function() {
	const files = [
		'index.html',
		'project-details/*.html',
		'live/*.html',
		'live/**/*.html'
	];
  	return gulp.src(files, {base: '.'})
    	.pipe(htmlmin({collapsWehitespace: true, removeComments: true}))
    	.pipe(gulp.dest('dist'));
});

gulp.task('minify-js', function() {
	const files = [
		'js/validator.js',
		'js/page-transition.js',
		'js/main.js'
	];
  	return gulp.src(files, {base: '.'})
    	.pipe(jsmin())
    	.pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
	const files = [
		'css/*.css',
		'live/**/*.css'
	];
  	return gulp.src(files, {base: '.'})
    	.pipe(cssmin())
    	.pipe(gulp.dest('dist'));
});

gulp.task('default', ['minify-html', 'minify-css', 'minify-js'])