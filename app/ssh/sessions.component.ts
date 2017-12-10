import { Component,
         OnInit }             from '@angular/core';
import { MatTableDataSource,
         MatDialog }          from '@angular/material';

import { Connect }            from './connect.class';
import { SessionsService }    from '../services/sessions.service';
import { SessionAddDialog }   from './session-add.dialog';

const html = require('./sessions.template.html');
const css = require('./sessions.css');

@Component({
  selector: 'sessions',
  template: html,
  styles: [css]
})
export class SessionsComponent implements OnInit {
//  private sessions: Connect[] = [];
  private tableSource: MatTableDataSource<Connect>;
  private displayedColumns: string[] = [
//    'id',
    'name',
    'host',
    'port',
    'user',
    'persistent',
    'edit',
    'delete'
  ];

  constructor(
    private sessionsService: SessionsService,
    public dialog: MatDialog
  ) {
//    this.sessions.push(new Connect(
////      1,
//      'home',
//      '127.0.0.1',
//      22,
//      'bev'
//    ));
//
//    this.tableSource = new MatTableDataSource<Connect>(this.sessions);
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    const sessions: any = this.sessionsService.find();
    console.log('sessions:', sessions);
    this.tableSource = new MatTableDataSource<Connect>(sessions);
  }

  addSession() {
    console.log('addSession clicked');
    this.dialog.open(SessionAddDialog, {

    })
    .afterClosed()
    .subscribe((res) => {
      console.log('dialog result:', res);
      this.refresh();
    });
  }

  delSession(e: any) {
    console.log('delSession e:', e);
    this.sessionsService
    .remove(e.id);

    this.refresh();
  }
}
