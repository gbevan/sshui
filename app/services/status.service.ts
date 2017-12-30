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

  constructor (connected: boolean = false, active: boolean = false) {
    this.connected = connected;
    this.active = active;
  }

  set(key: string, value: any) {
    this[key] = value;
  }
}

export class Statuses {
  [key: string]: Status
}

@Injectable()
export class StatusService {
  private statuses: Statuses = {};

  private emitter: any = EventEmitter;
  private changed: Observable<Status>;

  constructor() {
    debug('in constructor');
    this.emitter = new EventEmitter();
    this.changed = Observable.fromEvent(this.emitter, 'changed');
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

    this.emitter.emit('change', this.statuses[id]);

    debug('status id:', id, this.statuses[id]);
    return this.statuses[id];
  }

  get(id: string) {
    return this.statuses[id];
  }

  delete(id: string) {
    debug('delete id:', id);
    this.emitter.emit('change', id);
    delete this.statuses[id];
  }

  subscribe(value: (v: Status) => void, error?: any): any {
    return this.changed.subscribe(value, error);
  }
}
