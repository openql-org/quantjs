var gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-mocha'),
    sass = require('gulp-sass'),
    webpack = require('webpack'),
    uglify = require('gulp-uglify'),
    documentation = require('gulp-documentation'),
    rename = require('gulp-rename'),
    del = require('del'),
    fs = require('fs');

var HEADER          = './src/header.js',
    VERSION         = './build/version.js',
    TARGET_FILE     = 'quant.js',
    SRC_DIR         = __dirname + '/src/',
    TEST_DIR        = __dirname + '/test/',
    DOCS_DIR        = __dirname + '/docs/',
    BUILD_DIR       = __dirname + '/build/',
    ASSET_DIR       = '/assets',
    DIST_DIR        = __dirname + '/dist/';

function createBanner() {
  var today = gutil.date(new Date(), 'yyyy-mm-dd'); // today, formatted as yyyy-mm-dd
  var version = require('./package.json').version;
  var year = gutil.date(new Date(), 'yyyy');
  return String(fs.readFileSync(HEADER))
      .replace('@@date', today)
      .replace('@@year', year)
      .replace('@@version', version);
}

function updateVersionFile() {
  var version = require('./package.json').version;
  fs.writeFileSync(VERSION, 'module.exports = \'' + version + '\';\n' +
      '// Note: This file is automatically generated when building quant.js.\n' +
      '// Changes made in this file will be overwritten.\n');
}

var webpackConfig = require('./webpack.config');
webpackConfig.plugins = [
  new webpack.BannerPlugin({
    banner: createBanner(),
    entryOnly: true,
        raw: true
  }),
];
var compiler = webpack(webpackConfig);

var uglifyConfig = {
  sourceMap: true,
  output: {
    comments: /@license/
  }
};

gulp.task('bundle', ['html','build'], function (cb) {
  compiler.run(function (err, stats) {
    if (err) {
      gutil.log(err);
    }
    cb();
  });
});

gulp.task('minify', ['bundle'], function () {
  return gulp.src(DIST_DIR + TARGET_FILE)
    .pipe(uglify(uglifyConfig))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('html', ['html-copy'], function() {
  return gulp.src(BUILD_DIR + '**/*.html')
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('html-copy', function() {
  return gulp.src(SRC_DIR + '**/*.html')
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('style', function() {
  return gulp.src(SRC_DIR + '**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(gulp.dest(BUILD_DIR + ASSET_DIR));
});

gulp.task('js-copy', function() {
  return gulp.src([SRC_DIR + '**/*.js', '!'+HEADER])
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('test', ['build'], function() {
  return gulp.src([TEST_DIR + "**/*test.js"], {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function(){});
});

gulp.task('docs', function () {
  return gulp.src([BUILD_DIR + '**/*.js'])
    .pipe(documentation('md'))
    .pipe(gulp.dest(DOCS_DIR));
});

gulp.task('watch', function () {
  gulp.watch(
    [ __dirname + '/app.js',
      __dirname + '/main.js',
      SRC_DIR + '**/*.js'
    ], ['bundle','test']);
  gulp.watch([SRC_DIR + '**/*.scss'], ['bundle']);
  gulp.watch([SRC_DIR + '**/*.html'], ['html']);
});

gulp.task('build',  ['html-copy','style','js-copy'], function() {
  updateVersionFile();
});
gulp.task('compile', ['build']);
gulp.task('coverage', ['test']);
gulp.task('clean', del.bind(null, [BUILD_DIR, DIST_DIR,'**/*.log']));
gulp.task('dist-clean', ['clean'], del.bind(null, 
  [ __dirname + '/node_modules',
    __dirname + '/coverage',
  ]));
gulp.task('default', ['bundle','minify','docs']);
