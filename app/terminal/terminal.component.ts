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
         ChangeDetectorRef,
         AfterViewInit,
         ElementRef,
         ViewChild,
         NgZone,
         Input }                  from '@angular/core';

import { MatDialog }              from '@angular/material';

import { CredentialsService }     from '../services/credentials.service';
import { ActiveSessionsService }  from '../services/active-sessions.service';
import { StatusService }          from '../services/status.service';
import { KnownHostsService }      from '../services/known-hosts.service';

import { KnownHostsAddDialog }    from '../ssh/known-hosts/known-hosts-add.dialog';
import { ErrorPopupDialog }       from '../error/error-popup.dialog';

// const Terminal = require('xterm');
// require('xterm/dist/addons/fit/fit');
// Terminal.loadAddon('fit');

import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';
// Terminal.applyAddon('fit');

const crypto = require('crypto');

const debug = require('debug').debug('sshui:component:terminal');

//process.binding = () => {};
const Client = require('ssh2');

const html = require('./terminal.template.html');
const css = require('./terminal.css');

const T_COLS = 132;
const T_ROWS = 33;

@Component({
  selector: 'terminal',
  template: html,
  styles: [css]
})
export class TerminalComponent implements AfterViewInit {
  @Input() session: any;

  private term: any;
  private title: string = '';
  private term_options: any;

  private creds: any;

  private stream: any;

  @ViewChild('sshterminal') private terminalEl: ElementRef;
  @ViewChild('terminalOuter') private terminalOuter: ElementRef;
  @ViewChild('termtools') private termtools: ElementRef;

  constructor(
    private activeSessionsService: ActiveSessionsService,
    private credentialsService: CredentialsService,
    private statusService: StatusService,
    private knownHostsService: KnownHostsService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private ngZone: NgZone,
    public dialog: MatDialog
  ) {
    this.term_options = {
      cursorBlink: true,
      cols: T_COLS,
      rows: T_ROWS,
      letterSpacing: 0,
      fontSize: 16
    };
  }

  ngAfterViewInit() {
    setTimeout(this.startTerminal.bind(this), 0);
  }

  resize() {
    debug('resize() sshterminal style:', this.terminalEl.nativeElement.style);
    debug('resize() terminal style:', this.el.nativeElement.style);
    // this.term.charMeasure.measure(this.term_options);
    // fit(this.term);
    if (this.term) {
      this.term.resize(T_COLS, T_ROWS);
    }
  }

  // Start observing visbility of element. On change, the
  //   the callback is called with Boolean visibility as
  //   argument
  // see https://stackoverflow.com/questions/1462138/js-event-listener-for-when-element-becomes-visible
  respondToVisibility(element: any, callback: any) {
    const options: any = {
      // root: document.documentElement
      // root: this.el.nativeElement
      root: null
    };

    const observer = new IntersectionObserver((entries, o) => {
      debug('IntersectionObserver entries:', entries);
      debug('IntersectionObserver o:', o);
      entries.forEach((entry) => {
        callback(entry.intersectionRatio > 0);
      });
    }, options);

    observer.observe(element);
  }

  startTerminal() {
    debug('startTerminal cols:', T_COLS, 'rows:', T_ROWS);
    this.creds = this.credentialsService.get(this.session.cred);

    this.session.port = this.session.port || 22;

//    debug('creds:', this.creds);
    this.term = new Terminal(this.term_options);
    this.term.open(this.terminalEl.nativeElement);
    debug('nativeElement:', this.terminalEl.nativeElement);
    // this.term.fit();
    // fit(this.term);
    // this.term.resize(NaN, NaN);
    // cant call fit here as the parent element must already be visible
    // otherwise we get an inf loop in fit()
    // this.respondToVisibility(this.el.nativeElement, (v: boolean) => {
    // debug('terminalOuter:', this.terminalOuter.nativeElement);
    debug('termtools:', this.termtools.nativeElement);
    // this.respondToVisibility(this.terminalOuter.nativeElement, (v: boolean) => {
    this.respondToVisibility(this.termtools.nativeElement, (v: boolean) => {
      debug('respondToVisibility cb v:', v);
      // if (v) {
      this.resize();
      // }
    });

    this.term.writeln('Connecting...');

    const conn = new Client();

    conn
    .on('error', (err: any) => {
      console.error('connection error err:', err);
      this.statusService.set(this.session.id, 'connected', false);
      this.ngZone.run(() => {
        this.dialog.open(ErrorPopupDialog, {
          data: {
            error: `SSH: ${err} - Host ${this.session.host}:${this.session.port}`
          }
        });
      });
    })

    .on('close', (had_err: boolean) => {
      console.error('connection closed had_err:', had_err);
      this.statusService.set(this.session.id, 'connected', false);
      this.statusService.set(this.session.id, 'active', false);
    })

    .on('end', () => {
      console.error('connection ended');
      this.statusService.set(this.session.id, 'connected', false);
      this.statusService.set(this.session.id, 'active', false);
    })

    .on('keyboard-interactive', (
      name: string,
      instructions: string,
      lang: string,
      prompts: any[],
      finish: (resp: string[]) => void
    ) => {
      debug('keyboard-interactive name:', name);
      debug('keyboard-interactive instructions:', instructions);
      debug('keyboard-interactive instructions lang:', lang);
      debug('keyboard-interactive prompts:', prompts);

      const resp = [this.creds.pass];
//      debug('resp:', resp);
      finish(resp);
    })

    .on('banner', (msg: string, lang: string) => {
      debug('banner msg:', msg, 'lang:', lang);
    })

    .on('ready', () => {
      this.ngZone.run(() => {
        this.statusService.set(this.session.id, 'connected', true);
        this.statusService.set(this.session.id, 'conn', conn);
      });

      conn.shell({
        term: 'xterm-256color'
      }, (err: any, stream: any) => {
        if (err) {
          this.term.writeln(err.message);
          return;
        }
        this.stream = stream;

        stream
        .on('close', (code: number, signal: number) => {
          debug('stream closed, code: ' + code + ', signal: ' + signal);
          conn.end();
          this.session.connected = false;
          this.term.destroy();
          delete this.term;
          this.stream = null;

          if (this.session.persistent) {
            debug('should persist');
            return this.startTerminal();
          } else {
            this.activeSessionsService.stop(this.session);
          }
        })

        .on('data', (d: string) => {
          const s: string = d.toString();
          this.term.write(s);
        })
        .stderr.on('data', (d: Buffer) => {
          const s: string = d.toString();
          this.term.write(s);
        });

        stream
        .write(`
stty cols ${T_COLS} rows ${T_ROWS}
tput reset
(which screen 2>/dev/null && (screen -S SSHUI_${this.session.name} -D -RR) || (clear; sh -i)); exit
`);

        this.term
        .on('data', (d: string) => {
          stream.write(d);
        });

        this.term
        .on('title', (t: string) => {
          this.title = t;
        });
      });
    })

    .connect({
      host: this.session.host,
      port: this.session.port,
      username: this.creds.user,
      password: this.creds.pass || '',
      tryKeyboard: true,
      privateKey: this.creds.privKey !== '' ? this.creds.privKey : undefined,
      keepaliveInterval: 30000,
      keepaliveCountMax: 10,
      hostHash: 'RSA-SHA256',
      hostVerifierKeyObj: true,

      /*
       * kObj contains:
       *   {
       *     hash: hash as hex,
       *     hashBase64: hash as Base64,
       *     fingerprint: ssh like fingerprint (base64),
       *     key: raw key,
       *     keyBase64: key as Base64,
       *     parsedKey: parsed key as an object (see sshpk)
       *   }
       */
      hostVerifier: (kObj: any, cb: (ok: boolean) => void) => {

        const knownHostKey = `${this.session.host}:${this.session.port}`;
        this.knownHostsService.hostVerifier(kObj, knownHostKey, (flag: boolean) => {
          if (flag) {
            this.activeSessionsService.start(this.session);
            this.statusService.set(this.session.id, 'active', true);
          } else {
            this.activeSessionsService.stop(this.session);
            this.statusService.set(this.session.id, 'active', false);
          }
          cb(flag);
        });
      }
    });
  }

  detach() {
    debug('detach screen');
    this.stream
    .write('\x01d');  // CTRL-A + d
  }

//  exit() {
//    debug('exit bash session');
//    this.stream
//    .write('\x04');   // CTRL-D
//  }

  newWin() {
    this.stream
    .write('\x01c');  // CTRL-A + c
    this.term.focus();
  }

  prevWin() {
    this.stream
    .write('\x01p');  // CTRL-A + p
    this.term.focus();
  }

  nextWin() {
    this.stream
    .write('\x01n');  // CTRL-A + n
    this.term.focus();
  }

  list() {
    this.stream
    .write('\x01"');  // CTRL-A + "
    this.term.focus();
  }

  lock() {
    this.stream
    .write('\x01x');  // CTRL-A + x
    this.term.focus();
  }

}
