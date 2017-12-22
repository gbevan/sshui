import { Component,
         Output,
         EventEmitter } from '@angular/core';
import { MatDialog }    from '@angular/material';

import { ChangeVaultPwDialog } from './change-vault-pw.dialog';

import { LowdbService } from '../services/lowdb.service';

const debug = require('debug').debug('sshui:component:toolbar');

const html = require('./toolbar.template.html');
const css = require('./toolbar.css');

@Component({
  selector: 'toolbar',
  template: html,
  styles: [css]
})
export class ToolbarComponent {
  @Output() section = new EventEmitter<string>();

  constructor(
    private lowdbServices: LowdbService,
    public dialog: MatDialog
  ) {}

  show(section: string) {
    this.section.emit(section);
  }

  lock() {
    this.lowdbServices.set('');
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
}
