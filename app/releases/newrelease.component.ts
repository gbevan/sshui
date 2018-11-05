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

import { Component, OnInit }  from '@angular/core';
import { TimerObservable }    from 'rxjs/observable/TimerObservable';
import { ReleasesService }    from '../services/releases.service';

const debug = require('debug').debug('sshui:component:newrelease');

const pkg = require('../../package.json');
const semver = require('semver');

const oneHour = (1000 * 60 * 60);

@Component({
  selector: 'newrelease',
  template: `
<mat-card *ngIf="show_msg">
  <mat-card-content>
    <div class="msg">
    A new version of sshui is available on github:&nbsp;
    <a href="{{ html_url }}" target="_blank">{{ tag_name }}</a>
    </div>
  </mat-card-content>
</mat-card>
`,
  styles: [`
    .msg {
      text-align: center;
    }
`]
})
export class NewreleaseComponent implements OnInit {
  private tag_name: string = '';
  private html_url: string = '';
  private show_msg: boolean = false;

  // interval 1 hour + random 0-1hour splay
  private interval: number = oneHour + (oneHour * Math.random());

  constructor(
    public releasesService: ReleasesService
  ) { }

  ngOnInit() {
    TimerObservable.create(0, this.interval)
    .takeWhile(() => true)
    .subscribe(() => {
      this.releasesService.getLatest()
      .subscribe((res: any) => {
        debug('res:', res);
        this.tag_name = res.tag_name;
        this.html_url = res.html_url;
        // pkg.version = '1.3.0';
        this.show_msg = semver.gt(res.tag_name, pkg.version);
        debug('show_msg:', this.show_msg);
      });
    });
  }
}
