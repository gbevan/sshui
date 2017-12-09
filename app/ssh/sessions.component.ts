import { Component } from '@angular/core';

const html = require('./sessions.template.html');
const css = require('./sessions.css');

@Component({
  selector: 'sessions',
  template: html,
  styles: [css]
})
export class SessionsComponent {

}
