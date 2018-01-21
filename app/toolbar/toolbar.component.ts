import { Component,
         Output,
         EventEmitter }         from '@angular/core';
import { MatDialog }            from '@angular/material';

import { ChangeVaultPwDialog }  from './change-vault-pw.dialog';
import { SettingsDialog }       from './settings.dialog';
import { AboutDialog }          from './about.dialog';

import { LowdbService }         from '../services/lowdb.service';

const debug = require('debug').debug('sshui:component:toolbar');

const html = require('./toolbar.template.html');
const css = require('./toolbar.css');
const pkg = require('../../package.json');

@Component({
  selector: 'toolbar',
  template: html,
  styles: [css]
})
export class ToolbarComponent {
  @Output() section = new EventEmitter<string>();
  private pkg_version: string = '';

  constructor(
    private lowdbServices: LowdbService,
    public dialog: MatDialog
  ) {
    this.pkg_version = pkg.version;
  }

  show(section: string) {
    this.section.emit(section);
  }

  lock() {
//    this.lowdbServices.set('');
    this.lowdbServices.lock();
  }

  changeVaultPw() {
    debug('changeVaultPw clicked');

    this.dialog.open(ChangeVaultPwDialog, {

//    })
//    .afterClosed()
//    .subscribe((res) => {
//      this.refresh();
    });
  }

  settings() {
    debug('settings clicked');
    this.dialog.open(SettingsDialog, {

//    })
//    .afterClosed()
//    .subscribe((res) => {
//      this.refresh();
    });
  }

  about() {
    debug('about clicked');
    this.dialog.open(AboutDialog, {});
  }
}
