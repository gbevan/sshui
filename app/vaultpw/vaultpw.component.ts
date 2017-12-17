import { Component } from '@angular/core';

import { VaultPwService }   from '../services/vaultpw.service';

const html = require('./vaultpw.template.html');
const css = require('./vaultpw.css');

@Component({
  selector: 'vaultpw',
  template: html,
  styles: [css]
})
export class VaultPwComponent {
  private vaultpw: string = '';

  constructor(
    private vaultPwService: VaultPwService
  ) {}

  submit() {
    this.vaultPwService.set(this.vaultpw);
    this.vaultpw = '';
  }
}
