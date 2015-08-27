var gulp = require('gulp');
var config = require('./gulp.config')();
var args = require('yargs').argv;
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy: true});
var del = require('del');
var async = require('async');

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);


gulp.task('less', function () {
    return gulp.src(config.less.srcFile)
        .pipe($.plumber())
        .pipe($.less())
        .pipe(gulp.dest(config.less.dest));
});

gulp.task('megaNavBar', function () {
    return gulp.src(config.megaNavBar.srcFile)
        .pipe($.plumber())
        .pipe($.less())
        .pipe(gulp.dest(config.megaNavBar.dest));
});


gulp.task('less-watcher', function() {
    gulp.watch([config.less.src+'**/*less'], ['less']);
});

gulp.task('megaNavBar-watcher', function() {
    gulp.watch([config.megaNavBar.src+'**/*less'], ['less']);
});

gulp.task('wiredep', function() {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.indexTemplate)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task('styles', ['clean-styles'], function() {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.plainCss)
        .pipe($.plumber())
        .pipe(gulp.dest(config.temp));
});

gulp.task('inject', [/*'styles','less', 'templatecache'*/], function() {
    log('Wire up the app css into the html, and call wiredep ');
    var templateCache = config.assetsDir + 'build/' + config.templateCache.file;

    return gulp
        .src(config.indexTemplate)
        .pipe($.plumber())
        .pipe($.inject(
            gulp.src(templateCache, {read: false}), {
                ignorePath: 'public',
                starttag: '<!-- inject:templates:js -->'
            }))
        .pipe(gulp.dest(config.build));
});

gulp.task('combine', function () {
    //this task grabs all the files from within the layout and combines them in the build dir
    var assets = $.useref.assets({searchPath: './public'});
    return gulp
        .src(config.indexTemplate)
        .pipe($.plumber())
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(config.build));
});

gulp.task('fonts', [], function() {
    log('Copying fonts');
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.assetsDir + 'build/fonts'));
});

gulp.task('cleanUp', [], function(done) {
    log('cleaning up');
    async.parallel([
        function(next){
            fs.remove(config.assetsDir + 'build/**/*', next);
        },
        function(next){
            fs.remove(config.build + '**/*', next);
        }
    ],done);
});

gulp.task('templatecache', [], function() {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.assetsDir + 'build'));
});

gulp.task('optimize', ['fonts','combine','templatecache'], function() {
    //grab all files from useref and combine them
    log('Optimizing the javascript, css, html');

    var assets = $.useref.assets({searchPath: './public'});
    var templateCache = config.assetsDir + 'build/' + config.templateCache.file;
    var cssFilter = $.filter('**/*.css');
    var jsLibFilter = $.filter('**/' + config.optimized.lib);
    var jsAppFilter = $.filter('**/' + config.optimized.app);

    return gulp
        .src(config.indexTemplate)
        .pipe($.plumber())
        .pipe($.inject(
            gulp.src(templateCache, {read: false,ignorePath : ['/public'],relative : true}), {
                ignorePath: 'public',
                starttag: '<!-- inject:templates:js -->'
            }))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore())
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsAppFilter.restore())
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.build));
});

gulp.task('production',['optimize'], function(done) {
    var assets = {
        scripts : 'assets/build/js/',
        css : 'assets/build/styles/'
    };
    async.series([
        function(next){
            //copy the layout file from the build to views dir
            fs.copy(config.build + config.templateName,config.index,function(err){
                if (err){
                    console.log(err);
                }
                log('copied ' + config.build + config.templateName + ' to ' + config.index);
                next(null);
            });
        },
        function(next){
            //copy the assets from the build locations to the production ones
            fs.copy(config.build + 'assets/build/',config.assetsDir + 'build',function(err){
                if (err){
                    console.log(err);
                }
                log('copied ' + config.build + 'assets/build/' + ' to ' + config.assetsDir + 'build');
                next(null);
            });
        },
        function(next){
            //copy the fonts to build folder
            fs.copy(config.client + 'stylesheets/font/',config.assetsDir + 'build/styles/font',function(err){
                if (err){
                    console.log(err);
                }
                log('copied ' + config.client + 'stylesheets/font/' + ' to ' + config.assetsDir + 'build');
                next(null);
            });
        },
        function(next){
            fs.remove(config.build + '**/*', next);
        }
    ],done);
});

gulp.task('watch-production', function() {
    var filesToWatch = [
        config.indexTemplate,
        config.clientApp + '**/*.js',
        config.build + 'app/**/*.js'
    ];
    gulp.watch(filesToWatch , ['production']);
});

gulp.task('debug',[], function(done) {
    //switches the layout to the development one, no combined assets involved
    fs.copy(config.indexTemplate,config.index,function(err){
        if (err){
            console.log(err);
        }
        log('copied ' + config.indexTemplate + ' to ' + config.index);
        done(null);
    });
});


function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}