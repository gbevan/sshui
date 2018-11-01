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

import { Component,
         OnInit }             from '@angular/core';
import { NgModel }            from '@angular/forms';

import { MatDialogRef }       from '@angular/material';

import { CliService }         from '../services/cli.service';
import { PreferencesService } from '../services/preferences.service';

import * as _                 from 'lodash';

const debug = require('debug').debug('sshui:dialog:settings');

const html = require('./settings.template.html');
const css = require('./settings.css');

@Component({
  selector: 'settings-dialog',
  template: html,
  styles: [css]
})
export class SettingsDialog implements OnInit {
  private errmsg: string = '';
  private settings: any;
  private cliOptions: any = {};

  private themes: string[] = [
    'dark-theme',
    'light-theme'
  ];

  constructor(
    private cliService: CliService,
    private preferencesService: PreferencesService,
    public dialogRef: MatDialogRef<SettingsDialog>
  ) {}

  ngOnInit() {
    this.cliOptions = this.cliService.getOptions();

    const res = this.preferencesService.find({name: 'settings'});
    debug('res:', res);
    if (res.length === 0) {
      // set defaults
      this.settings = {
        name: 'settings',
        timeout: 5,
        theme: 'dark-theme'
      };
      this.preferencesService.create(this.settings);
    } else {
      this.settings = res[0];
    }
    debug('settings:', this.settings);
  }

  submit() {
    debug('submit settings:', this.settings);
    try {
      if (this.settings.id) {
        this.preferencesService.patch(this.settings.id, this.settings);
      } else {
        this.preferencesService.create(this.settings);
      }
    } catch (e) {
      console.error(e);
    }
    this.dialogRef.close();
  }
}
