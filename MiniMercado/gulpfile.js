
//Require
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  useref = require('gulp-useref'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  gulpIf = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  runSequence = require('run-sequence'),
  minifyHtml = require("gulp-minify-html");

//Watchers
gulp.task('watch',['browserSync','sass'] ,function(){
  //Defino watchers
  gulp.watch('app/scss/*.scss', ['rebuild']);
  gulp.watch('app/*.html', ['rebuild']);
  gulp.watch('app/js/*.js', ['rebuild']);

})

//---------------------Tasks-----------------------------------------


//Run
gulp.task('build',['minify-html','api','chico','images'], function (callback) {
  runSequence(['browserSync','clean:mini'],
      callback
  )
})

//Build
gulp.task('rebuild', function (callback) {
  runSequence(['clean:dist','sass', 'chico', 'images','minify-html','minify','api'],
      callback
  )
})

//Browser project
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
});

//Sass compiler
gulp.task('sass', ['clean:dist'],function(){
  //Compilo scss en css de todas las folders de sass
  return gulp.src('app/scss/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('chico', ['clean:dist'],function (callback) {
  return gulp.src('app/chico/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/third_parties'))
})

//Imagenes
gulp.task('images',['clean:dist'], function(){
  //Copio imagenes de app a dist
  return gulp.src('app/images/**/*.+(png|jpg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
});


//Minificar
gulp.task('minify',['sass'], function(){
  //Minifico js y css y lo genero en dist
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano({zindex: false})))
    .pipe(gulp.dest('dist/html-mini'))
});


// Minificar HTML
gulp.task('minify-html', ['clean-css'],function () {
  gulp.src('dist/html-mini/*.html')
      .pipe(minifyHtml())
      .pipe(gulp.dest('dist'))
});
// Clean CSS
gulp.task('clean-css',['clean-js'], function () {
  gulp.src('dist/html-mini/css/*.css')
      .pipe(gulp.dest('dist/css'))
});
// Minificar JS
gulp.task('clean-js', ['minify'],function () {
  gulp.src('dist/html-mini/js/*.js')
      .pipe(gulp.dest('dist/js'))
});

gulp.task('minifycss', function(){
  return gulp.src('app/*.html')
      .pipe(useref())
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});


gulp.task('api', ['clean:dist'],function(){
  //Minifico js y css y lo genero en dist
  return gulp.src('app/api/*.json')
      .pipe(gulp.dest('dist/api'))
});

//Delete Dist
gulp.task('clean:dist', function() {
  //Borro dist
  return del.sync('dist');

})

//Delete html-mini
gulp.task('clean:mini', function() {
  return del.sync('dist/html-mini');

})
