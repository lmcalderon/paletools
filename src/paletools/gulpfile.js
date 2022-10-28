const gulp = require('gulp');
const through = require('through2');
const path = require('path');
const fs = require("fs");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config");
const webpackMobileConfig = require("./webpack.config.mobile");

const VERSION = "23.8.6";

function getJsCode(filePath, vinylFile){
    return vinylFile.contents;
}

function base64Encode(getCode){
    return through.obj(function (vinylFile, encoding, callback) {
        // 1. clone new vinyl file for manipulation
        // (See https://github.com/wearefractal/vinyl for vinyl attributes and functions)
        var transformedFile = vinylFile.clone();
        // 2. set new contents
        // * contents can only be a Buffer, Stream, or null
        // * This allows us to modify the vinyl file in memory and prevents the need to write back to the file system.
        //transformedFile.contents = Buffer.from(`"${filename}": "${vinylFile.contents.toString('base64')}",`);

        const code = encodeURIComponent(vinylFile.contents);

        const name = `paletools-${vinylFile.path.indexOf('mobile') > - 1 ? 'mobile-' : ''}${VERSION}`;
        transformedFile.contents = Buffer.from(`window.paletools = window.paletools || {};\nwindow.paletools['${name}'] = "${code}";`);
        // 3. pass along transformed file for use in next `pipe()`
        callback(null, transformedFile);
      });
}

gulp.task('deploy', function () {
    fs.writeFileSync("d:\\code\\eallegretta.github.io\\fifa\\version.txt", VERSION);

    gulp.src(['./dist/paletools-mobile*.js'])
            .pipe(gulp.dest(`d:\\code\\eallegretta.github.io\\fifa\\dist\\${VERSION}\\`));

    gulp.src(['./dist/paletools-mobile.prod.js'])
            .pipe(base64Encode(getJsCode))
            .pipe(gulp.dest(`d:\\code\\eallegretta.github.io\\fifa\\dist\\${VERSION}\\mobile\\`));

    return gulp.src(['./dist/paletools.prod.js'])
            .pipe(base64Encode(getJsCode))
            .pipe(gulp.dest(`d:\\code\\eallegretta.github.io\\fifa\\dist\\${VERSION}\\`));
});