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

import { Component,
         Input,
         OnInit } from '@angular/core';

const debug = require('debug').debug('sshui:component:open-url');

const pkg = require('../../package.json');

@Component({
  selector: 'open-url',
  template: `
<button mat-button
        (click)="click()"
        class="button"
        id="openUrlButton">{{ label }}</button>
`,
  styles: [`
.button {
  min-width: auto;
  padding: 0;
  text-decoration: underline;
}
`]
})
export class OpenUrlComponent implements OnInit {
  @Input() url: string = '';
  @Input() label: string = '';

  private pkg_version: string = '';

//  constructor() { }

  ngOnInit() {
    debug('url:', this.url);
    debug('label:', this.label);
  }

  click() {
    debug('clicked');
    (window as any)
    .require('nw.gui')
    .Window.open(this.url, {
      width: pkg.window.width,
      height: pkg.window.height
    });
  }

}
