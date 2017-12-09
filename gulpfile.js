const gulp = require('gulp');
const NwBuilder = require('nw-builder');
const spawn = require('child_process').spawn;
const webpack = require('webpack-stream-fixed');
const config = require('./webpack.config.js');
const gutil = require('gulp-util');
const watch = require('gulp-watch');
const batch = require('gulp-batch');

let nw;
let cp;

// Webpack does its own watching, see weback.config.js
gulp.task('webpack', function () {
  // delay to let gulp start up the app
  setTimeout(function () {
  gulp.src('app/main.ts')
  .pipe(
    webpack(config, require('webpack'))
    .on('error', function (err) {
      gutil.log('WEBPACK ERROR:', err);
//      if (cp) {
//        console.log('killing partout');
//        cp.kill();
//      }
      this.emit('end');
    })
  )
  .pipe(gulp.dest('dist'));
  }, 3000);
});


gulp.task('build', (done) => {
  nw = new NwBuilder({
    files: [
      './package.json',
      './index.html',
      './styles.css',
      'lib/**',
      'dist/**',
      'node_modules/zone.js/dist/**',
      'node_modules/reflect-metadata/**',
      'node_modules/hammerjs/hammer.min.js',
      'node_modules/@angular/material/prebuilt-themes/**'
    ],
    platforms: ['linux64'],
    version: 'latest',
    forceDownload: false
  });

  // Log stuff you want
  nw.on('log',  console.log);

  nw.build()
  .then(() => {
    console.log('built!');
    done();
  })
  .catch(function (err) {
    console.error(err);
    done(err);
  });
});

gulp.task('run', ['build'], (done) => {
  cp = spawn('build/sshui/linux64/sshui', {
    stdio: 'inherit'
  });

  cp.on('close', (rc) => {
    console.log('run completed with rc:', rc);
  });
  done();
});

gulp.task('chain', ['build', 'run']);

gulp.task('watch', function () {
  watch([
    'dist/**',
    'lib/**',
    'index.html',
    'styles.css'
  ], {
    ignoreInitial: false,
    verbose: true,
    readDelay: 2000 // filter duplicate changed events from Brackets
  }, batch(function (events, done) {
    console.log('watch triggered');
    if (cp) {
      console.log('killing sshui');
      cp.kill();
    }
    gulp.start('chain', done);
  }));
});

gulp.task('default', ['watch', 'webpack']);
