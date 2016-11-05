var gulp = require('gulp');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var pump = require('pump');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('server', function(){
    browserSync.init({
        proxy: "localhost:5000"
    });
});

// bundle js file
gulp.task('bundle', function() {
  return gulp.src(['./static/js/func.js','./static/js/app.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./static/js/'))
    .pipe(browserSync.stream())
});
// inject source html for development
gulp.task('index-dev', function(){
    var target = gulp.src('./templates/*.html');
    var sources = gulp.src(['./static/js/main.js',
                        './static/css/style.css']);
    return target.pipe(inject(sources, { ignorePath: '/static', addRootSlash: false }))
        .pipe(gulp.dest('./templates/'))
        .pipe(browserSync.stream())
    });

// inject source html for production
gulp.task('index-production', function(){
    var target = gulp.src('./templates/*.html');
    var sources = gulp.src(['./static/js/main.min.js',
                        './static/css/style.min.css']);
    return target.pipe(inject(sources, { ignorePath: '/static', addRootSlash: false }))
        .pipe(gulp.dest('./templates/'))
        .pipe(browserSync.stream())
    });

//minify javascript
gulp.task('compress', function (cb) {
  pump([
        gulp.src('./static/js/main.js'),
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


//watch gulp on development
gulp.task('serve',['server','bundle','index-dev'], function(){
        var watcher = gulp.watch('./static/js/*.js', ['bundle']);
        watcher.on('change', function(event) {
          console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
        gulp.watch('./templates/*.html').on('change', reload);
        gulp.watch('./static/css/*.css').on('change', reload);
    });

//watch gulp on production
gulp.task('serve:production',['server','minify-css','compress','bundle','index-production'], function(){
        var watcher = gulp.watch('./static/js/*.js', ['bundle','compress']);
        watcher.on('change', function(event) {
          console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
        gulp.watch('./templates/*.html').on('change', reload);
        gulp.watch('./static/css/*.css',['bundle','minify-css']).on('change', reload);
    });

//run task default
gulp.task('default', ['compress','minify-css','bundle','index-production']);
