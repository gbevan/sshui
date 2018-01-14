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
}
