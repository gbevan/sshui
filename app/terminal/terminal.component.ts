import { Component,
         AfterViewInit,
         ElementRef,
         ViewChild,
         Input }                  from '@angular/core';

import { CredentialsService }     from '../services/credentials.service';
import { ActiveSessionsService }  from '../services/active-sessions.service';

const Terminal = require('xterm');
require('xterm/dist/addons/fit/fit');
Terminal.loadAddon('fit');

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
    private credentialsService: CredentialsService
  ) { }

  ngAfterViewInit() {
    setTimeout(this.startTerminal.bind(this), 0);
  }

  startTerminal() {
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
    });

    conn.on('ready', () => {
      this.session.connected = true;
      this.session.conn = conn;

      conn.shell({
        term: 'xterm-256color'
      }, (err: any, stream: any) => {
        if (err) {
          this.term.writeln(err.message);
          return;
        }

        stream
        .on('close', (code: number, signal: number) => {
          this.term.writeln('stream closed, code: ' + code + ', signal: ' + signal);
          conn.end();
          this.session.connected = false;
          this.term.destroy();
          delete this.term;

          this.activeSessionsService.stop(this.session);

          if (this.session.persistent) {
            this.activeSessionsService.start(this.session);
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

//  ngOnDestroy() {
//    console.log('terminal on destroy');
//  }
}
