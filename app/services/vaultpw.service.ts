import { Injectable } from '@angular/core';

const debug = require('debug').debug('sshui:service:vaultpw');

@Injectable()
export class VaultPwService {
  private PW: string = '';

//  constructor() { }

  set(pw: string) {
    this.PW = pw;
  }

  get() {
    return this.PW;
  }

}
