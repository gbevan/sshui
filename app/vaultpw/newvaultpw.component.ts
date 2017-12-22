import { Component }    from '@angular/core';
import { NgModel }      from '@angular/forms';

import { LowdbService } from '../services/lowdb.service';

const debug = require('debug').debug('sshui:component:vaultpw');

const html = require('./newvaultpw.template.html');
const css = require('./newvaultpw.css');

@Component({
  selector: 'newvaultpw',
  template: html,
  styles: [css]
})
export class NewVaultPwComponent {
  private vaultpw: string = '';
  private vaultpw2: string = '';
  private errmsg: string = '';

  constructor(
    private lowdbService: LowdbService
  ) {}

  validate(vaultPw2: NgModel) {
    debug('validate vaultPw2 errors:', vaultPw2.errors);

    if (!vaultPw2.errors) {
      if (this.vaultpw !== this.vaultpw2) {
        debug('missmatch');
        vaultPw2.control.setErrors({
          dontMatch: true
        });
      }
    }

    return false;
  }

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
