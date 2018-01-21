import { Component,
         Inject }             from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }    from '@angular/material';

import { KnownHostsService }  from '../../services/known-hosts.service';

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
    private knownHostsService: KnownHostsService,
    public dialogRef: MatDialogRef<KnownHostsAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  accept() {
    debug('accept clicked');

    this.knownHostsService
    .create({
      host: this.data.host,
      host_key: this.data.host_keyObj.keyBase64
    });

    this.dialogRef.close({added: true});
  }

}
