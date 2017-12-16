import { Component,
         ViewContainerRef } from '@angular/core';
import { Router }           from '@angular/router';
import { MatDialog,
         MatDialogRef,
         MatDialogConfig }  from '@angular/material';

const html = require('./app.template.html');
const css = require('./app.css');

//const debug = require('debug').debug('partout:component:app');

@Component({
  selector: 'sshui',
  template: html,
  styles: [css]
})
export class AppComponent {
  private section: string = 'manage';

  title = 'SSH UI';

  config: MatDialogConfig;

//  constructor() {}

  show(section: string) {
    this.section = section;
  }

}
