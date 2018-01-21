import { Component,
         ChangeDetectorRef,
         AfterViewInit,
         ElementRef,
         ViewChild,
         Input }                  from '@angular/core';

import { MatDialog }              from '@angular/material';

import { CredentialsService }     from '../services/credentials.service';
import { ActiveSessionsService }  from '../services/active-sessions.service';
import { StatusService }          from '../services/status.service';
import { KnownHostsService }      from '../services/known-hosts.service';

import { KnownHostsAddDialog }    from '../ssh/known-hosts/known-hosts-add.dialog';
import { ErrorPopupDialog }       from '../error/error-popup.dialog';

const Terminal = require('xterm');
require('xterm/dist/addons/fit/fit');
Terminal.loadAddon('fit');

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

  private creds: any;

  private stream: any;

  @ViewChild('sshterminal') private terminalEl: ElementRef;

  constructor(
    private activeSessionsService: ActiveSessionsService,
    private credentialsService: CredentialsService,
    private statusService: StatusService,
    private knownHostsService: KnownHostsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    setTimeout(this.startTerminal.bind(this), 0);
  }

  startTerminal() {
    debug('startTerminal cols:', T_COLS, 'rows:', T_ROWS);
    this.creds = this.credentialsService.get(this.session.cred);
//    debug('creds:', this.creds);
    this.term = new Terminal({
      cursorBlink: true,
      cols: T_COLS,
      rows: T_ROWS
    });
    this.term.open(this.terminalEl.nativeElement);
    this.term.fit();

    this.term.writeln('Connecting...');

    const conn = new Client();

    conn
    .on('error', (err: any) => {
      console.error('connection error err:', err);
      this.statusService.set(this.session.id, 'connected', false);
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
      this.statusService.set(this.session.id, 'connected', true);
      this.statusService.set(this.session.id, 'conn', conn);

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
clear
(which screen 2>/dev/null && (screen -S SSHUI -D -RR) || (clear; sh -i)); exit
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
      port: this.session.port || 22,
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
        debug('host conn:', conn);
        debug('host kObj:', kObj);
        debug('supported hashes:', crypto.getHashes());

        const hk = this.knownHostsService
        .find({host: this.session.host});
        debug('hk:', hk);

        if (hk.length === 0) {
          debug('host ssh key not found - prompt to accept');
          this.dialog.open(KnownHostsAddDialog, {
            data: {
              host: this.session.host,
              host_keyObj: kObj
            }
          })
          .afterClosed()
          .subscribe((res) => {
            debug('known-hosts-add res:', res);
            if (res && res.added) {
              this.activeSessionsService.start(this.session);
//              this.startTerminal();
//              this.cdr.detectChanges();
            }
          });

          this.activeSessionsService.stop(this.session);
          cb(false); // reject connection for now (otherwise there is a timeout on the handshake)

        } else if (hk.length > 1) {
          throw new Error('host lookup returned more that 1 known_hosts entry');

        } else if (hk[0].host_key !== kObj.keyBase64) {
          debug('host keys do not match!!!');
          this.activeSessionsService.stop(this.session);

          this.dialog.open(ErrorPopupDialog, {
            data: {
              error: 'ALERT: Host keys do not match!!!'
            }
          });

          cb(false);

        } else {
          debug('host ssh key found');
          cb(true);
        }
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
