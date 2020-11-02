const {src, dest, series, parallel, watch} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');

const origin = 'src';
const destination = 'build';

sass.compiler = require('node-sass');

async function clean(cb) {
    await del(destination);
    cb();
}

function html(cb) {
    src(`${origin}/**/*.html`).pipe(dest(destination));
    cb();
}

function scss(cb){
    src(`${origin}/**/style.scss`)
    .pipe(sass({outputStyle:'nested'}))
    .pipe(dest(destination));
    cb();
}

function js(cb) {
    src(`${origin}/**/*.js`).pipe(dest(destination));
    cb();
}

function image(cb)  {
    src(`${origin}/**/*.jpg`)
    .pipe(imagemin())
    .pipe(dest(destination));
    cb();
}

function watcher(cb) {
    watch(`${origin}/**/*.scss`).on('change', series(scss, browserSync.reload))
    watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload))
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
    watch(`${origin}/**/*.jpg`).on('change', series(image, browserSync.reload))
    cb();
}

function server (cb) {
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir:destination
        }
    })
    cb();
}
exports.default = series (clean,parallel(html, js), scss,image, server, watcher);
