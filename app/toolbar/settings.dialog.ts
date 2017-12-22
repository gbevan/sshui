import { Component,
         OnInit }             from '@angular/core';
import { NgModel }            from '@angular/forms';

import { MatDialogRef }       from '@angular/material';

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

  constructor(
    private preferencesService: PreferencesService,
    public dialogRef: MatDialogRef<SettingsDialog>
  ) {}

  ngOnInit() {
    const res = this.preferencesService.find({name: 'settings'});
    debug('res:', res);
    if (res.length === 0) {
      // set defaults
      this.settings = {
        name: 'settings',
        timeout: 5
      };
    } else {
      this.settings = res[0];
    }
    debug('settings:', this.settings);
  }

  submit() {
    debug('submit settings:', this.settings);
    if (this.settings.id) {
      this.preferencesService.patch(this.settings.id, this.settings);
    } else {
      this.preferencesService.create(this.settings);
    }
    this.dialogRef.close();
  }
}
