import { Injectable } from '@angular/core';
import { Observable,
         Observer }   from '@reactivex/rxjs';

//const console.log = require('console.log').console.log('sshui:service:active-sessions');

@Injectable()
export class ActiveSessionsService {
  private activeSessions: Observable<any>;
  private activeSessionsObserver: Observer<any>;

  constructor() {
    console.log('active-sessions constructor');

    this.activeSessions = new Observable((observer) => {
      console.log('active-sessions observer:', observer);
      observer.next({});  // initial state

      this.activeSessionsObserver = observer;
      console.log('active-sessions activeSessionsObserver is set');
    });

    console.log('active-sessions after constructor:', this.activeSessions);
  }

  start(session: any) {
    console.log('starting session:', session.name);
    this.activeSessions[session.name] = session;
    session.active = true;

    this.activeSessionsObserver.next(
      this.activeSessions
    );
  }

  stop(session: any) {
    console.log('stopping session:', session.name);
    console.log('session conn:', session.conn);
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
