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

//import { VaultPwService } from '../services/vaultpw.service';
import { CliService } from './cli.service';

import { LowdbVault } from './lowdb-vault.class';

//const fs = require('fs');
//const crypto = require('crypto');
//const algo = 'aes-256-gcm';

const debug = require('debug').debug('sshui:service:lowdb');

//////////
// lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

//const lodashId = require('lodash-id');

@Injectable()
export class LowdbService {
//  private fileName: string = `${process.env.HOME}/.sshui_db.json`;
  private fileName: string;
  private adapter: any;
  private lowdb: LowdbVault;

  constructor(
//    private vaultPwService: VaultPwService
    private cliService: CliService
  ) {
//    this.lowdb = new LowdbVault(vaultPwService);
    this.fileName = cliService.getOptions().db;

    this.lowdb = new LowdbVault({fileName: this.fileName});
//    this.db = lowdb.getDb();
  }

  getDb() {
    return this.lowdb.getDb();
  }

  getLowDb() {
    return this.lowdb;
  }

  set(pw: string) {
    return this.lowdb.set(pw);
  }

  get() {
    return this.lowdb.get();
  }

  getState() {
    return this.lowdb.getState();
  }

  subscribeState(value: (v: string) => void, error?: any): any {
    return this.lowdb.subscribeState(value, error);
  }

  changePw(currentPw: string, newPw: string) {
    return this.lowdb.changePw(currentPw, newPw);
  }

  lock() {
    return this.lowdb.lock();
  }

}
