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
         ViewChild }         from '@angular/core';
import { MatTableDataSource,
         MatPaginator,
         MatSort,
         MatDialog }         from '@angular/material';

import { KnownHostsService } from '../../services/known-hosts.service';

const debug = require('debug').debug('sshui:component:known-hosts');

const html = require('./known-hosts.template.html');
const css = require('./known-hosts.css');

@Component({
  selector: 'known-hosts',
  template: html,
  styles: [css]
})
export class KnownHostsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private tableSource: MatTableDataSource<any>;
  private displayedColumns: string[] = [
//    'id',
    'host',
    'host_key',

    'delete'
  ];

  constructor(
    private knownHostsService: KnownHostsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    debug('refresh');
    this.knownHostsService.subscribe((val: boolean, err: Error) => {
      const knownHosts: any = this.knownHostsService.find();
      debug('known-hosts:', knownHosts);
      this.tableSource = new MatTableDataSource<any>(knownHosts);
      this.tableSource.paginator = this.paginator;
      this.tableSource.sort = this.sort;
      debug('after subscribe event refresh');
    });
  }

  applyFilter(filterValue: string) {
    this.tableSource.filter = filterValue.trim().toLowerCase();
  }

  delKnownHost(e: any) {
    this.knownHostsService
    .remove(e.id);

//    this.refresh();
  }
}
