import { Injectable }         from '@angular/core';

import { LowdbService }       from './lowdb.service';
import { CredentialsService } from './credentials.service';

const debug = require('debug').debug('sshui:service:sessions');

@Injectable()
export class SessionsService {
  private _name: string = 'sessions';
  private _db: any;
  constructor(
    private lowdbServce: LowdbService,
    private credentialsService: CredentialsService
  ) {
    this._db = lowdbServce.getDb();
  }

  public create(data: any) {
    return this._db
    .get(this._name)
    .insert(data)
    .write();
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
    .cloneDeep()  // protect object from map changes
    .map((v: any) => {
      // Join with cred to get name
      const cred = this.resolveCred(v.cred);
      v.credname = cred.name;
      return v;
    })
    .value();
  }

  public remove(id: string, params?: any) {
    if (id) {
      return this._db
      .get(this._name)
      .removeById(id)
      .write();
    } else {
      return this._db
      .get(this._name)
      .remove(params)
      .write();
    }
  }

  public patch(id: string, data: any, params?: any) {
    if (id) {
      return this._db
      .get(this._name)
      .getById(id)
      .assign(data)
      .write();
    } else {
      return this._db
      .get(this._name)
      .filter(params)
      .assign(data)
      .write();
    }
  }

  private resolveCred(id: string) {
    return this.credentialsService
    .get(id);
  }
}
