import { Injectable } from '@angular/core';

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
