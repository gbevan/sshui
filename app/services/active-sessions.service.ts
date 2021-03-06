/*
    Copyright 2017-2018 Graham Lee Bevan <graham.bevan@ntlworld.com>

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

import { Injectable }     from '@angular/core';
import { Observable,
         Observer,
         Subscription }   from '@reactivex/rxjs';

import { Status,
         StatusService }  from './status.service';

const _ = require('lodash');
const debug = require('debug').debug('sshui:service:active-sessions');

@Injectable()
export class ActiveSessionsService {
  private activeSessions: Observable<any>;
  private activeSessionsObserver: Observer<any>;

  constructor(
    private statusService: StatusService,
  ) {
    this.activeSessions = new Observable((observer) => {
      observer.next({});  // initial state

      this.activeSessionsObserver = observer;
    });
  }

  start(session: any) {
    debug('start() session:', session);
    this.activeSessions[session.name] = session;
    session.active = true;
    debug('start this.activeSessions:', _.cloneDeep(this.activeSessions));

    this.activeSessionsObserver.next(
      this.activeSessions
    );
  }

  stop(session: any) {
    debug('stop() session:', session);
    const st: Status = this.statusService.get(session.id);
    const conn = st.conn;
    if (st.conn) {
      st.conn.end();
    }
    delete this.activeSessions[session.name];
    session.active = false;
    debug('stop this.activeSessions:', _.cloneDeep(this.activeSessions));

    this.activeSessionsObserver.next(
      this.activeSessions
    );
  }

  subscribe(value: any, error?: any): Subscription {
    return this.activeSessions.subscribe(value, error);
  }
}
