import { Component,
         OnInit,
         ChangeDetectorRef }      from '@angular/core';

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
export class ActiveSessionsComponent implements OnInit {
  private activeSessions: any;
  private activeList: any[] = [];

  constructor(
    private activeSessionsService: ActiveSessionsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.activeSessionsService.subscribe((value: any) => {
      this.activeSessions = value;
      this.activeList = _.filter(this.activeSessions, (s: any) => s.name);
      this.cdr.detectChanges();
    });
  }
}
