process.stdout.write('APP COMPONENT\n');

// tell debug to treat as browser - enable using: DEBUG="sshui:*" gulp
//(process as any).type = 'renderer';
const debug = require('debug').debug('sshui:app');

//console.error = (...args: any[]) => {
//  debug('UncaughtError:', ...args);
////  process.stderr.write((new Error('stack')).stack);
//};

import { Component,
         ViewContainerRef } from '@angular/core';
import { MatDialog,
         MatDialogRef,
         MatDialogConfig }  from '@angular/material';

import { CliService }   from './services/cli.service';
import { LowdbService }   from './services/lowdb.service';

const html = require('./app.template.html');
const css = require('./app.css');

//process.on('uncaughtException', (e) => {
//  console.error('uncaughtException:', e);
//  process.stderr.write('uncaughtException:' + e.message);
//  alert('halt');
//});

@Component({
  selector: 'sshui',
  template: html,
  styles: [css]
})
export class AppComponent {
  title = 'SSH UI';
  config: MatDialogConfig;
  private section: string = 'manage';

  constructor(
    private cliService: CliService,
    private lowdbService: LowdbService
  ) {
    process.stderr.write('********************************* HERE\n');
  }

  show(section: string) {
    this.section = section;
  }

}
