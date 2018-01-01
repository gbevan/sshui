import { Component,
         OnInit,
         OnDestroy,
         ChangeDetectorRef }      from '@angular/core';

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
export class ActiveSessionsComponent implements OnInit, OnDestroy {
  private activeSessions: any;
  private activeList: any[] = [];
  private as_subscription: Subscription;

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
      try {
        this.cdr.detectChanges();
      } catch (e) {
        console.error('detectchanges err:', e);
      }
    });
  }

  ngOnDestroy() {
    if (this.as_subscription) {
      this.as_subscription.unsubscribe();
    }
  }
}
