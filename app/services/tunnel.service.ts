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

import { Injectable,
         NgZone }             from '@angular/core';
import { MatDialog }            from '@angular/material';

import { Observable,
         Observer }           from '@reactivex/rxjs';
import { clearInterval,
         setInterval }        from 'timers';

import { CredentialsService } from '../services/credentials.service';
import { StatusService,
         Status }             from '../services/status.service';
import { KnownHostsService }  from '../services/known-hosts.service';
import { ErrorPopupDialog }       from '../error/error-popup.dialog';

const net = require('net');
const Client = require('ssh2');

const debug = require('debug').debug('sshui:service:tunnel');

@Injectable()
export class TunnelService {
//  private monitorInterval: NodeJS.Timer;

  constructor(
    private credentialsService: CredentialsService,
    private statusService: StatusService,
    private knownHostsService: KnownHostsService,
    private ngZone: NgZone,
    public dialog: MatDialog
  ) { }

  start(type: string, tunnel: any) {
    debug('start type:', type, 'tunnel:', tunnel);
    tunnel.port = tunnel.port || 22;

//    debug('start called from:', (new Error('stack').stack));

    const creds = this.credentialsService.get(tunnel.cred);
    if (!creds) {
      debug('creds not returned from service, skipping call');
      return;
    }

    const conn = new Client();

    conn
    .on('error', (err: any) => {
      debug('connection error err:', err);
      console.error('connection error err:', err);
      // this.ngZone.run(() => {
      //   this.dialog.open(ErrorPopupDialog, {
      //     data: {
      //       error: `SSH: ${err} - Host ${tunnel.host}:${tunnel.port}`
      //     }
      //   });
      // });
      this.statusService.set(tunnel.id, 'errmsg', err.message);

      this.stop(tunnel);

      // leave for close handler
//      if (this.statusService.get(tunnel.id).active) {
//        setTimeout(() => {
//          this.start(type, tunnel);
//        }, 1000);
//      }
    })

    .on('close', (had_error: boolean) => {
      debug('ssh conn closed, had_error:', had_error);

      const st: Status = this.statusService.get(tunnel.id);
      clearInterval(st.monitorInterval);

      conn.end();
      if (st.server) {
        console.log('closing local port server');
        st.server.close();
      }
      console.log('setting connected status to false');
      this.statusService.set(tunnel.id, 'connected', false);

      if (st.active) {
        this.start(type, tunnel);
      }
    })

    .on('banner', (msg: string, lang: string) => {
      console.log(`banner:\n  ${msg}\n  ${lang}`);
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

      const resp = [creds.pass];
      finish(resp);
    })

    .on('ready', () => {
      const st: Status = this.statusService.get(tunnel.id); // readonly
      this.statusService.set(tunnel.id, 'connected', true);
      this.statusService.set(tunnel.id, 'conn', conn);
      this.statusService.set(tunnel.id, 'errmsg', '');

//      debug('conn:', conn);

      this.statusService.set(
        tunnel.id,
        'monitorInterval',
        setInterval(() => {
          try {
  //          debug('conn bytes recv:', conn._sock.bytesRead);
  //          debug('conn bytes wrtn:', conn._sock.bytesWritten);
            this.statusService.incCounts(
              tunnel.id,
              conn._sock.bytesRead,
              conn._sock.bytesWritten
            );

//            st.intvlBytesRead = conn._sock.bytesRead - st.lastBytesRead;
//            st.intvlBytesWritten = conn._sock.bytesWritten - st.lastBytesWritten;
//
//            st.lastBytesRead = conn._sock.bytesRead;
//            st.lastBytesWritten = conn._sock.bytesWritten;
//
//            debug('intvl bytes recv:', st.intvlBytesRead);
//            debug('intvl bytes wrtn:', st.intvlBytesWritten);
          } catch (e) {
            debug(e);
          }
        }, 2000)
      );

      // create listener for local port
      const server = net.createServer((netConn: any) => {

        debug('netConn:', netConn);

        netConn.on('error', (err: Error) => {
          debug('netConn err:', err);
        });

        // start tunnel
        if (type === 'local') {
          debug('tunnel:', tunnel);
          conn.forwardOut(
            '',
            tunnel.localPort,
            tunnel.remoteHost,
            tunnel.remotePort,
            (err: Error, stream: any) => {

              if (err) {
                tunnel.err = err;
                return;
              }

              netConn
              .pipe(stream)
              .pipe(netConn)
              .on('close', () => {
                console.log('tunnel stream closing');
                stream.close();
              })
              .on('error', (s_err: Error) => {
                debug('tunnel stream err:', s_err);
              });
            }
          );

  // TODO: Remote tunnel support - will need to rework structur re above local port server
  //      } else if (type === 'remote') {
  //        conn.forwardIn(tunnel.remoteHost, tunnel.remotePort, (err: Error, port: number) => {
  //          if (err) {
  //            tunnel.err = err;
  //            return;
  //          }
  //
  //          conn
  //          .pipe(stream)
  //          .pipe(conn)
  //          .on('close', () => {
  //            debug('local tunnel stream closed');
  //            conn.end();
  //          });
  //        });

        } else {
          throw new Error('Invalid tunnel type encountered');
        }
      })

      //server
      .on('error', (err: Error) => {
        debug('server err:', err);
        tunnel.err = err;

        conn.end();
        server.close();

        this.statusService.set(tunnel.id, 'connected', false);
      })

      .on('close', (had_error: boolean) => {
        debug('net listener closed, had_error:', had_error);
      })

      .listen({
        host: tunnel.localHost || '127.0.0.1',
        port: tunnel.localPort
      }, () => {
        debug('listening on port', tunnel.localPort);
      });

      this.statusService.set(tunnel.id, 'server', server);
    })

    .connect({
      host: tunnel.host,
      port: tunnel.port || 22,
      username: creds.user,
      password: creds.pass || '',
      tryKeyboard: true,
      privateKey: creds.privKey !== '' ? creds.privKey : undefined,
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
        const knownHostKey = `${tunnel.host}:${tunnel.port}`;
        this.knownHostsService.hostVerifier(kObj, knownHostKey, (flag: boolean) => {
          if (flag) {
            this.statusService.set(tunnel.id, 'connected', true);
          } else {
            this.stop(tunnel);
            this.statusService.set(tunnel.id, 'active', false);
          }
          cb(flag);
        });
      }
    });
  }

  stop(tunnel: any) {
    const conn = this.statusService.get(tunnel.id).conn;
    if (conn) {
      conn.end();
    }
    const server = this.statusService.get(tunnel.id).server;
    if (server) {
      server.close();
    }
    this.statusService.set(tunnel.id, 'connected', false);
  }
}
