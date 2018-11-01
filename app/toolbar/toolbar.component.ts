/*
    Copyright 2017-2018 Graham Lee Bevan <graham.bevan@ntlworld.com>

    This file is part of sshui https://github.com/gbevan/sshui.

    sshui is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    sshui is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
