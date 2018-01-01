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
export class VaultPwComponent implements OnDestroy, AfterViewInit {
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
      clearTimeout(this.lockTimer);
      this.lockTimer = null;

      this.timerToLock();
    });
  }

  ngAfterViewInit() {
    this.vaultPwInput.nativeElement.focus();
    this.cdr.detectChanges();
  }

  timerToLock() {
    // check if db has been authenticated
    if (!this.lowdbService.getDb()) {
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

      this.lockTimer = setTimeout(() => {
        debug('timeout locked');
//        this.lowdbService.set('');
        this.lowdbService.lock();
      }, settings.timeout * 1000 * 60); // mins

//      res.forEach((s: any) => {
//        this.preferencesService.remove(s.id);
//      });
    }
  }

  ngOnDestroy() {
    if (this.lockTimer) {
      clearTimeout(this.lockTimer);
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
