// tell debug to treat as browser - enable using: DEBUG="sshui:*" gulp
(process as any).type = 'renderer';
const debug = require('debug').debug('sshui:app');

//console.error = (...args: any[]) => {
//  debug('UncaughtError:', ...args);
////  process.stderr.write((new Error('stack')).stack);
//};

import { ChangeDetectorRef,
         Component,
         OnInit,
         ViewContainerRef } from '@angular/core';
import { MatDialog,
         MatDialogRef,
         MatDialogConfig }  from '@angular/material';

import { CliService }   from './services/cli.service';
import { LowdbService }   from './services/lowdb.service';

const html = require('./app.template.html');
const css = require('./app.css');

process.on('uncaughtException', (e) => {
  console.error('uncaughtException:', e);
  process.stderr.write('uncaughtException:' + e.message);
//  alert('halt');
});

@Component({
  selector: 'sshui',
  template: html,
  styles: [css]
})
export class AppComponent implements OnInit {
  title = 'SSH UI';
  config: MatDialogConfig;
  private section: string = 'manage';

  constructor(
    private cdr: ChangeDetectorRef,
    private cliService: CliService,
    private lowdbService: LowdbService
  ) {}

  ngOnInit() {
    this.lowdbService.subscribeState((state) => {
      debug('lowdb state changed:', state);
      this.cdr.detectChanges();
    });
  }

  show(section: string) {
    this.section = section;
  }

  isLocked() {
    return this.lowdbService.getState() === 'locked';
  }

  isDbPresent() {
    return this.lowdbService.getState() !== 'nodb';
  }

  isAuth() {
    return this.lowdbService.getDb() ? true : false;
  }
}
