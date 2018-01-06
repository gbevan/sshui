import { Injectable } from '@angular/core';
import { Observable,
         Observer }   from '@reactivex/rxjs';

import * as _ from 'lodash';

const EventEmitter = require('events');

const debug = require('debug').debug('sshui:service:status');

export class Status {
  public connected: boolean;
  public active: boolean;
  public conn: any;
  public server: any;

  public monitorInterval: NodeJS.Timer;
  public lastBytesRead: number;
  public lastBytesWritten: number;
  public intvlBytesRead: number;
  public intvlBytesWritten: number;

  constructor (connected: boolean = false, active: boolean = false) {
    this.connected = connected;
    this.active = active;

    this.lastBytesRead = 0;
    this.lastBytesWritten = 0;
//    this.intvlBytesRead = 0;
//    this.intvlBytesWritten = 0;
  }

  set(key: string, value: any) {
    this[key] = value;
  }
}

export class Statuses {
  [key: string]: Status
}

export class CountsEvent {
  public id: string;
  public datetime: Date;
  public bytesRead: number;
  public bytesWritten: number;

  constructor(id: string, bytesRead: number, bytesWritten: number) {
    this.id = id;
    this.bytesRead = bytesRead;
    this.bytesWritten = bytesWritten;
    this.datetime = new Date();
  }
}

@Injectable()
export class StatusService {
  private statuses: Statuses = {};

  private emitter: any = EventEmitter;
  private changed: Observable<Status>;

//  private countEmitter: any = EventEmitter;
  private counts: Observable<CountsEvent>;

  constructor() {
    debug('in constructor');
    this.emitter = new EventEmitter();
    this.changed = Observable.fromEvent(this.emitter, 'changed');

//    this.countEmitter = new EventEmitter();
    this.counts = Observable.fromEvent(this.emitter, 'counts');
  }

  // TODO: do we need to add type: 'local','remote','session' to key?

  set(id: string, key: string, value: any) {
    debug(`status set ${id} ${key} to ${value}`);
    if (!this.statuses[id]) {
      this.statuses[id] = new Status();
    }
    if (key !== undefined && value !== undefined) {
      this.statuses[id].set(key, value);
    }

    this.emitter.emit('changed', this.statuses[id]);

//    debug('status id:', id, this.statuses[id]);
    return this.statuses[id];
  }

  get(id: string) {
    return this.statuses[id];
  }

  delete(id: string) {
    debug('delete id:', id);
    this.emitter.emit('changed', id);
    delete this.statuses[id];
  }

  incCounts(id: string, bytesRead: number, bytesWritten: number) {
//    debug('incCounts bytesRead:', bytesRead, 'bytesWritten:', bytesWritten);
    const st = this.statuses[id];
    if (!st) {
      return;
    }

    const intvlBytesRead = bytesRead - st.lastBytesRead;
    const intvlBytesWritten = bytesWritten - st.lastBytesWritten;

    st.lastBytesRead = bytesRead;
    st.lastBytesWritten = bytesWritten;

    const countsEvent = new CountsEvent(
      id,
      intvlBytesRead > 0 ? intvlBytesRead : 0,  // handle negatives on tunnel restart
      intvlBytesWritten > 0 ? intvlBytesWritten : 0
    );
//    debug('incCounts emitting event:', countsEvent); // noisey
    this.emitter.emit('counts', countsEvent);
  }

  subscribeChanged(value: (v: Status) => void, error?: any): any {
    return this.changed.subscribe(value, error);
  }

  subscribeCounts(value: (v: CountsEvent) => void, error?: any): any {
    return this.counts.subscribe(value, error);
  }
}
