import { Component } from '@angular/core';

const debug = require('debug').debug('sshui:component:remote-tunnels');

const html = require('./remote-tunnels.template.html');
const css = require('./remote-tunnels.css');

@Component({
  selector: 'remote-tunnels',
  template: html,
  styles: [css]
})
export class RemoteTunnelsComponent {

}
