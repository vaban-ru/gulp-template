'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const prettier = require('gulp-prettier');
const beautify = require('gulp-jsbeautifier');
const sourcemaps = require('gulp-sourcemaps');
const webp = require('gulp-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const nunjucks = require('gulp-nunjucks');

// Очистка папки dist
function clean() {
    return del(['./dist']);
}

// Инициализация веб-сервера
function browserSyncInit(done) {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
        // tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: 'Webit_Dev',
    });
    done();
}

// Функция перезагрузки страницы
function browserSyncReload(done) {
    browserSync.reload();
    done();
}

// Шаблонизация и склейка HTML
function htmlProcess() {
    return gulp
        .src(['src/*.html'])
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('./dist/'));
}

function imgProcessWebp() {
    return gulp
        .src('src/img/**/*.*')
        .pipe(webp())
        .pipe(gulp.dest('dist/img/'));
}

function imgProcessWatch() {
    return gulp
        .src('src/img/**/*.*')
        .pipe(changed('dist/img/'))
        .pipe(gulp.dest('dist/img/'));
}

// Работа с картинками для Production
function imgProcessBuild() {
    return gulp
        .src('src/img/**/*.*')
        .pipe(imagemin([
            imageminMozjpeg({
                quality: 90
            })
        ]))
        .pipe(gulp.dest('dist/img/'));
}

// Копирование шрифтов
function fontsProcess() {
    return gulp.src(['src/fonts/**/*']).pipe(gulp.dest('./dist/fonts'));
}

// Склейка и минификация CSS
function cssProcess() {
    var plugins = [autoprefixer(), cssnano()];
    return gulp
        .src(['src/css/reset.css', 'src/css/grid.css', 'src/css/**/*.*'])
        .pipe(concat('libs.min.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dist/css'));
}

// Компиляция SASS
function scssProcess() {
    var plugins = [autoprefixer()];
    return gulp
        .src(['src/sass/app.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(prettier({singleQuote: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/css'));
}

// Компиляция SASS  для Production
function scssProcessBuild() {
    var plugins = [autoprefixer(),cssnano()];
    return gulp
        .src(['src/sass/app.scss'])
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dist/css'));
}

// Склейка и минификация JS библиотек
function libsJsProcess() {
    return gulp
        .src([
            'node_modules/jquery/dist/jquery.min.js',
            'src/js/!(app)*.js',
        ])
        .pipe(concat('libs.min.js'))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
}

// Склейка пользовательского JS
function jsProcess() {
    return (
        gulp
            .src(['src/js/app.js'])
            .pipe(beautify())
            .pipe(gulp.dest('./dist/js'))
    );
}

// Компиляция JS  для Production
function jsProcessBuild() {
    return (
        gulp
            .src(['src/js/app.js'])
            .pipe(babel())
            .pipe(uglify())
            .pipe(gulp.dest('./dist/js'))
    );
}

// Наблюдение за изменениями
function watchFiles() {
    gulp.watch('src/**/*.html', gulp.series(htmlProcess, browserSyncReload));
    gulp.watch('src/css/**/*.*', gulp.series(cssProcess, browserSyncReload));
    gulp.watch('src/sass/**/*.*', gulp.series(scssProcess, browserSyncReload));
    gulp.watch('src/js/!(app)*.js', gulp.series(libsJsProcess, browserSyncReload));
    gulp.watch('src/js/app.js', gulp.series(jsProcess, browserSyncReload));
    gulp.watch('src/img/**/*.*', gulp.series(imgProcessWatch, browserSyncReload));
    gulp.watch('src/fonts/*.*', gulp.series(fontsProcess, browserSyncReload));
}

// Определение основных переменных
const build = gulp.series(
    clean,
    gulp.parallel(htmlProcess, cssProcess, scssProcessBuild, libsJsProcess, jsProcessBuild, fontsProcess, imgProcessBuild, imgProcessWebp)
);

const dev = gulp.series(
    clean,
    gulp.parallel(htmlProcess, cssProcess, scssProcess, libsJsProcess, jsProcess, fontsProcess, imgProcessBuild, imgProcessWebp)
);

const watchEvent = gulp.series(
    clean,
    gulp.parallel(htmlProcess, cssProcess, scssProcess, libsJsProcess, jsProcess, fontsProcess, imgProcessWatch)
);

const watch = gulp.parallel(watchEvent, watchFiles, browserSyncInit);

// Экспорт
exports.build = build;
exports.dev = dev;
exports.default = watch;
exports.watch = watch;
