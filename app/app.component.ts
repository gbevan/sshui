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
  ) {}

  show(section: string) {
    this.section = section;
  }

}
