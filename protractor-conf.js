/*global browser */

var path = require('path');
const nwpath = require('nw').findpath()
console.log('nwpath:', nwpath);

var baseFile = __dirname + '/index.html';
console.log('baseFile:', baseFile);

exports.config = {
  directConnect: true,
  chromeDriver: 'build/sshui/linux64/chromedriver',
  chromeOnly: true,

  specs: [
    'app/app.e2e_spec.js',
    'app/*/**/*.e2e_spec.js'
  ],

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      binary: nwpath,
      args: [
        'nwapp=' + path.resolve('.'),
//        'enable-logging=stderr',
//        'v=1',
//        'log-level=0',
//        'remote-debugging-port=9222',
//        'inspect'
      ]
    },
  },

  framework: 'jasmine',
  baseUrl: '/',
  rootElement: 'html',

  onPrepare: function() {
//    browser.resetUrl = '';

//    browser.ignoreSynchronization = false;
    browser.waitForAngularEnabled(false);
  },

  getPageTimeout: 150000,
  allScriptsTimeout: 150000,
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 150000
  }
};
