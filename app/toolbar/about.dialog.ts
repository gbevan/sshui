import { Component }          from '@angular/core';

import { MatDialogRef }       from '@angular/material';

const debug = require('debug').debug('sshui:dialog:about');

const html = require('./about.template.html');
const css = require('./about.css');
const pkg = require('../../package.json');

@Component({
  selector: 'settings-dialog',
  template: html,
  styles: [css]
})
export class AboutDialog {
  private pkg_version: string = '';

  constructor(
    public dialogRef: MatDialogRef<AboutDialog>
  ) {
    this.pkg_version = pkg.version;
  }

}
