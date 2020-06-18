/*
    Copyright 2017-2018 Graham Lee Bevan <graham.bevan@ntlworld.com>

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
import { Injectable,
         NgZone }               from '@angular/core';
import { MatDialog }            from '@angular/material';

import { Observable,
         Observer,
         Subscription }         from '@reactivex/rxjs';

import { LowdbService }         from './lowdb.service';
import { KnownHostsAddDialog }  from '../ssh/known-hosts/known-hosts-add.dialog';
import { ErrorPopupDialog }       from '../error/error-popup.dialog';
//import { CredentialsService } from './credentials.service';

const crypto = require('crypto');
const debug = require('debug').debug('sshui:service:known-hosts');

@Injectable()
export class KnownHostsService {
  private _name: string = 'knownHosts';
  private _db: any;

  private changed: Observable<any>;
  private changedObserver: Observer<any>;

  constructor(
    private lowdbServce: LowdbService,
    private ngZone: NgZone,
    public dialog: MatDialog
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

  /*
   * kObj contains:
   *   {
   *     hash: hash as hex,
   *     hashBase64: hash as Base64,
   *     fingerprint: ssh like fingerprint (base64),
   *     key: raw key,
   *     keyBase64: key as Base64,
   *     parsedKey: parsed key as an object (see sshpk)
   *   }
   */
  public hostVerifier(kObj: any, knownHostKey: string, cb: (ok: boolean) => void) {
    debug('host kObj:', kObj);
    debug('supported hashes:', crypto.getHashes());

    const hk = this.find({host: knownHostKey});
    debug('hk:', hk);

    if (hk.length === 0) {
      debug('host ssh key not found - prompt to accept');

      this.ngZone.run(() => {
        this.dialog.open(KnownHostsAddDialog, {
          data: {
            host: knownHostKey,
            host_keyObj: kObj,
            knownHostsService: this
          }
        })
        .afterClosed()
        .subscribe((res: any) => {
          debug('known-hosts-add res:', res);
          if (res && res.added) {
            // this.activeSessionsService.start(this.session);
  //              this.startTerminal();
  //              this.cdr.detectChanges();
            cb(true);
          } else {
            cb(false);
          }
        });
      }); // ngZone.run

      // this.activeSessionsService.stop(this.session);
      // cb(false); // reject connection  for now (otherwise there is a
      // timeout on the handshake)

    } else if (hk.length > 1) {
      throw new Error(
        `host '${knownHostKey}' lookup returned more that 1 known_hosts entry`
      );

    } else if (hk[0].host_key !== kObj.keyBase64) {
      debug('host keys do not match!!!');
      // this.activeSessionsService.stop(this.session);

      this.ngZone.run(() => {
        this.dialog.open(ErrorPopupDialog, {
          data: {
            error: `ALERT: Known Host keys for '${knownHostKey}' do not match!!!`
          }
        });
      });

      cb(false);

    } else {
      debug('host ssh key found');
      cb(true);
    }
  }
}
