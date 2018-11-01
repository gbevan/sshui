/*
    Copyright 2017-2018 Graham Lee Bevan <graham.bevan@ntlworld.com>
    
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
import { OverlayContainer} from '@angular/cdk/overlay';

import { CliService }   from './services/cli.service';
import { LowdbService }   from './services/lowdb.service';
import { PreferencesService } from './services/preferences.service';

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
  title = 'sshui';
  config: MatDialogConfig;
  private section: string = 'manage';
  private theme: string = 'dark-theme';

  constructor(
    private cdr: ChangeDetectorRef,
    private cliService: CliService,
    private lowdbService: LowdbService,
    private preferencesService: PreferencesService,
    public overlayContainer: OverlayContainer
  ) { }

  setTheme(theme: string) {
    this.theme = theme;
    this.overlayContainer.getContainerElement().classList.add(this.theme);
  }

  ngOnInit() {
    console.log('app component ngOnInit');
    this.lowdbService.subscribeState((state) => {
      debug('lowdb state changed:', state);
      this.cdr.detectChanges();

      if (this.isAuth()) {
        const res = this.preferencesService.find({name: 'settings'});
        debug('res:', res);
        if (res.length !== 0) {
          this.setTheme(res[0].theme);
        }

        this.preferencesService.subscribeChanged((p) => {
          if (p.name === 'settings') {
            this.setTheme(p.theme);
          }
        });
      }
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
