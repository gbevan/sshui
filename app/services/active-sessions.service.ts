import { Injectable } from '@angular/core';
import { Observable,
         Observer }   from '@reactivex/rxjs';

const debug = require('debug').debug('sshui:service:active-sessions');

@Injectable()
export class ActiveSessionsService {
  private activeSessions: Observable<any>;
  private activeSessionsObserver: Observer<any>;

  constructor() {
    this.activeSessions = new Observable((observer) => {
      observer.next({});  // initial state

      this.activeSessionsObserver = observer;
    });
  }

  start(session: any) {
    this.activeSessions[session.name] = session;
    session.active = true;

    this.activeSessionsObserver.next(
      this.activeSessions
    );
  }

  stop(session: any) {
    session.conn.end();
    delete this.activeSessions[session.name];
    session.active = false;

    this.activeSessionsObserver.next(
      this.activeSessions
    );
  }

  subscribe(value: any, error?: any) {
    this.activeSessions.subscribe(value, error);
  }
}
