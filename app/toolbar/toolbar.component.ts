import { Component,
         Output,
         EventEmitter } from '@angular/core';
import { MatDialog }    from '@angular/material';

import { ChangeVaultPwDialog } from './change-vault-pw.dialog';

import { VaultPwService } from '../services/vaultpw.service';

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
    private vaultPwService: VaultPwService,
    public dialog: MatDialog
  ) {}

  show(section: string) {
    this.section.emit(section);
  }

  lock() {
    this.vaultPwService.set('');
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
