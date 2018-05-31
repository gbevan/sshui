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

import { AfterViewChecked,
         AfterViewInit,
         Component,
         OnChanges,
         OnInit,
         OnDestroy,
         ChangeDetectorRef }      from '@angular/core';

import { MatTabChangeEvent }      from '@angular/material/tabs';

import { Subscription }           from '@reactivex/rxjs';

import { ActiveSessionsService }  from '../services/active-sessions.service';

const _ = require('lodash');
const debug = require('debug').debug('sshui:component:active-sessions');

const html = require('./active-sessions.template.html');
const css = require('./active-sessions.css');

@Component({
  selector: 'active-sessions',
  template: html,
  styles: [css]
})
export class ActiveSessionsComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private activeSessions: any;
  private activeList: any[] = [];
  private as_subscription: Subscription;
  private tabIdx: number = 0;

  constructor(
    private activeSessionsService: ActiveSessionsService,
    private cdr: ChangeDetectorRef
  ) {
    debug('constructor');
  }

  ngOnInit() {
    debug('ngOnInit');
    this.as_subscription = this.activeSessionsService.subscribe((value: any) => {
      this.activeSessions = value;
      this.activeList = _.filter(this.activeSessions, (s: any) => s.name);
      // try {
      //   this.cdr.detectChanges();
      // } catch (e) {
      //   console.error('detectchanges err:', e);
      // }
    });
  }

  ngOnDestroy() {
    if (this.as_subscription) {
      this.as_subscription.unsubscribe();
    }
  }

  // ngAfterViewChecked() {
  //   debug('ngAfterViewChecked');
  //   // debug('tabIdx:', this.tabIdx);
  //   // debug('activeSession:', this.activeList[this.tabIdx]);
  // }
  ngAfterViewInit() {
    debug('ngAfterViewInit');
  }

  ngOnChanges(chg: any) {
    debug('ngOnChanges chg:', chg);
  }
  tabChanged(ev: MatTabChangeEvent) {
    debug('tabChanged ev:', ev);
  }
}
