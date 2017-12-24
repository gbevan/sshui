import { Component,
         Inject,
         OnInit }           from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }  from '@angular/material';

import { LocalTunnelsService }  from '../../services/local-tunnels.service';
import { CredentialsService }  from '../../services/credentials.service';

const debug = require('debug').debug('sshui:dialog:local-tunnel-add');

const html = require('./local-tunnel-add.template.html');
const css = require('./local-tunnel-add.css');

@Component({
  selector: 'localTunnel-add-dialog',
  template: html,
  styles: [css]
})
export class LocalTunnelAddDialog implements OnInit {
  private localTunnel: any = {
    name: '',
    host: '',
    port: 22,
    cred: '',
    persistent: false,
    localHost: '127.0.0.1',
    localPort: '',
    remoteHost: '',
    remotePort: ''
  };

  private _db: any;

  private creds: any[] = [];

  constructor(
    private localTunnelsService: LocalTunnelsService,
    private credentialsService: CredentialsService,
    public dialogRef: MatDialogRef<LocalTunnelAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.localTunnel) {
      this.localTunnel = data.localTunnel;
    }
  }

  ngOnInit() {
    this.creds = this.credentialsService.find();
  }

  submit() {
    if (this.localTunnel.id) {
      this.localTunnelsService.patch(this.localTunnel.id, this.localTunnel);
    } else {
      this.localTunnelsService.create(this.localTunnel);
    }

    this.dialogRef.close(this.localTunnel);
  }
}
