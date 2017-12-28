import { Injectable } from '@angular/core';

//import { VaultPwService } from '../services/vaultpw.service';
import { CliService } from './cli.service';

import { LowdbVault } from './lowdb-vault.class';

const fs = require('fs');
const crypto = require('crypto');
const algo = 'aes-256-gcm';

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

  changePw(currentPw: string, newPw: string) {
    return this.lowdb.changePw(currentPw, newPw);
  }

}
