// tell debug to treat as browser - enable using: DEBUG="sshui:*" gulp
(process as any).type = 'renderer';
const debug = require('debug').debug('sshui:app');

import { Component,
         ViewContainerRef } from '@angular/core';
//import { Router }           from '@angular/router';
import { MatDialog,
         MatDialogRef,
         MatDialogConfig }  from '@angular/material';

import { VaultPwService }   from './services/vaultpw.service';

const html = require('./app.template.html');
const css = require('./app.css');

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
    private vaultPwService: VaultPwService
  ) {
    debug('IN APP');
  }

  show(section: string) {
    this.section = section;
  }

}
