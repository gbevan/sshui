import { Injectable } from '@angular/core';

const fs = require('fs');
const crypto = require('crypto');
const algo = 'aes-256-ctr';
const pw = 'test';

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

  constructor() {

    // Ensure db file exists
    if (!fs.existsSync(this.fileName)) {
      console.log('Creating new db:', this.fileName);
      fs.writeFileSync(this.fileName, '');
    }

    this.adapter = new FileSync(this.fileName, {
      serialize: (data: any) => this.encrypt(JSON.stringify(data)),

      deserialize: (data: string) => {
        if (!data || data === '') {
          return {};
        }
        return JSON.parse(this.decrypt(data));
      }
    });
    this.db = low(this.adapter);

    this.db._.mixin(lodashId);

    this.db
    .defaults({
      sessions: [],
      localTunnels: [],
      remoteTunnels: [],
      preferences: {}
    })
    .write();
  }

  getDb() {
    return this.db;
  }

  encrypt(text: string) {
    const cipher = crypto.createCipher(algo, pw);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(text: string) {
    const decipher = crypto.createDecipher(algo, pw);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
