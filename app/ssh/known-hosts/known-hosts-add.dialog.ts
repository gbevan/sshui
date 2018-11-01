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
         Inject }             from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }    from '@angular/material';

const debug = require('debug').debug('sshui:dialog:known-hosts-add');

const html = require('./known-hosts-add.template.html');
const css = require('./known-hosts-add.css');

@Component({
  selector: 'known-hosts-add-dialog',
  template: html,
  styles: [css]
})
export class KnownHostsAddDialog {

  /*
   * data contains:
   *   {
   *     host: host ip or name,
   *     host_keyObj: {
   *       hash: hash as hex,
   *       hashBase64: hash as Base64,
   *       fingerprint: ssh like fingerprint (base64),
   *       key: raw key,
   *       keyBase64: key as Base64,
   *       parsedKey: parsed key as an object (see sshpk)
   *     }
   *   }
   */

  constructor(
    public dialogRef: MatDialogRef<KnownHostsAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  accept() {
    debug('accept clicked');

    this.data.knownHostsService
    .create({
      host: this.data.host,
      host_key: this.data.host_keyObj.keyBase64
    });

    this.dialogRef.close({added: true});
  }

}
