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
