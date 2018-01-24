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
      if (cred && cred.name) {
        v.credname = cred.name;
      }
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
