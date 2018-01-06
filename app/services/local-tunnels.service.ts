import { Injectable } from '@angular/core';

import { LowdbService } from './lowdb.service';
import { CredentialsService } from './credentials.service';

const debug = require('debug').debug('sshui:service:local-tunnels');

@Injectable()
export class LocalTunnelsService {
  private _name: string = 'localTunnels';
//  private _db: any;
  constructor(
    private lowdbServce: LowdbService,
    private credentialsService: CredentialsService
  ) {
  }

  public create(data: any) {
    delete data.active;
    delete data.connected;
    delete data.conn;
    delete data.server;

    const _db = this.lowdbServce.getDb();
    return _db
    .get(this._name)
    .insert(data)
    .write();
  }

  public get(id: string) {
    const _db = this.lowdbServce.getDb();
    return _db
    .read()
    .get(this._name)
    .getById(id)
    .value();
  }

  public find(params?: any) {
    const _db = this.lowdbServce.getDb();
    return _db
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
    const _db = this.lowdbServce.getDb();
    if (id) {
      return _db
      .get(this._name)
      .removeById(id)
      .write();
    } else {
      return _db
      .get(this._name)
      .remove(params)
      .write();
    }
  }

  public patch(id: string, data: any, params?: any) {
    delete data.active;
    delete data.connected;
    delete data.conn;
    delete data.server;

    const _db = this.lowdbServce.getDb();
    if (id) {
      return _db
      .get(this._name)
      .getById(id)
      .assign(data)
      .write();
    } else {
      return _db
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
