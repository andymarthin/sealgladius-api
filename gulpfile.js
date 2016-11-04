var gulp = require('gulp');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var pump = require('pump');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('server', function(){
    browserSync.init({
        proxy: "localhost:5000"
    });
});

//minify javascript
gulp.task('compress', function (cb) {
  pump([
        gulp.src('./static/js/app.js'),
        uglify(),
        rename({suffix: '.min'}),
        gulp.dest(function(file) {
            return file.base;
        }),
        notify({
            message: 'JS Scripts task complete!',
            onLast : true
        }),
        browserSync.stream(),
    ],
    cb
  );
});


//minify css
gulp.task('minify-css', function(cb){
	pump([
			gulp.src('./static/css/style.css'),
			cleanCSS({debug: true}, function(details) {
	            console.log(details.name + ': ' + details.stats.originalSize);
	            console.log(details.name + ': ' + details.stats.minifiedSize);
            }),
            rename({suffix: '.min'}),
        	gulp.dest(function(file) {
            	return file.base;
        	}),
        	notify({
	            message: 'CSS Scripts task complete!',
	            onLast : true
      		}),	
        	browserSync.stream(),
		],
		cb
		);
	});


//watch gulp
gulp.task('watch',['server','minify-css','compress'], function(){
        var watcher = gulp.watch('./static/js/*.js', ['compress']);
        watcher.on('change', function(event) {
          console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
        gulp.watch('./templates/*.html').on('change', reload);
        gulp.watch('./static/css/*.css',['minify-css']).on('change', reload);
    });

//run task default
gulp.task('default', ['compress','minify-css']);
