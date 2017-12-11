import { Component,
         Inject }           from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }  from '@angular/material';

import { CredentialsService }  from '../../services/credentials.service';

const html = require('./credential-add.template.html');
const css = require('./credential-add.css');

@Component({
  selector: 'credential-add-dialog',
  template: html,
  styles: [css]
})
export class CredentialAddDialog {
  private name: string = '';
  private host: string = '';
  private port: number = 22;
  private user: string = `${process.env.USER}`;
  private pass: string = '';
  private persistent: boolean = false;

  private _db: any;

  constructor(
    private credentialsService: CredentialsService,
    public dialogRef: MatDialogRef<CredentialAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  submit() {
    console.log('in submit()');
    this.credentialsService.create({
      name: this.name,
      user: this.user,
      pass: this.pass
    });

    this.dialogRef.close();
  }
}
