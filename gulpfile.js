// connect gulp (функції що йдуть у галпа під капотом)
const {src, dest, watch, parallel, series} = require('gulp');

// добавляємо плагін concat, який перейменовує і об'єднує файли
const concat = require('gulp-concat');

// plagin gulp-autoprefixer
const autoprefixer = require('gulp-autoprefixer'); 

// добавляємо плагін sass, який компелює scss в css ш зжимає його
const scss = require('gulp-sass')(require('sass'));

function styles() {
    // звідки взяти цей файл
    return src([
        'app/scss/style.scss',
    ])
        // .pipe(autoprefixer({ overrideBrowserList: ['last 10 version'] }))
        // дія плагіну concat
        .pipe(concat('style.min.css'))
        // що робити з вибраним файлом
        .pipe(scss({ outputStyle: 'compressed'}))
        // куди переслати оброблений файл
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

// function scss

function stylesScss() {
    return src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/animate.css/animate.css'
    ])

        .pipe(concat('_libs.scss'))
        .pipe(dest('app/scss'))
        .pipe(browserSync.stream())
}
// добавляємо плагін uglify-es, який об'єднує та зжимає javascript файли
const uglify = require('gulp-uglify-es').default;

function scripts() {
    return src([
        'app/js/main.js',
        'node_modules/wow.js/dist/wow.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

// plagin gulp-clean, щоб удаляв папку dist
const clean = require('gulp-clean');

function cleanDist() {
    return src('dist')
        .pipe(dest('dist'))
}

// plagin browser-sync, щоб сторінка сама оновлювалася
const browserSync = require('browser-sync').create();

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

// watching, слідкує за змінами у вказаних файлах і при внесених змінах сам запускає фунцію плагіна 
function watching() {
    watch(['app/scss/style.scss'], styles)
    watch(['app/scss/_global.scss'], styles)
    watch(['app/scss/_media.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload);
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

// експортуємо функцію, щоб викликати її в консолі
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;


exports.build = series(cleanDist, building);
exports.default = parallel(styles, stylesScss, scripts, browsersync, watching);


