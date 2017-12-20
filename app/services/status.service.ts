import { Injectable } from '@angular/core';

import * as _ from 'lodash';

export class Status {
  public connected: boolean;
  public active: boolean;

  constructor (connected: boolean = false, active: boolean = false) {
    this.connected = connected;
    this.active = active;
  }

  set(key: string, value: any) {
    this[key] = value;
    console.log('Status internal:', this);
  }
}

@Injectable()
export class StatusService {
  private statuses: {
    [key: string]: Status
  } = {};

//  constructor(
//  ) {}

  // TODO: do we need to add type: 'local','remote','session' to key?

  set(id: string, key: string, value: any) {
    console.log(`status set ${id} ${key} to ${value}`);
    if (!this.statuses[id]) {
      this.statuses[id] = new Status();
    }
//    _.mixin(this.statuses[id], status);
    if (key !== undefined && value !== undefined) {
      this.statuses[id].set(key, value);
    }
    console.log('statuses:', _.cloneDeep(this.statuses));
//    this.cdr.detectChanges();
    return this.statuses[id];
  }

  get(id: string) {
    return this.statuses[id];
  }

  delete(id: string) {
    delete this.statuses[id];
  }
}
