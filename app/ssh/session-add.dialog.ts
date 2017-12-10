import { Component,
         Inject }           from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }  from '@angular/material';

import { SessionsService }  from '../services/sessions.service';

const html = require('./session-add.template.html');
const css = require('./session-add.css');

@Component({
  selector: 'session-add-dialog',
  template: html,
  styles: [css]
})
export class SessionAddDialog {
  private name: string = '';
  private host: string = '';
  private port: number = 22;
  private user: string = `${process.env.USER}`;
  private pass: string = '';
  private persistent: boolean = false;

  private _db: any;

  constructor(
    private sessionsService: SessionsService,
    public dialogRef: MatDialogRef<SessionAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  submit() {
    console.log('in submit()');
    this.sessionsService.create({
      name: this.name,
      host: this.host,
      port: this.port,
      user: this.user,
      pass: this.pass,
      persistent: this.persistent
    });

    this.dialogRef.close();
  }
}
