import { Component,
         AfterViewInit,
         ElementRef,
         ViewChild,
         Input }                  from '@angular/core';

import { CredentialsService }     from '../services/credentials.service';
import { ActiveSessionsService }  from '../services/active-sessions.service';
import { StatusService }          from '../services/status.service';

const Terminal = require('xterm');
require('xterm/dist/addons/fit/fit');
Terminal.loadAddon('fit');

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
    private statusService: StatusService
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
which screen 2>/dev/null && screen -S SSHUI -D -RR; exit
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
      keepaliveCountMax: 10
    });
  }

  detach() {
    debug('detach screen');
    this.stream
    .write('\x01d');  // CTRL-A + d
  }

  exit() {
    debug('exit bash session');
    this.stream
    .write('\x04');   // CTRL-D
  }

}
