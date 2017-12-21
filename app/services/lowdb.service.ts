import { Injectable } from '@angular/core';

import { VaultPwService } from '../services/vaultpw.service';

import { LowdbVault } from './lowdb-vault.class';

const fs = require('fs');
const crypto = require('crypto');
const algo = 'aes-256-gcm';

const debug = require('debug').debug('sshui:service:lowdb');

//////////
// lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const lodashId = require('lodash-id');

@Injectable()
export class LowdbService {
  private fileName: string = `${process.env.HOME}/.sshui_db.json`;
  private adapter: any;
  private db: any;

  constructor(
    private vaultPwService: VaultPwService
  ) {
    const lowdb = new LowdbVault(vaultPwService);
    this.db = lowdb.getDb();
  }

  getDb() {
    return this.db;
  }

}
