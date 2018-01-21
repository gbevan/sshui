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
//    debug('validate vaultPw2 errors:', vaultPw2.errors);

    if (!vaultPw2.errors) {
      if (this.vaultpw !== this.vaultpw2) {
//        debug('missmatch');
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
