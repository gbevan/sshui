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
        timeout: 5
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
