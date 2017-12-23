import { Injectable } from '@angular/core';

import * as _ from 'lodash';

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

@Injectable()
export class StatusService {
  private statuses: {
    [key: string]: Status
  } = {};

  // TODO: do we need to add type: 'local','remote','session' to key?

  set(id: string, key: string, value: any) {
//    debug(`status set ${id} ${key} to ${value}`);
    if (!this.statuses[id]) {
      this.statuses[id] = new Status();
    }
    if (key !== undefined && value !== undefined) {
      this.statuses[id].set(key, value);
    }
    return this.statuses[id];
  }

  get(id: string) {
    return this.statuses[id];
  }

  delete(id: string) {
    delete this.statuses[id];
  }
}
