import { Injector } from '@angular/core';
//import { VaultPwService } from '../services/vaultpw.service';

// TODO: use LowdbVault class

const fs = require('fs');
const crypto = require('crypto');
const algo = 'aes-256-gcm';

//const encode64 = require('node-forge').util.encode64;
//const decode64 = require('node-forge').util.decode64;

const debug = require('debug').debug('sshui:service:lowdb');

//////////
// lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const lodashId = require('lodash-id');

export class LowdbVault {
  private PW: string = '';
  private state: string = '';

  private fileName: string = `${process.env.HOME}/.sshui_db.json`;
  private adapter: any;
  private db: any;
//  private vaultPwService: VaultPwService;

  constructor(
//    private vaultPwService: VaultPwService
  ) {
    if (!fs.existsSync(this.fileName)) {
      this.state = 'nodb';
    }
    debug('state:', this.state);
  }

  getFilename() {
    return this.fileName;
  }

  set(pw: string) {
    this.PW = pw;

    if (!this.db) {
      try {
        this.setup();
      } catch (e) {
        this.PW = '';
        return e;
      }
      this.state = '';
    }

    // authenticate with the vault
    try {
      this.db.read(); // authenticate
    } catch (e) {
      this.PW = '';
      return e;
    }
    return null;
  }

  get() {
    return this.PW;
  }

  getState() {
    return this.state;
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
      preferences: [
        {
          name: 'settings',
          timeout: 5
        }
      ]
    })
    .write();
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

    const decipher = crypto.createDecipheriv(algo, pwkey, iv);
    decipher.setAuthTag(tag);
    let dec = decipher.update(text, 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
