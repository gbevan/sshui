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
    debug('data.localTunnel:', data.localTunnel);
    if (data && data.localTunnel) {
      this.localTunnel = data.localTunnel;
    }
    debug('this.localTunnel:', this.localTunnel);
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
