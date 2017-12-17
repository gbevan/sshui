import { Component,
         Output,
         EventEmitter }   from '@angular/core';

import { VaultPwService } from '../services/vaultpw.service';

const html = require('./toolbar.template.html');
const css = require('./toolbar.css');

@Component({
  selector: 'toolbar',
  template: html,
  styles: [css]
})
export class ToolbarComponent {
  @Output() section = new EventEmitter<string>();

  constructor(
    private vaultPwService: VaultPwService
  ) {}

  show(section: string) {
    this.section.emit(section);
  }

  lock() {
    this.vaultPwService.set('');
  }
}
