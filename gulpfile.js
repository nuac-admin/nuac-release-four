var gulp        = require('gulp');
var sass        = require('gulp-sass');
var cleanCSS    = require('gulp-clean-css');
var prefix      = require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var imagemin    = require('gulp-imagemin');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync').create();
var cp          = require('child_process');

var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build',
};

var jsFiles = [
  'assets/js/components/back-to-top.js',
  'assets/js/components/rotate-icon.js',
];
// One-off task to copy font files from source
gulp.task('copy-fa-fonts', function() {
  return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
  .pipe(gulp.dest('./assets/fonts/'));
});
/**
 * Build the Jekyll Site
 */
 gulp.task("jekyll-build", function(done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ["build", "--trace"], { stdio: "inherit" }).on("close", done);
});
  // return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
/**
 * Rebuild Jekyll & do page reload
 */
 gulp.task("jekyll-rebuild", gulp.series("jekyll-build"), function() {
  browserSync.reload();
});
/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds). Also create minified versions for production use.
 */
 gulp.task("sass", function() {
  return gulp
    .src("assets/_scss/styles.scss")
    .pipe(sass())
    .pipe(
      prefix(["last 15 versions", "> 5%", "ie 10", "ie 11"], { cascade: true })
    )
    .pipe(gulp.dest("_site/assets/css"))
    .pipe(gulp.dest("assets/css"))
    .pipe(
      cleanCSS({
        compatibility: "ie9"
      })
    )
    .pipe(rename({ extname: ".min.css" }))
    .pipe(gulp.dest("_site/assets/css"))
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
});
/**
 * Bundle js files together and then created minified versions and publish them to the correct locations.
 */
 gulp.task("bundle-js", function() {
  return gulp
    .src(["assets/js/components/*.js"])
    .pipe(concat("main.js"))
    .pipe(gulp.dest("assets/js"))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest("assets/js"))
    .pipe(browserSync.stream());
});
/**
 * Wait for jekyll-build, then launch the Server
 */
//  gulp.task("browser-sync", gulp.series("sass", "bundle-js", "jekyll-build"), function() {
 gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "_site",
    },
  });
  gulp.watch("assets/_scss/**/*.scss", gulp.series("sass"));
  gulp.watch(["assets/js/**/*.js", "!assets/js/*.min.js", "!assets/js/main.js"], gulp.series("bundle-js"));
  gulp.watch(
    [
      "assets/js/*.js",
      "*.md",
      "*.html",
      "_layouts/*.html",
      "_info/*.html",
      "_info/*.md",
      "news/**/*.md",
      "news/**/*.html",
      "_waters/*.html",
      "_waters/*.md",
      "_includes/*.html",
      "_data/*",
    ],
    gulp.series("jekyll-rebuild")
  );
});
// run "gulp images" to process images from assets/_src_img to /img folder to be used on the site
gulp.task('compress-images', function() {
  return gulp.src('assets/images/_src-images/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [{ removeViewBox: true }],
      })
    )
    .pipe(gulp.dest("assets/images"));
});
/**
 * task to run when building on Netlify (runs all tasks
 * appart from browser-sync)
 */
 gulp.task('netlify-deploy', gulp.series('sass', 'bundle-js'), function(done){
  return cp.spawn('bundle' , ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
      .on('close', done);
});