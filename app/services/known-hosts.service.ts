import { Injectable }         from '@angular/core';

import { Observable,
         Observer,
         Subscription }   from '@reactivex/rxjs';

import { LowdbService }       from './lowdb.service';
//import { CredentialsService } from './credentials.service';

const debug = require('debug').debug('sshui:service:known-hosts');

@Injectable()
export class KnownHostsService {
  private _name: string = 'knownHosts';
  private _db: any;

  private changed: Observable<any>;
  private changedObserver: Observer<any>;

  constructor(
    private lowdbServce: LowdbService
  ) {
    this._db = lowdbServce.getDb();

    this.changed = new Observable((observer) => {
      observer.next(true);  // initial state

      this.changedObserver = observer;
    });
  }

  public create(data: any) {
    const res = this._db
    .get(this._name)
    .insert(data)
    .write();

    this.changedObserver.next(true);
    return res;
  }

  public get(id: string) {
    return this._db
    .read()
    .get(this._name)
    .getById(id)
    .value();
  }

  public find(params?: any) {
    return this._db
    .read()
    .get(this._name)
    .filter(params)
//    .cloneDeep()  // protect object from map changes
//    .map((v: any) => {
//      // Join with cred to get name
//      const cred = this.resolveCred(v.cred);
//      v.credname = cred.name;
//      return v;
//    })
    .value();
  }

  public remove(id: string, params?: any) {
    let res;
    if (id) {
      res = this._db
      .get(this._name)
      .removeById(id)
      .write();
    } else {
      res = this._db
      .get(this._name)
      .remove(params)
      .write();
    }

    this.changedObserver.next(true);
    return res;
  }

  public patch(id: string, data: any, params?: any) {
    let res;
    if (id) {
      res = this._db
      .get(this._name)
      .getById(id)
      .assign(data)
      .write();
    } else {
      res = this._db
      .get(this._name)
      .filter(params)
      .assign(data)
      .write();
    }

    this.changedObserver.next(true);
    return res;
  }

  subscribe(value: any, error?: any): Subscription {
    return this.changed.subscribe(value, error);
  }

}
