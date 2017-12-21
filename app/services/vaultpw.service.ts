import { Injectable } from '@angular/core';

//import { PreferencesService } from './preferences.service';
import { LowdbVault } from './lowdb-vault.class';

const debug = require('debug').debug('sshui:service:vaultpw');

@Injectable()
export class VaultPwService {
  private PW: string = '';
  private _db: any;

//  constructor() {
//  }

  set(pw: string) {
    this.PW = pw;

    // authenticate with the vault
    try {
      const lowdb = new LowdbVault(this);
      this._db = lowdb.getDb();
      this._db.read(); // authenticate
    } catch (e) {
      console.error(e);
      this.PW = '';
      return e;
    }
    return null;
  }

  get() {
    return this.PW;
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
      this._db.write(); // re-encrypt
    } catch (e) {
      console.error(e);
      this.PW = '';
      return e;
    }
    return null;
  }

}
