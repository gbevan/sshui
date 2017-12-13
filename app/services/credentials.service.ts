import { Injectable } from '@angular/core';

import { LowdbService } from './lowdb.service';

@Injectable()
export class CredentialsService {
  private _name: string = 'credentials';
  private _db: any;
  constructor(
    private lowdbServce: LowdbService
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
}
