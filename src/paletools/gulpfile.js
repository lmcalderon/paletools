const gulp = require('gulp');
const through = require('through2');
const path = require('path');
const fs = require("fs");

const VERSION = "23.3.0";

function stringSrc(filename, content) {
    let src = require("stream").Readable({ objectMode: true });
    src._read = function() {
        this.push(new Vinyl({
            cwd: "",
            base: "",
            path: filename,
            contents: Buffer.from(content, "utf-8")
        }));
        this.push(null);
    };

    return src;
}

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
        transformedFile.contents = Buffer.from(`window.paletools = window.paletools || {};\nwindow.paletools['paletools-${VERSION}'] = "${code}";`);
        // 3. pass along transformed file for use in next `pipe()`
        callback(null, transformedFile);
      });
}

gulp.task('deploymobile', function() {
    fs.writeFileSync("d:\\code\\eallegretta.github.io\\fifa\\mobile-version.txt", VERSION);

    return gulp.src(["./dist/paletools-mobile.*.js"])
                .pipe(gulp.dest(`d:\\code\\eallegretta.github.io\\fifa\\dist\\paletools-mobile\\v${VERSION}\\`))
});

gulp.task('deploy', function () {
    fs.writeFileSync("d:\\code\\eallegretta.github.io\\fifa\\version.txt", VERSION);
    return gulp.src(['./dist/paletools.*.js'])
            .pipe(base64Encode(getJsCode))
            .pipe(gulp.dest(`d:\\code\\eallegretta.github.io\\fifa\\paletools-v${VERSION}\\`));
});