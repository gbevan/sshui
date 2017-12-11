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
      credentials: [],
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
    let crypted = cipher.update(text, 'utf8', 'base64');
    crypted += cipher.final('base64');
    return `/SSHUI/1.0/AES256\n${crypted}`;
  }

  decrypt(text: string) {
    // parse the header
    const m = text.match(/^\/(\w+)\/([0-9.]+)\/(\S+)\n([\s\S]*)/m);
    if (!m) {
      throw new Error('Attempt to decrypt an invalid file');
    }

    const product: string = m[1];
    if (!product || product !== 'SSHUI') {
      throw new Error('Invalid product label in vault db header');
    }

    const version: string = m[2];
    if (!version || version !== '1.0') {
      throw new Error('Invalid version in vault db header');
    }

    const cypher: string = m[3];
    if (!cypher || cypher !== 'AES256') {
      throw new Error('Invalid cypher in vault db header');
    }

    text = m[4];

    const decipher = crypto.createDecipher(algo, pw);
    let dec = decipher.update(text, 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
