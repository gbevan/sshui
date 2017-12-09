import { Component } from '@angular/core';

const html = require('./toolbar.template.html');
const css = require('./toolbar.css');

@Component({
  selector: 'toolbar',
  template: html,
  styles: [css]
})
export class ToolbarComponent {

}
