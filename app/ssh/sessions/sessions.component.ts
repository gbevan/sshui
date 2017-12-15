import { Component,
         OnInit }             from '@angular/core';
import { MatTableDataSource,
         MatDialog }          from '@angular/material';

//import { Connect }            from './connect.class';
import { SessionsService }    from '../../services/sessions.service';
import { SessionAddDialog }   from './session-add.dialog';

import { ActiveSessionsService } from '../../services/active-sessions.service';

const html = require('./sessions.template.html');
const css = require('./sessions.css');

@Component({
  selector: 'sessions',
  template: html,
  styles: [css]
})
export class SessionsComponent implements OnInit {
//  private sessions: Connect[] = [];
  private tableSource: MatTableDataSource<any>;
  private displayedColumns: string[] = [
//    'id',
    'name',
    'host',
    'port',
    'cred',
    'persistent',
    'connected',
    'edit',
    'delete'
  ];

  constructor(
    private activeSessionsService: ActiveSessionsService,
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
    this.tableSource = new MatTableDataSource<any>(sessions);
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

  editSession(session: any) {
    console.log('editSession clicked');
    this.dialog.open(SessionAddDialog, {
      data: {
        session
      }
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

  toggleState(session: any) {
    console.log('toggleState() session:', session);
    if (session.active) {
      this.activeSessionsService.stop(session);
    } else {
      this.activeSessionsService.start(session);
    }
  }
}
