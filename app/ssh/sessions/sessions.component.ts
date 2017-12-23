import { Component,
         OnInit,
         AfterViewInit,
         ChangeDetectorRef }      from '@angular/core';
import { MatTableDataSource,
         MatDialog }              from '@angular/material';

import { SessionsService }        from '../../services/sessions.service';
import { SessionAddDialog }       from './session-add.dialog';

import { ActiveSessionsService }  from '../../services/active-sessions.service';
import { Status,
         StatusService }          from '../../services/status.service';

const debug = require('debug').debug('sshui:component:sessions');

const html = require('./sessions.template.html');
const css = require('./sessions.css');

@Component({
  selector: 'sessions',
  template: html,
  styles: [css]
})
export class SessionsComponent implements OnInit, AfterViewInit {
  private tableSource: MatTableDataSource<any>;
  private displayedColumns: string[] = [
//    'id',
    'name',
    'host',
    'port',
    'cred',
//    'persistent',
    'connected',
    'edit',
    'delete'
  ];
  private sessions: any = [];
  private status: any = {}; // key by id

  constructor(
    private statusService: StatusService,
    private activeSessionsService: ActiveSessionsService,
    private sessionsService: SessionsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.refresh();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  refresh() {
    debug('refresh');
    this.sessions = this.sessionsService.find();
    this.tableSource = new MatTableDataSource<any>(this.sessions);
    this.recoverPersistentSessions();
  }

  addSession() {
    this.dialog.open(SessionAddDialog, {

    })
    .afterClosed()
    .subscribe((res) => {
      this.statusService.set(res.id, null, null);
      this.refresh();
    });
  }

  editSession(session: any) {
    this.dialog.open(SessionAddDialog, {
      data: {
        session
      }
    })
    .afterClosed()
    .subscribe((res) => {
      this.refresh();
    });
  }

  delSession(e: any) {
    // TODO: prompt dialog ok/cancel
    this.sessionsService
    .remove(e.id);
    this.statusService.delete(e.id);
    this.refresh();
  }

  toggleState(session: any) {
    if (session.active) {
      this.activeSessionsService.stop(session);
      this.statusService.set(session.id, 'active', false);
    } else {
      this.activeSessionsService.start(session);
      this.statusService.set(session.id, 'active', true);
    }

    // TODO: find a better way to do this, maybe a once() event for status? or Observable from StatusService
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1000);
  }

  // Currently disabled in template until xterm fix
  recoverPersistentSessions() {
    this.sessions.forEach((s: any) => {
      const st = this.statusService.get(s.id);
      if (st) {
        debug(`active:${st.active}`);
      }

      if (s.persistent && (!st || !st.active)) {
        debug('s persistent');
        this.activeSessionsService.start(s);
        this.statusService.set(s.id, 'active', true);
      }
    });
    debug('after forEach');
  }

  isActive(id: string) {
    const status = this.statusService.get(id);
    return status && status.active && !status.connected;
  }

  isConnected(id: string) {
    const status = this.statusService.get(id);
    return status && status.connected;
  }

  isNotConnected(id: string) {
    const status = this.statusService.get(id);
    return !status || !status.connected && !status.active;
  }
}
