import { Component } from '@angular/core';

const html = require('./active-sessions.template.html');
const css = require('./active-sessions.css');

@Component({
  selector: 'active-sessions',
  template: html,
  styles: [css]
})
export class ActiveSessionsComponent {

}
