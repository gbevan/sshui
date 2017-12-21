import { Component } from '@angular/core';

const debug = require('debug').debug('sshui:dialog:change-vault-pw');

const html = require('./change-vault-pw.template.html');
const css = require('./change-vault-pw.css');

@Component({
  selector: 'change-vault-pw-dialog',
  template: html,
  styles: [css]
})
export class ChangeVaultPwDialog {
  private current_pw: string = '';
  private new_pw_1: string = '';
  private new_pw_2: string = '';

  submit() {
    debug('change-vault-pw submit()');
  }
}
