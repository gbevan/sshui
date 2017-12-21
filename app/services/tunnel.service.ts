import { Injectable }                 from '@angular/core';
import { Observable,
         Observer }                   from '@reactivex/rxjs';

import { CredentialsService }         from '../services/credentials.service';
import { StatusService }              from '../services/status.service';

const net = require('net');
const Client = require('ssh2');

const debug = require('debug').debug('sshui:service:tunnel');

@Injectable()
export class TunnelService {

  constructor(
    private credentialsService: CredentialsService,
    private statusService: StatusService
  ) { }

  start(type: string, tunnel: any) {
    const creds = this.credentialsService.get(tunnel.cred);

    const conn = new Client();

    conn
    .on('error', (err: any) => {
      console.error('connection error err:', err);
      this.stop(tunnel);
      if (this.statusService.get(tunnel.id).active) {
        setTimeout(() => {
          this.start(type, tunnel);
        }, 1000);
      }
    })

    .on('ready', () => {
      this.statusService.set(tunnel.id, 'connected', true);
      tunnel.conn = conn;

      // create listener for local port
      const server = net.createServer((netConn: any) => {

        // start tunnel
        if (type === 'local') {
          conn.forwardOut('', tunnel.localPort, tunnel.remoteHost, tunnel.remotePort, (err: Error, stream: any) => {
            if (err) {
              tunnel.err = err;
              return;
            }

            netConn
            .pipe(stream)
            .pipe(netConn)
            .on('close', () => {
              stream.close();
            });
          });

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

      .on('error', (err: Error) => {
        console.error('server err:', err);
        tunnel.err = err;

        tunnel.conn.end();
        tunnel.server.close();
        this.statusService.set(tunnel.id, 'connected', false);
//        tunnel.active = false;
      })

      .on('close', (had_error: boolean) => {
        debug('net listener closed, had_error:', had_error);
      })

      .listen(tunnel.localPort, () => {
        debug('listening on port', tunnel.localPort);
      });

      tunnel.server = server;
    })

    .connect({
      host: tunnel.host,
      port: tunnel.port || 22,
      username: creds.user,
      password: creds.pass || '',
      privateKey: creds.privKey || '',
      keepaliveInterval: 30000,
      keepaliveCountMax: 10
    });
  }

  stop(tunnel: any) {
    tunnel.conn.end();
    tunnel.server.close();
    this.statusService.set(tunnel.id, 'connected', false);
  }
}
