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
         OnInit,
         ViewChild }            from '@angular/core';
import { MatTableDataSource,
         MatPaginator,
         MatSort,
         MatDialog }            from '@angular/material';

import { CredentialsService }   from '../../services/credentials.service';
import { CredentialAddDialog }  from './credential-add.dialog';

const debug = require('debug').debug('sshui:component:credentials');

const html = require('./credentials.template.html');
const css = require('./credentials.css');

@Component({
  selector: 'credentials',
  template: html,
  styles: [css]
})
export class CredentialsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    debug('refresh');
    const credentials: any = this.credentialsService.find();
    this.tableSource = new MatTableDataSource<any>(credentials);
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
    debug('after refresh');
  }

  applyFilter(filterValue: string) {
    this.tableSource.filter = filterValue.trim().toLowerCase();
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
