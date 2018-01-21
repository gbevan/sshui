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

import { Component,
         Inject,
         OnInit }           from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }  from '@angular/material';

import { SessionsService }  from '../../services/sessions.service';
import { CredentialsService }  from '../../services/credentials.service';

const debug = require('debug').debug('sshui:dialog:session-add');

const html = require('./session-add.template.html');
const css = require('./session-add.css');

@Component({
  selector: 'session-add-dialog',
  template: html,
  styles: [css]
})
export class SessionAddDialog implements OnInit {
  private session: any = {
    name: '',
    host: '',
    port: 22,
    cred: '',
    persistent: false
  };

  private _db: any;

  private creds: any[] = [];

  constructor(
    private sessionsService: SessionsService,
    private credentialsService: CredentialsService,
    public dialogRef: MatDialogRef<SessionAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.session) {
      this.session = data.session;
    }
  }

  ngOnInit() {
    this.creds = this.credentialsService.find();
  }

  submit() {
    if (this.session.id) {
      this.sessionsService.patch(this.session.id, this.session);
    } else {
      this.sessionsService.create(this.session);
    }

    this.dialogRef.close(this.session);
  }
}
