/*

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
