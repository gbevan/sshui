import { Component,
         OnInit,
         ViewContainerRef }     from '@angular/core';
import { MatDialog,
         MatDialogRef,
         MatDialogConfig }       from '@angular/material';

const html = require('./app.template.html');
const css = require('./app.css');

const debug = require('debug').debug('partout:component:app');

@Component({
  selector: 'sshui',
  template: html,
  styles: [css]
})
export class AppComponent {
  title = 'SSH UI';

  config: MatDialogConfig;

  constructor(
//    private dialog: MatDialog,
//    private viewContainerRef: ViewContainerRef,

  ) {
//    this.config = new MatDialogConfig();
//    this.config.viewContainerRef = this.viewContainerRef; // for mdDialog
  }

//  ngOnInit() {
//  }

}
