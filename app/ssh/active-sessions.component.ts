import { Component,
         OnInit } from '@angular/core';

import { ActiveSessionsService } from '../services/active-sessions.service';

const _ = require('lodash');

const html = require('./active-sessions.template.html');
const css = require('./active-sessions.css');

@Component({
  selector: 'active-sessions',
  template: html,
  styles: [css]
})
export class ActiveSessionsComponent implements OnInit {
  private activeSessions: any;
  private activeList: any[];

  constructor(
    private activeSessionsService: ActiveSessionsService
  ) {}

  ngOnInit() {
    this.activeSessionsService.subscribe((value: any) => {
      console.log('active-sessions subscriber called value:', value);
      this.activeSessions = value;
      this.activeList = _.filter(this.activeSessions, (s: any) => s.name);
      console.log('activeList:', this.activeList);
    });
  }
}
