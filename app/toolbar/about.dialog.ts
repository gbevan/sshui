/*

    This file is part of sshui https://github.com/gbevan/sshui.

    sshui is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    sshui is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
  private versions: any = {};

  constructor(
    public dialogRef: MatDialogRef<AboutDialog>
  ) {
    this.pkg_version = pkg.version;
    this.versions = process.versions;
  }

}
