import { Component,
         AfterViewInit,
         ElementRef,
         ViewChild }  from '@angular/core';

const Terminal = require('xterm');
require('xterm/dist/addons/fit/fit');
Terminal.loadAddon('fit');

//process.binding = () => {};
const Client = require('ssh2');

const html = require('./terminal.template.html');
const css = require('./terminal.css');

@Component({
  selector: 'terminal',
  template: html,
  styles: [css]
})
export class TerminalComponent implements AfterViewInit {
  private term: any;

  @ViewChild('sshterminal') terminalEl: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    console.log('terminal ngAfterViewInit');
    this.term = new Terminal({
      cursorBlink: true
    });
    this.term.open(this.terminalEl.nativeElement);
    this.term.fit();

    this.term.writeln('Connecting...');

    const conn = new Client();
    conn.on('ready', () => {
      this.term.writeln('Authenticated.');

//      conn.exec('uptime', {pty: true}, (err: any, stream: any) => {
      conn.shell({
        term: 'xterm-256color'
      }, (err: any, stream: any) => {
        if (err) {
          this.term.writeln(err.message);
        }

        stream
        .on('close', (code: number, signal: number) => {
          this.term.writeln('stream closed, code: ' + code + ', signal: ' + signal);
          conn.end();
        })
        .on('data', (d: string) => {
          const s: string = d.toString();
//          console.log('stdout:', s);
          this.term.write(s);
        })
        .stderr.on('data', (d: Buffer) => {
          const s: string = d.toString();
//          console.log('stderr:', s);
          this.term.write(s);
        });

//        stream
//        .write('export TERM=xterm-256color\n');

        this.term.on('data', (d: string) => {
//          console.log(d);
//          this.term.write(d);
          stream.write(d);
        });
      });
    })
    .connect({
      host: '127.0.0.1',
      port: 22,
      username: 'bev',
      privateKey: require('fs').readFileSync('/home/bev/.ssh/id_rsa')
    });


  }
}
