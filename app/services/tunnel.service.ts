import { Injectable }                 from '@angular/core';
import { Observable,
         Observer }                   from '@reactivex/rxjs';

import { CredentialsService }         from '../services/credentials.service';

const net = require('net');
const Client = require('ssh2');

@Injectable()
export class TunnelService {

  constructor(
    private credentialsService: CredentialsService
  ) { }

  start(type: string, tunnel: any) {
    const creds = this.credentialsService.get(tunnel.cred);

    const conn = new Client();

    conn
    .on('error', (err: any) => {
      console.error('connection error err:', err);
    })

    .on('ready', () => {
      tunnel.connected = true;
      tunnel.conn = conn;
      const server = net.createServer((netConn: any) => {
        console.log('tunnel connected:', tunnel.name);

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
              console.log('local tunnel stream closed');
              conn.end();
            });
          });

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
  //            console.log('local tunnel stream closed');
  //            conn.end();
  //          });
  //        });

        } else {
          throw new Error('Invalid tunnel type encountered');
        }
      })

      .on('close', () => {
        console.log('net listener closed');
      })

      .listen(tunnel.localPort, () => {
        console.log('listening on port', tunnel.localPort);
      });
    })

    .connect({
      host: tunnel.host,
      port: tunnel.port || 22,
      username: creds.user,
      password: creds.pass || '',
      privateKey: creds.privKey || ''
    });
  }

  stop(tunnel: any) {
    tunnel.conn.end();
  }
}
