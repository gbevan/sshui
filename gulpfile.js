const gulp = require('gulp');
const NwBuilder = require('nw-builder');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const fs = require('fs');
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
  '.themes.scss',
  'lib/**',
  'dist/**',
  'node_modules/zone.js/dist/**',
  'node_modules/reflect-metadata/**',
  'node_modules/hammerjs/hammer.min.js',
  'node_modules/@angular/material/prebuilt-themes/**',
  'node_modules/xterm/dist/xterm.css',
  'node_modules/font-awesome/**',
  'node_modules/chart.js/src/chart.js'
];

const SSHUI_DB='/tmp/.sshui_v';

let nw;
let cp;

// Webpack does its own watching, see weback.config.js
gulp.task('webpack', function () {
  // delay to let gulp start up the app
  setTimeout(function () {
    config.mode = 'development';
    gulp.src('app/main.ts')
    .pipe(
      webpack(config, require('webpack'))
      .on('error', function (err) {
        gutil.log('WEBPACK ERROR:', err);
        this.emit('end');
      })
    )
    .pipe(gulp.dest('dist'));
  }, 0);
});

// Webpack release, one-shot without watching
gulp.task('webpackrel', function (done) {
  config.watch = false;
  config.mode = 'production';
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
gulp.task('buildall', (done) => {
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

gulp.task('release', gulp.series('webpackrel', 'buildall'));

//gulp.task('run', ['build'], (done) => {
gulp.task('run', (done) => {
  // try {
  //   // stat = fs.statSync(SSHUI_DB);
  //   fs.unlinkSync(SSHUI_DB)
  // } catch (e) {
  //   console.error('stat error:', e);
  // }
//  cp = spawn('build/sshui/linux64/sshui', {
  const myenv = process.env;
  myenv.DEBUG = 'sshui:*';
  cp = spawn('node_modules/nw/nwjs/nw', ['--nwapp=.', `--db=${SSHUI_DB}`], {
    stdio: 'inherit',
    env: myenv
  });

  cp.on('close', (rc) => {
    console.log('run completed with rc:', rc);
  });
  done();
});

//gulp.task('chain', ['build', 'run']);
gulp.task('killrun', (done) => {
  if (cp) {
    console.log('killing sshui');
    cp.kill();
  }
  done();
});

gulp.task('watcher', function () {
  watch(
    [
      'dist/**',
      'lib/**',
      'index.html',
      'styles.css',
      'themes.scss'
    ], {
      ignoreInitial: true,
      verbose: true,
      readDelay: 5000 // filter duplicate changed events from Brackets
    }, gulp.series('killrun', 'run')
  );
});

gulp.task('watch', gulp.parallel('webpack', 'watcher'));

gulp.task('default', gulp.series('watch'));

gulp.task('_e2e', function (done) {
  const p_cp = spawn('DEBUG="sshui:*" node_modules/protractor/bin/protractor ./protractor-conf.js', {
    shell: true,
    stdio: ['ignore', 'inherit', 'inherit']
  });
  p_cp.on('close', (rc) => {
    console.log('protractor finished rc:', rc);
    if (rc === 0) {
      return done();
    }
    return done(new Error(`Non-zero return code from sshui: ${rc}`))
  })
});
gulp.task('e2e', gulp.series('webpackrel', '_e2e'));

// TODO: fix headless mode to use this...
gulp.task('_watche2e', function () {
  watch([
    'app/**/*.e2e_spec.js',
    'dist/**',
    'lib/**',
    'index.html',
    'styles.css',
    'themes.scss'
  ], {
    ignoreInitial: true,
    verbose: true,
    readDelay: 5000 // filter duplicate changed events from Brackets
  }, batch(function (events, done) {
    console.log('watche2e triggered');
//    console.log('events:', events);
//    if (cp) {
//      console.log('killing sshui');
//      cp.kill();
//    }
//    gulp.start('chain', done);
    gulp.start('e2e', done);
  }));
});
gulp.task('watche2e', gulp.series('_watche2e', 'webpack'));
