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
    this.term = new Terminal({
      cursorBlink: true,
      cols: T_COLS,
      rows: T_ROWS
    });
    this.term.open(this.terminalEl.nativeElement);
    this.term.fit();

    this.term.writeln('Connecting...');

    const conn = new Client();

    conn.on('error', (err: any) => {
      console.error('connection error err:', err);
      this.statusService.set(this.session.id, 'connected', false);
    });

    conn.on('close', (had_err: boolean) => {
      console.error('connection closed had_err:', had_err);
      this.statusService.set(this.session.id, 'connected', false);
      this.statusService.set(this.session.id, 'active', false);
    });

    conn.on('end', () => {
      console.error('connection ended');
      this.statusService.set(this.session.id, 'connected', false);
      this.statusService.set(this.session.id, 'active', false);
    });

    conn.on('banner', (msg: string, lang: string) => {
      debug('banner msg:', msg, 'lang:', lang);
    });

    conn.on('ready', () => {
      this.statusService.set(this.session.id, 'connected', true);
      this.statusService.set(this.session.id, 'conn', conn);

      conn.shell({
        term: 'xterm-256color'
      }, (err: any, stream: any) => {
        if (err) {
          this.term.writeln(err.message);
          return;
        }

        stream
        .on('close', (code: number, signal: number) => {
          debug('stream closed, code: ' + code + ', signal: ' + signal);
          conn.end();
          this.session.connected = false;
          this.term.destroy();
          delete this.term;

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
        .write(`stty cols ${T_COLS} rows ${T_ROWS}; clear\n`);

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
      privateKey: this.creds.privKey || ''
    });
  }

}
