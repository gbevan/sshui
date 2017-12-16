import { Component,
         OnInit,
         AfterViewInit,
         ChangeDetectorRef }  from '@angular/core';
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
export class SessionsComponent implements OnInit, AfterViewInit {
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
  private sessions: any = [];

  constructor(
    private activeSessionsService: ActiveSessionsService,
    private sessionsService: SessionsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.refresh();
  }

  ngAfterViewInit() {
    this.recoverPersistentSessions();
    this.cdr.detectChanges();
  }

  refresh() {
    this.sessions = this.sessionsService.find();
    console.log('sessions:', this.sessions);
    this.tableSource = new MatTableDataSource<any>(this.sessions);
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
    // TODO: prompt dialog ok/cancel
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

  recoverPersistentSessions() {
    console.log('recoverPersistentSessions');
    this.sessions.forEach((s: any) => {
      if (s.persistent) {
        this.activeSessionsService.start(s);
      }
    });
  }
}
