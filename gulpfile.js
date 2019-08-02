(function () {
  'use strict';

  const gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    uglifyJs = require('gulp-uglifyes'),
    uglifycss = require('gulp-uglifycss'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    postcss = require('gulp-postcss'),
    sugarss = require('sugarss'),
    watch = require('gulp-watch'),
    cached = require('gulp-cached'),
    gulpWatchPug = require('gulp-watch-pug'),
    cssbeautify = require('gulp-cssbeautify'),
    stripCssComments = require('gulp-strip-css-comments'),
    cssDeclarationSorter = require('css-declaration-sorter'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    extReplace = require("gulp-ext-replace"),
    critical = require('critical'),
    criticalCss = require('gulp-critical-css'),
    babel = require('gulp-babel');

  // Попробовать позже https://www.npmjs.com/package/gulp-pug-inheritance
  // jadeInheritance = require('gulp-jade-inheritance'),
  // changed = require('gulp-changed'),
  // cached = require('gulp-cached'),
  // gulpif = require('gulp-if'),
  // filter = require('gulp-filter');

  //write html by pug
  gulp.task('views', function buildHTML() {
    return gulp
      .src('app/assets/views/*.pug')
      .pipe(
        pug({
          pretty: true
        })
      )
      .pipe(gulp.dest('dest'));
  });

  const processors = [
    require('postcss-import'),
    require('postcss-alias'),
    require('postcss-for'),
    require('postcss-each'),
    require('postcss-assets')({
      loadPaths: ['img/', 'img/about', 'img/icons'],
      basePath: 'dest/',
      relative: 'styles/'
    }),
    require('postcss-nested-ancestors'),
    require('postcss-nested'),
    require('postcss-inline-media'),
    require('postcss-short-spacing'),
    require('postcss-size'),
    require('postcss-position'),
    require('postcss-flexbox'),
    require('postcss-simple-vars'),
    require('postcss-short-text'),
    require('postcss-responsive-type'),
    require('postcss-extend'),
    require('webp-in-css/plugin'),
    require('postcss-mixins'),
    require('postcss-inline-svg')({
      path: 'app/assets/img/'
    }),
    require('autoprefixer'),
    require('postcss-pxtorem')({
      selectorBlackList: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        '.btn',
        '.sticky-nav__nav-link',
        '.hero-blocks__item li'
      ]
    }),
    require('postcss-unique-selectors'),
    require('css-mqpacker')({
      sort: true
    }),
    require('postcss-sorting')
  ];

  //write style
  gulp.task('postcss', function () {
    return (
      gulp
      .src(['app/styles/main.sss'])
      .pipe(sourcemaps.init())
      .pipe(
        postcss(processors, {
          parser: sugarss
        }).on('error', notify.onError())
      )
      .pipe(
        cssbeautify({
          indent: '  ',
          autosemicolon: true
        })
      )
      .pipe(rename({
        extname: '.css'
      }))
      //.pipe(sourcemaps.write('/'))
      .pipe(uglifycss())
      .pipe(gulp.dest('dest/styles/'))
    );
  });

  // critical css extract
  gulp.task('critical', function() {
    return critical.generate({
      inline: true,
      base: 'dest',
      src: 'index.html',
      css: ['dest/styles/main.css'],
      dest: 'index.html',
      minify: false,
      ignore: ['@font-face'],
      dimensions: [{
        width: 320,
        height: 480
      },{
        width: 768,
        height: 1024
      },{
        width: 1280,
        height: 960
      }],
      extract: false
    });
  });

  // // critical css
  // gulp.task('critical', function () {
  //   return gulp.src('dest/styles/main.css')
  //       .pipe(criticalCss())
  //       .pipe(gulp.dest('dest/styles'));
  // });

  // write js
  gulp.task('scripts', function () {
    return gulp.src('app/scripts/**').pipe(gulp.dest('dest/scripts'));
  });

  //delete dest folder
  gulp.task('clean', function () {
    return del('dest');
  });

  //lib
  gulp.task('libs-css', function () {
    return gulp
      .src('app/libs/**/*.css')
      .pipe(uglifycss())
      .pipe(concat('libs.min.css'))
      .pipe(gulp.dest('dest/styles/'));
  });

  gulp.task('libs-js', function () {
    return gulp
      .src('app/libs/**/*.js')
      .pipe(concat('libs.min.js'))
      .pipe(gulp.dest('dest/scripts/'));
  });

  gulp.task('babel', function() {
    return gulp.src(
      [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'dest/scripts/libs.min.js'
      ])
      .pipe(babel({
        presets: ['@babel/preset-env']
      }))
      .pipe(gulp.dest('dest/scripts/'))
  });

  // js to prod
  gulp.task('jsprod', function () {
    return gulp
      .src('dest/scripts/*.js')
      .pipe(uglifyJs())
      .pipe(gulp.dest('dest/scripts/'));
  });


  //copy all assets files
  gulp.task('assets', function () {
    return gulp
      .src('app/assets/**', {
        since: gulp.lastRun('assets')
      })
      .pipe(cached('app/assets'))
      .pipe(gulp.dest('dest'));
  });

  //webp
  var pathImg = 'app/assets/img/**/*';

  gulp.task("png", function() {
    return gulp.src(pathImg + ".png")
      .pipe(imagemin())
      .pipe(gulp.dest("dest/img"));
  });
  gulp.task("jpg", function() {
    return gulp.src(pathImg + ".{jpg,jpeg}")
      .pipe(imagemin())
      .pipe(gulp.dest("dest/img"));
  });
  gulp.task("svg", function() {
    return gulp.src(pathImg + ".svg")
      .pipe(imagemin())
      .pipe(gulp.dest("dest/img"));
  });
  gulp.task("webp", function() {
    return gulp.src('dest/img/**/*' + ".{png,jpg,jpeg}")
      .pipe(webp())
      .pipe(gulp.dest("dest/img"));
  });
  gulp.task('picture', gulp.parallel('png', 'jpg'));
  gulp.task('img', gulp.parallel(gulp.series('picture', 'webp'), 'svg'));

  //copy mail.php
  gulp.task('php', function () {
    return gulp
      .src('app/assets/views/*.php')
      .pipe(gulp.dest('dest'));
  });

  //run task for build once
  gulp.task(
    'build',
    gulp.series(
      'clean',
      gulp.parallel(
        'assets',
        'php',
        'postcss',
        'views',
        'libs-css',
        'libs-js',
        'scripts',
      ),
      'img',
    )
  )

  //up static server; watching change in dest and reload page
  gulp.task('server', function () {
    browserSync.init({
      server: 'dest',
      notify: false
    });

    browserSync.watch('dest/**/*.*').on('change', browserSync.reload);
  });

  //watching by all files in dest
  gulp.task('watch', function () {
    gulp.watch('app/styles/**/*.*', gulp.series('postcss'));
    gulp.watch('app/scripts/**/*.*', gulp.series('scripts'));
    gulp.watch('app/assets/**/*.*', gulp.series('assets'));
    gulp.watch('app/assets/views/*.php', gulp.series('php'));
    gulp.watch('app/assets/views/**/*.*', gulp.series('views'));
    gulp.watch('app/libs/**/*.js', gulp.series('libs-js'));
    gulp.watch('app/libs/**/*.css', gulp.series('libs-css'));
  });

  gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'server')));
  gulp.task('prod', gulp.series('img', 'critical', 'jsprod'));
})();
