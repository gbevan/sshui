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

//import { Injector } from '@angular/core';
import { EventEmitter } from 'events';
import { Observable,
         Observer }   from '@reactivex/rxjs';

const os = require('os');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const algo = 'aes-256-gcm';

//const EventEmitter = require('events');

const debug = require('debug').debug('sshui:vault:lowdb');

//////////
// lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const lodashId = require('lodash-id');

export class LowdbVault {
  private PW: string = '';
  private state: string = ''; // nodb, locked
  private stateEmitter: EventEmitter = new EventEmitter();
  private stateChanged: Observable<string>;

  private fileName: string = path.join(os.homedir(), '/.sshui_db.json');
  private adapter: any;
  private db: any;

  constructor(params: any) {
    debug('params:', params);
    this.fileName = params.fileName;
    this.stateChanged = Observable.fromEvent(this.stateEmitter, 'changed');
    this.state = fs.existsSync(this.fileName) ? 'locked' : 'nodb';
  }

  getFilename() {
    return this.fileName;
  }

  set(pw: string) {
    this.PW = pw;

    if (pw === '') {
      this.db = null;
      this.setState('locked');
      return;
    }

    if (!this.db) {
      try {
        this.setup();
      } catch (e) {
        debug('lowdb setup failed err:', e);
        this.PW = '';
        this.setState('locked');
        return e;
      }
      this.setState('');
    }

    // authenticate with the vault
    try {
      this.db.read(); // authenticate
      this.setState('');
    } catch (e) {
      debug('auth failed err:', e);
//      this.PW = '';
      this.setState('locked');
      return e;
    }
    return null;
  }

  get() {
    return this.PW;
  }

  lock() {
    this.setState('locked');
  }

  setState(state: string) {
    debug('setState:', state);
    this.state = state;
    this.stateEmitter.emit('changed', state);
  }

  getState() {
    return this.state;
  }

  subscribeState(value: (v: string) => void, error?: any): any {
    return this.stateChanged.subscribe(value, error);
  }

  changePw(currentPw: string, newPw: string) {
    const oldPw = this.PW;

    const decErr = this.set(currentPw);

    if (decErr) {
      // decrypt failed
      this.set(oldPw);  // recover
      return decErr;
    }

    this.PW = newPw;
    try {
      this.db.write(); // re-encrypt
    } catch (e) {
      console.error(e);
      this.PW = '';
      return e;
    }
    return null;
  }

  setup() {
    // Ensure db file exists
    if (!fs.existsSync(this.fileName)) {
      fs.writeFileSync(this.fileName, '', { mode: 0o600 });
    }

    // Ensure file permissions
    fs.chmodSync(this.fileName, 0o600);

    this.adapter = new FileSync(this.fileName, {

      serialize: (data: any) => this.encrypt(JSON.stringify(data)),

      deserialize: (data: string) => {
        if (!data || data === '') {
          return {};
        }
        const res = this.decrypt(data);
        if (res instanceof Error) {
          throw res;
        }
        return JSON.parse(this.decrypt(data));
      }
    });
    this.db = low(this.adapter);

    this.db._.mixin(lodashId);

    this.db
    .defaults({
      credentials: [],
      sessions: [],
      localTunnels: [],
      remoteTunnels: [],
      preferences: [],
      knownHosts: []
    })
    .write();

    const settings = this.db
    .get('preferences')
    .getById(1)
    .value();
//    debug('settings:', settings);

    if (!settings) {
      this.db
      .get('preferences')
      .upsert({
        id: '1',
        name: 'settings',
        timeout: 10
      })
      .write();
    }
  }

  getDb() {
    return this.db;
  }

  encrypt(text: string) {
    const pwkey = crypto.pbkdf2Sync(
      this.PW,
      'salt',
      100000,
      32,
      'sha512'
    );

    const ivBuf = Buffer.alloc(100);
    crypto.randomFillSync(ivBuf);
    const ivkey = crypto.pbkdf2Sync(ivBuf, 'salt', 100000, 16, 'sha512');

    const cipher = crypto.createCipheriv(algo, pwkey, ivkey);
    let crypted = cipher.update(text, 'utf8', 'base64');
    crypted += cipher.final('base64');

    const tag = cipher.getAuthTag();

    return `/SSHUI/2.0/AES256GCM/${tag.toString('hex')}/${ivkey.toString('hex')}\n${crypted}`;
  }

  decrypt(text: string) {
    const pwkey = crypto.pbkdf2Sync(
      this.PW,
      'salt',
      100000,
      32,
      'sha512'
    );

    // parse the header
    const m = text.match(/^\/(\w+)\/([0-9.]+)\/(\S+)\/(\S+)\/(\S+)\n([\s\S]*)/m);
    if (!m) {
      throw new Error('Attempt to decrypt an invalid file');
    }

    const product: string = m[1];
    if (!product || product !== 'SSHUI') {
      throw new Error('Invalid product label in vault db header');
    }

    const version: string = m[2];
    if (!version || version !== '2.0') {
      throw new Error('Invalid version in vault db header');
    }

    const cypher: string = m[3];
    if (!cypher || cypher !== 'AES256GCM') {
      throw new Error('Invalid cypher in vault db header');
    }

    const tag: Buffer = Buffer.from(m[4], 'hex');
    const iv: Buffer = Buffer.from(m[5], 'hex');

    text = m[6];

    try {
      const decipher = crypto.createDecipheriv(algo, pwkey, iv);
      decipher.setAuthTag(tag);
      let dec = decipher.update(text, 'base64', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    } catch (e) {
      debug('decrypt error:', e);
//      return '{}';
      return new Error(e);
    }
  }
}
