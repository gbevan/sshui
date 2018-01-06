import { Injectable }         from '@angular/core';
import { Observable,
         Observer }           from '@reactivex/rxjs';
import { clearInterval,
         setInterval }        from 'timers';

import { CredentialsService } from '../services/credentials.service';
import { StatusService,
         Status }             from '../services/status.service';

const net = require('net');
const Client = require('ssh2');

const debug = require('debug').debug('sshui:service:tunnel');

@Injectable()
export class TunnelService {
//  private monitorInterval: NodeJS.Timer;

  constructor(
    private credentialsService: CredentialsService,
    private statusService: StatusService
  ) { }

  start(type: string, tunnel: any) {
    debug('start type:', type, 'tunnel:', tunnel);
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
        }, 1000)
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
      keepaliveCountMax: 10
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
