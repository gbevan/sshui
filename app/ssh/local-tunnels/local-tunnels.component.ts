import { Component,
         OnInit,
         OnDestroy,
         AfterViewInit,
         ChangeDetectorRef }    from '@angular/core';
import { MatTableDataSource,
         MatDialog }            from '@angular/material';

import { Subscription }         from '@reactivex/rxjs';

import { LocalTunnelsService }  from '../../services/local-tunnels.service';
import { LocalTunnelAddDialog } from './local-tunnel-add.dialog';

import { TunnelService }        from '../../services/tunnel.service';
import { Status,
         StatusService }        from '../../services/status.service';

const debug = require('debug').debug('sshui:component:local-tunnels');

const html = require('./local-tunnels.template.html');
const css = require('./local-tunnels.css');

@Component({
  selector: 'local-tunnels',
  template: html,
  styles: [css]
})
export class LocalTunnelsComponent implements OnInit, AfterViewInit, OnDestroy {
  private tableSource: MatTableDataSource<any>;
  private displayedColumns: string[] = [
//    'id',
    'name',
    'host',
    'port',
    'cred',
    'persistent',
    'connected',
    'localHost',
    'localPort',
    'remoteHost',
    'remotePort',
    'edit',
    'delete'
  ];
  private localTunnels: any = [];
  private status: any = {}; // key by id
  private statusSubscription: Subscription;

  constructor(
    private statusService: StatusService,
    private tunnelService: TunnelService,
    private localTunnelsService: LocalTunnelsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    debug('in ngOnInit');
    // listen for status events
    this.statusSubscription = this.statusService.subscribe(() => {
      debug('status subscribe fired');
      this.cdr.detectChanges();
    });

    this.refresh();
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }

  ngAfterViewInit() {
//    this.recoverPersistentLocalTunnels();
    this.cdr.detectChanges();
  }

  refresh() {
    debug('refresh');
    this.localTunnels = this.localTunnelsService.find();
    debug('after localTunnels');
    this.tableSource = new MatTableDataSource<any>(this.localTunnels);
    this.recoverPersistentLocalTunnels();
    debug('after recoverPersistentLocalTunnels');
  }

  addLocalTunnel() {
    this.dialog.open(LocalTunnelAddDialog, {
//      width: '80%'
    })
    .afterClosed()
    .subscribe((res) => {
      debug('addLocalTunnel res:', res);
      if (res) {
        this.statusService.set(res.id, null, null);
        this.refresh();
      }
    });
  }

  editLocalTunnel(localTunnel: any) {
    this.dialog.open(LocalTunnelAddDialog, {
      data: {
        localTunnel
      }
    })
    .afterClosed()
    .subscribe((res) => {
      this.refresh();
    });
  }

  delLocalTunnel(e: any) {
    // TODO: prompt dialog ok/cancel
    this.localTunnelsService
    .remove(e.id);
    this.statusService.delete(e.id);
    this.refresh();
  }

  toggleState(localTunnel: any) {
    const st = this.statusService.get(localTunnel.id);
    if (st && st.active) {
      this.tunnelService.stop(localTunnel);
      this.statusService.set(localTunnel.id, 'active', false);
    } else {
      this.tunnelService.start('local', localTunnel);
      this.statusService.set(localTunnel.id, 'active', true);
    }

    // TODO: find a better way to do this, maybe a once() event for status? or Observable from StatusService
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1000);
  }

  recoverPersistentLocalTunnels() {
    this.localTunnels.forEach((t: any) => {
      debug('t:', t);
      const s = this.statusService.get(t.id);
      if (s) {
        debug(`active:${s.active}`);
      }

      if (t.persistent && (!s || !s.active || !s.connected)) {
        this.tunnelService.start('local', t);
        this.statusService.set(t.id, 'active', true);
      }
    });
  }

  isActive(id: string) {
    const status = this.statusService.get(id);
    return status && status.active && !status.connected;
  }

  isConnected(id: string) {
    const status = this.statusService.get(id);
    return status && status.connected;
  }

  isNotConnected(id: string) {
    const status = this.statusService.get(id);
    return !status || !status.connected && !status.active;
  }
}
