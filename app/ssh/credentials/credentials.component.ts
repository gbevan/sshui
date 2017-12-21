import { Component,
         OnInit }             from '@angular/core';
import { MatTableDataSource,
         MatDialog }          from '@angular/material';

import { CredentialsService } from '../../services/credentials.service';
import { CredentialAddDialog }   from './credential-add.dialog';

const debug = require('debug').debug('sshui:component:credentials');

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
    this.tableSource = new MatTableDataSource<any>(credentials);
  }

  addCredential() {
    this.dialog.open(CredentialAddDialog, {

    })
    .afterClosed()
    .subscribe((res) => {
      this.refresh();
    });
  }

  editCredential(credential: any) {
    this.dialog.open(CredentialAddDialog, {
      data: {
        credential
      }
    })
    .afterClosed()
    .subscribe((res) => {
      this.refresh();
    });
  }

  delCredential(e: any) {
    this.credentialsService
    .remove(e.id);

    this.refresh();
  }
}
