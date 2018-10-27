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
         AfterViewInit,
         ChangeDetectorRef,
         ViewChild }              from '@angular/core';
import { MatTableDataSource,
         MatPaginator,
         MatSort,
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private tableSource: MatTableDataSource<any>;
  private displayedColumns: string[] = [
//    'id',
    'name',
    'host',
    'port',
    'cred',
    // 'persistent',
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
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
    // this.recoverPersistentSessions();
  }

  applyFilter(filterValue: string) {
    this.tableSource.filter = filterValue.trim().toLowerCase();
  }

  addSession() {
    this.dialog.open(SessionAddDialog, {

    })
    .afterClosed()
    .subscribe((res) => {
      if (res) {
        this.statusService.set(res.id, null, null);
        this.refresh();
      }
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

  // toggleState(session: any) {
  toggleState(id: string) {
    debug('toggleState id:', id);
    const session = this.sessionsService.get(id);
    debug('toggleState session:', session);
    debug('active:', session.active);

    const status = this.statusService.get(id);
    debug('status:', status);
    if (!session.active || !status || !status.connected) {
      this.activeSessionsService.start(session);
      this.statusService.set(session.id, 'active', true);
    } else {
      this.statusService.set(session.id, 'active', false);
      this.activeSessionsService.stop(session);
    }

    // TODO: find a better way to do this, maybe a once() event for status? or Observable from StatusService
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1000);
  }

  // persistent is currently disabled in template until xterm fix
  recoverPersistentSessions() {
    debug('recoverPersistentSessions sessions:', this.sessions);
    this.sessions.forEach((s: any) => {
      s.active = false;
      const st = this.statusService.get(s.id);
      if (st) {
        debug(`active:${st.active}`);
      }

      if (s.persistent && (!st || !st.active || (st.active && !st.connected))) {
      // if (st && st.active && !st.connected) {
        debug('s active recover');
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
