import { Component }      from '@angular/core';
import { NgModel }        from '@angular/forms';

import { MatDialogRef }   from '@angular/material';

import { LowdbService } from '../services/lowdb.service';

import * as _         from 'lodash';

const debug = require('debug').debug('sshui:dialog:change-vault-pw');

const html = require('./change-vault-pw.template.html');
const css = require('./change-vault-pw.css');

@Component({
  selector: 'change-vault-pw-dialog',
  template: html,
  styles: [css]
})
export class ChangeVaultPwDialog {
  private current_pw: string = '';
  private new_pw_1: string = '';
  private new_pw_2: string = '';

  private currentPw: any;

  private errmsg: string = '';

  constructor(
    private lowdbService: LowdbService,
    public dialogRef: MatDialogRef<ChangeVaultPwDialog>
  ) {}

  validate(newPw2: NgModel) {
    if (!newPw2.errors) {
      if (this.new_pw_1 !== this.new_pw_2) {
        newPw2.control.setErrors({
          dontMatch: true
        });
      }
    }
    return false;
  }

  submit() {
    const err = this.lowdbService.changePw(this.current_pw, this.new_pw_1);
    debug('change pw err:', err);
    if (err) {
      this.errmsg = err.message;
    } else {
      this.dialogRef.close();
    }
  }
}
