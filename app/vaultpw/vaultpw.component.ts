import { Component } from '@angular/core';

import { LowdbService }   from '../services/lowdb.service';

const debug = require('debug').debug('sshui:component:vaultpw');

const html = require('./vaultpw.template.html');
const css = require('./vaultpw.css');

@Component({
  selector: 'vaultpw',
  template: html,
  styles: [css]
})
export class VaultPwComponent {
  private vaultpw: string = '';
  private errmsg: string = '';

  constructor(
    private lowdbService: LowdbService
  ) {}

  submit() {
    this.errmsg = '';

    const err = this.lowdbService.set(this.vaultpw);
    this.vaultpw = '';

    debug('vault err:', err);
    if (err) {
      this.errmsg = err.message;
    }
  }
}
