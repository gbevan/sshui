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

import { AfterViewInit,
         ChangeDetectorRef,
         Component,
         OnDestroy,
         ViewChild }          from '@angular/core';

import { clearTimeout,
         setTimeout }         from 'timers';

import { LowdbService }       from '../services/lowdb.service';
import { PreferencesService } from '../services/preferences.service';

const debug = require('debug').debug('sshui:component:vaultpw');

const html = require('./vaultpw.template.html');
const css = require('./vaultpw.css');

@Component({
  selector: 'vaultpw',
  template: html,
  styles: [css]
})
export class VaultPwComponent implements AfterViewInit {
  @ViewChild('vaultPw') vaultPwInput: any;
  private vaultpw: string = '';
  private errmsg: string = '';
  private lockTimer: NodeJS.Timer;

  constructor(
    private cdr: ChangeDetectorRef,
    private lowdbService: LowdbService,
    private preferencesService: PreferencesService,
  ) {
    const win = (window as any).nw.Window.get();
    win.on('focus', () => {
//      debug('reset timeout');
      this.timerToLock();
    });

    this.timerToLock();
  }

  ngAfterViewInit() {
    this.vaultPwInput.nativeElement.focus();
    this.cdr.detectChanges();
  }

  timerToLock() {
//    debug('timerToLock state:', this.lowdbService.getDb() ? this.lowdbService.getState() : false);
    // check if db has been authenticated
    if (!this.lowdbService.getDb() || this.lowdbService.getState() === 'locked') {
      return;
    }
    // start timer to lockout
    const res = this.preferencesService.find({name: 'settings'});
//    debug('settings res:', res);
    if (res.length > 0) {
      const settings = res[0];

      if (this.lockTimer) {
        clearTimeout(this.lockTimer);
      }

//      debug('setting timout to', settings.timeout);
      this.lockTimer = setTimeout(() => {
//        debug('timeout locked');
        this.lowdbService.lock();
        this.vaultPwInput.nativeElement.focus();
      }, settings.timeout * 1000 * 60); // mins
    }
  }

  submit() {
    this.errmsg = '';

    const err = this.lowdbService.set(this.vaultpw);
    this.vaultpw = '';

    if (err) {
      this.errmsg = err.message;
    } else {
      this.timerToLock();
    }
  }

  refocus(ev: any) {
    ev.srcElement.focus();
  }
}
