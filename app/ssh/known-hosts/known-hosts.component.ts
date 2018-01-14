import { Component,
         OnInit }            from '@angular/core';
import { MatTableDataSource,
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
      debug('after subscribe event refresh');
    });
  }

  delKnownHost(e: any) {
    this.knownHostsService
    .remove(e.id);

//    this.refresh();
  }
}
