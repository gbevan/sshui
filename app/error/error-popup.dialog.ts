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
<div class="viewErrorOuter">
  <p class="error">{{ data.error | default:'Unknown Error Occurred!' }}</p>
</div>
`,
  styles: [`
.viewErrorOuter {
  max-height: 800px;
}
.error {
  color: #ff6060;
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
