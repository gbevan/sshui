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
      host_key: this.data.host_key
    });

    this.dialogRef.close({added: true});
  }

}
