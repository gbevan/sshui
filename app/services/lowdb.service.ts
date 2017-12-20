import { Injectable } from '@angular/core';

import { VaultPwService } from '../services/vaultpw.service';

const fs = require('fs');
const crypto = require('crypto');
const algo = 'aes-256-gcm';

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
    const pwkey = crypto.pbkdf2Sync(
      this.vaultPwService.get(),
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

    return `/SSHUI/1.0/AES256GCM/${tag.toString('hex')}/${ivkey.toString('hex')}\n${crypted}`;
  }

  decrypt(text: string) {
    const pwkey = crypto.pbkdf2Sync(
      this.vaultPwService.get(),
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
    if (!version || version !== '1.0') {
      throw new Error('Invalid version in vault db header');
    }

    const cypher: string = m[3];
    if (!cypher || cypher !== 'AES256GCM') {
      throw new Error('Invalid cypher in vault db header');
    }

    const tag: Buffer = Buffer.from(m[4], 'hex');
    const iv: Buffer = Buffer.from(m[5], 'hex');

    text = m[6];

    const decipher = crypto.createDecipheriv(algo, pwkey, iv);
    decipher.setAuthTag(tag);
    let dec = decipher.update(text, 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
