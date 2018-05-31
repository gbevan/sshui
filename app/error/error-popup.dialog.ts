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

import { Component, Inject } from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA } from '@angular/material';

const debug = require('debug').debug('raffia:error-popup');

/**
 * Usage:
 *   import { MatDialog, MatDialogConfig } from '@angular/material';
 *   import { ErrorPopupComponent } from '../../common/dialogs/error/error-popup.component';
 *   @Component({
 *     selector: 'whatever',
 *     template: html,
 *     styles: [css]
 *   })
 *   export class WhateverComponent {
 *     constructor(private dialog: MdDialog) { }
 *
 *     someFunc(err) {
 *       const config: MdDialogConfig = new MdDialogConfig();
 *       config.data = {
 *         error: err // Error obj or string
 *       }
 *       this.dialog.open(ErrorPopupComponent, config);
 *     }
 *   }
 */

@Component({
  selector: 'error-popup-dialog',
  template: `
<h3 class="error">Error:</h3>
<mat-dialog-content>
  <div class="viewErrorOuter">
    <p class="error">{{ data.error | default:'Unknown Error Occurred!' }}</p>
  </div>
<mat-dialog-content>

<mat-dialog-actions class="errAction">
  <button mat-button mat-dialog-close>Close</button>
</mat-dialog-actions>
`,
  styles: [`
.viewErrorOuter {
  /*max-height: 800px;*/
}
.error {
  color: #ff6060;
}
.errAction {
  margin-bottom: 0;
}
`]
})

export class ErrorPopupDialog {
  constructor(
    private dialogRef: MatDialogRef<ErrorPopupDialog>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    debug('constructor() dialogRef:', this.dialogRef);
    debug('constructor() data:', this.data);
  }
}
