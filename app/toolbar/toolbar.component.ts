import { Component,
         Output,
         EventEmitter } from '@angular/core';

const html = require('./toolbar.template.html');
const css = require('./toolbar.css');

@Component({
  selector: 'toolbar',
  template: html,
  styles: [css]
})
export class ToolbarComponent {
  @Output() section = new EventEmitter<string>();

  show(section: string) {
    this.section.emit(section);
  }
}
