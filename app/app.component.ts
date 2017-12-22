// tell debug to treat as browser - enable using: DEBUG="sshui:*" gulp
(process as any).type = 'renderer';
const debug = require('debug').debug('sshui:app');

import { Component,
         ViewContainerRef } from '@angular/core';
import { MatDialog,
         MatDialogRef,
         MatDialogConfig }  from '@angular/material';

//import { VaultPwService }   from './services/vaultpw.service';
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
//    private vaultPwService: VaultPwService
    private lowdbService: LowdbService
  ) {}

  show(section: string) {
    this.section = section;
  }

}
