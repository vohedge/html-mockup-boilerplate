// Basic Gulp File
//
var gulp        = require('gulp'),
    filter      = require('gulp-filter'),
    sass        = require('gulp-ruby-sass'),
    autoprefix  = require('gulp-autoprefixer'),
    notify      = require("gulp-notify"),
    bower       = require('gulp-bower'),
    ect         = require('gulp-ect'),
    browserSync = require('browser-sync');

var config = {
    sassPath:    './mockup/assets/css/sass',
    jsDir:       './mockup/assets/js',
    fontDir:     './mockup/assets/fonts',
    templateDir: './mockup/assets/templates',
    bowerDir:    './bower_components'
}

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
  return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
    .pipe(gulp.dest(config.fontDir));
});

gulp.task('css', function() {
  return gulp.src(config.sassPath + '/style.scss')
    .pipe(sass({
      style: 'compressed',
      loadPath: [
        config.sassPath,
        config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
        config.bowerDir + '/fontawesome/scss',
      ],
      sourcemap: true
    })
    .on("error", notify.onError(function (error) {
        return "Error: " + error.message;
    })))
    .pipe(autoprefix('last 2 version'))
    .pipe(gulp.dest('./mockup/assets/css'))
    .pipe(filter('**/*.css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('template', function(){
  gulp.src([config.templateDir + '/**/*.ect', '!' + config.temlateDir + '/**/_*.*'])
    .pipe(ect())
    .pipe(gulp.dest('./mockup'));
});

gulp.task('js', function(){
  gulp.src(config.bowerDir + '/jquery/dist/jquery.min.js')
    .pipe(gulp.dest(config.jsDir));
  gulp.src(config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.js')
    .pipe(gulp.dest(config.jsDir));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./mockup"
    }
  });
});

// Rerun the task when a file changes
gulp.task('default', ['bower', 'icons', 'js', 'css', 'template', 'browser-sync'], function() {
  gulp.watch(config.sassPath + '/**/*.scss', ['css']);
  // gulp.watch(config.templateDir + '/**/*.ect', ['template']);
  gulp.watch('mockup/**/*.html', browserSync.reload);
});

