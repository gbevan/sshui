const gulp = require('gulp');
const NwBuilder = require('nw-builder');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const webpack = require('webpack-stream-fixed');
const config = require('./webpack.config.js');
const pkg = require('./package.json');
const gutil = require('gulp-util');
const watch = require('gulp-watch');
const batch = require('gulp-batch');

const nwFiles = [
  './package.json',
  './index.html',
  './styles.css',
  'lib/**',
  'dist/**',
  'node_modules/zone.js/dist/**',
  'node_modules/reflect-metadata/**',
  'node_modules/hammerjs/hammer.min.js',
  'node_modules/@angular/material/prebuilt-themes/**',
  'node_modules/xterm/dist/xterm.css',
  'node_modules/font-awesome/**'
];

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
        this.emit('end');
      })
    )
    .pipe(gulp.dest('dist'));
  }, 5000);
});

// Webpack release, one-shot without watching
gulp.task('webpackrel', function (done) {
  config.watch = false;
  gulp.src('app/main.ts')
  .pipe(
    webpack(config, require('webpack'))
    .on('error', function (err) {
      gutil.log('WEBPACK ERROR:', err);
      this.emit('end');
      done(err);
    })
  )
  .pipe(gulp.dest('dist'))
  .on('end', done);
});

// Build dev instance on linux
gulp.task('build', (done) => {
  nw = new NwBuilder({
    files: nwFiles,
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

// Build releases
gulp.task('buildall', ['webpackrel'], (done) => {
  nw = new NwBuilder({
    files: nwFiles,
    platforms: ['linux64', 'win64', 'osx64'],
    version: 'latest',
    forceDownload: false,
    buildType: 'versioned',
    buildDir: './release',
    flavor: 'normal'
  });

  // Log stuff you want
  nw.on('log',  console.log);

  nw.build()
  .then(() => {
    console.log('built! - zipping...');

    // zip linux64
    exec(`cd "release/${pkg.name} - v${pkg.version}/linux64" && zip -r ../${pkg.name}-${pkg.version}-linux64.zip .`, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return done(err);
      }

      // zip win64
      exec(`cd "release/${pkg.name} - v${pkg.version}/win64" && zip -r ../${pkg.name}-${pkg.version}-win64.zip .`, (err, stdout, stderr) => {
        if (err) {
          console.error(stderr);
          return done(err);
        }

        // zip osx64
        exec(`cd "release/${pkg.name} - v${pkg.version}/osx64" && zip -r ../${pkg.name}-${pkg.version}-osx64.zip .`, (err, stdout, stderr) => {
          if (err) {
            console.error(stderr);
            return done(err);
          }
          done();
        });
      });
    });

  })
  .catch(function (err) {
    console.error(err);
    done(err);
  });
});

gulp.task('release', ['webpackrel', 'buildall']);

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
    readDelay: 5000 // filter duplicate changed events from Brackets
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
