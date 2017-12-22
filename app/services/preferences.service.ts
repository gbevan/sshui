import { Injectable } from '@angular/core';

import { LowdbService } from './lowdb.service';

const debug = require('debug').debug('sshui:service:preferences');

@Injectable()
export class PreferencesService {
  private _name: string = 'preferences';
//  private _db: any;
  constructor(
    private lowdbService: LowdbService
  ) {
//    _db = this.lowdbService.getDb();
  }

  public create(data: any) {
    const _db = this.lowdbService.getDb();
    return _db
    .get(this._name)
    .insert(data)
    .write();
  }

  public get(id: string) {
    const _db = this.lowdbService.getDb();
    return _db
    .read()
    .get(this._name)
    .getById(id)
    .value();
  }

  public find(params?: any) {
    const _db = this.lowdbService.getDb();
    return _db
    .read()
    .get(this._name)
    .filter(params)
    .value();
  }

  public remove(id: string, params?: any) {
    const _db = this.lowdbService.getDb();
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
    const _db = this.lowdbService.getDb();
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
}
