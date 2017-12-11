import { Component,
         Inject,
         OnInit }           from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }  from '@angular/material';

import { SessionsService }  from '../../services/sessions.service';
import { CredentialsService }  from '../../services/credentials.service';

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
    if (data.session) {
      this.session = data.session;
    }
  }

  ngOnInit() {
    this.creds = this.credentialsService.find();
  }

  submit() {
    console.log('in submit()');
    if (this.session.id) {
      this.sessionsService.patch(this.session.id, this.session);
    } else {
      this.sessionsService.create(this.session);
    }

    this.dialogRef.close();
  }
}
