import { Component,
         OnInit }             from '@angular/core';
import { MatTableDataSource,
         MatDialog }          from '@angular/material';

import { CredentialsService } from '../../services/credentials.service';
import { CredentialAddDialog }   from './credential-add.dialog';

const html = require('./credentials.template.html');
const css = require('./credentials.css');

@Component({
  selector: 'credentials',
  template: html,
  styles: [css]
})
export class CredentialsComponent implements OnInit {
//  private credentials: Connect[] = [];
  private tableSource: MatTableDataSource<any>;
  private displayedColumns: string[] = [
//    'id',
    'name',
    'user',
    'pass',
    'privKey',

    'edit',
    'delete'
  ];

  constructor(
    private credentialsService: CredentialsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    const credentials: any = this.credentialsService.find();
    console.log('credentials:', credentials);
    this.tableSource = new MatTableDataSource<any>(credentials);
  }

  addCredential() {
    console.log('addCredential clicked');
    this.dialog.open(CredentialAddDialog, {

    })
    .afterClosed()
    .subscribe((res) => {
      console.log('dialog result:', res);
      this.refresh();
    });
  }

  editCredential(credential: any) {
    console.log('editCredential clicked');
    this.dialog.open(CredentialAddDialog, {
      data: {
        credential
      }
    })
    .afterClosed()
    .subscribe((res) => {
      console.log('dialog result:', res);
      this.refresh();
    });
  }

  delCredential(e: any) {
    console.log('delCredential e:', e);
    this.credentialsService
    .remove(e.id);

    this.refresh();
  }
}
