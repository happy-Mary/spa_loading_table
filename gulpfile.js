var gulp = require('gulp'),
    less = require('gulp-less'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    notify = require("gulp-notify"),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify');

// server
gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true
    });
});

// html
gulp.task('html', function() {
    gulp.src('app/**/*.html')
        .pipe(connect.reload());
});

// css
gulp.task('css', function() {
    return gulp.src('app/css/*.css')
        .pipe(concatCss("style.css"))
        .pipe(autoprefixer({
            browsers: ['last 3 versions', '> 5%']
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("app/css"))
        // .pipe(connect.reload())
        .pipe(notify("DONE!"));
});

// js
gulp.task("minify", function(){
	gulp.src('app/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('app/build-js'))
		.pipe(connect.reload())
        .pipe(notify("DONE!"));
})

// less
gulp.task("less", function() {
    return gulp.src('app/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('app/css'))
        // .pipe(livereload());
        .pipe(connect.reload());
});


gulp.task('bower', function() {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: "app/bower_components"
        }))
        .pipe(gulp.dest('./app'));
});


gulp.task('watch', function() {
    gulp.watch('app/less/**/*.less', ['less'])
    gulp.watch('app/css/*.css', ['css'])
    gulp.watch('app/*.html', ['html'])
    gulp.watch('app/js/*js', ['minify'])
     gulp.watch('app/build-js/*js', ['minify'])
});

gulp.task('default', ['connect', 'watch']);