// File paths
const files = {
    sassPath: './sass/',
    jsPath: './javascripts/',
};
const destinations = {
    cssPath: './css/',
    jsPath: './javascripts/prod/',
};

//
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require('gulp-minify');

/**
 * do style
 * @param done
 * @returns {*}
 */
function doStyles(done) {
    return gulp.series(sassCompile, (done) => {
        done();
    })(done);
}

/**
 * sass complie
 * @returns {*|void}
 */
function sassCompile() {
    return gulp
        .src(files.sassPath + '**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .on('error', sass.logError)
        .pipe(concat('final.css'))
        .pipe(gulp.dest(destinations.cssPath))
        .pipe(browserSync.stream());
}

/**
 * Compile scripts
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function doScripts1(done) {
    return gulp.series(jsCompileApp, (done) => {
        done();
    })(done);
}

/**
 * [jsCompileApp description]
 * @return {[type]} [description]
 */
function jsCompileApp() {
    return gulp
        .src([
            // './node_modules/jquery/dist/jquery.min.js',
            './node_modules/socket.io-client/dist/socket.io.slim.js',
            './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            files.jsPath + 'app.js',
            // files.jsPath + 'GlobalEventDispatcher.js',
            // files.jsPath + 'APIHandler.js',
            // files.jsPath + 'baseMessage.js',
            // files.jsPath + 'chat.js',
            // files.jsPath + 'privateChat.js',
            // files.jsPath + 'user.js',
            // files.jsPath + 'signup.js',
            // files.jsPath + 'signout.js',
        ])
        .pipe(concat('application.js'))
        .pipe(gulp.dest(destinations.jsPath))
        .pipe(browserSync.stream());
}
/**
 * [minifyJs description]
 * @return {[type]} [description]
 */
function minifyJs() {
    return gulp
        .src([destinations.jsPath + 'application.js'])
        .pipe(
            minify({
                ext: {
                    src: '.js',
                    // min: ".min.js"
                },
            })
        )
        .pipe(gulp.dest(destinations.jsPath));
}

/**
 * reload
 * @param done
 */
function reload(done) {
    browserSync.reload();
    done();
}

/**
 * watch
 */
function watch() {
    browserSync.init({
        proxy: 'http://127.0.0.1:5000',
        port: 3010,
    });
    gulp.watch(files.sassPath + '**/*.scss', doStyles);
    gulp.watch(files.jsPath + '*.js', doScripts1);
    // gulp.watch(files.jsPath + '*.js', minifyJs);
    // gulp.watch([destinations.jsPath + 'application.js', destinations.jsPath + 'login.js'], minifyJs);
}
gulp.task('default', watch);
