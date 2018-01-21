/*

    This file is part of sshui https://github.com/gbevan/sshui.

    sshui is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    sshui is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
    debug('create data:', data);
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
    debug('patch id:', id, 'data:', data);
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
