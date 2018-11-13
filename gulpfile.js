var gulp = require('gulp');
var sass = require('gulp-sass');

// gulp sass
gulp.task('sass', function(){
  return gulp.src('assets/scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.'))
});

// gulp watch
gulp.task('watch',function() {
    gulp.watch('assets/scss/*',['sass']);
});