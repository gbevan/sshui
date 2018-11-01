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

import { Component,
         OnInit,
         OnDestroy,
         AfterViewInit,
         ChangeDetectorRef,
         ViewChild }            from '@angular/core';
import { MatTableDataSource,
         MatPaginator,
         MatSort,
         MatDialog }            from '@angular/material';

//import * as moment              from 'moment';

import { Subscription }         from '@reactivex/rxjs';

import * as _                   from 'lodash';

import { LocalTunnelsService }  from '../../services/local-tunnels.service';
import { LocalTunnelAddDialog } from './local-tunnel-add.dialog';

import { TunnelService }        from '../../services/tunnel.service';
import { CountsEvent,
         Status,
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    'delete',
    'traffic'
  ];
  private localTunnels: any = [];
  private status: any = {}; // key by id
  private statusSubscription: Subscription;

  private counts: any = {};  // {"id": {bytesRead: n, bytesWritten: n, ...}}
  private countsSubscription: Subscription;

  private countsOptions: any = {
    animation: {
      duration: 0
    }
  };
  private countsHashDataset: any = {};  // for ng2-charts {"id": [{data: [...], label: 'read|write'}]}
  private countsMax: number = 30;
  private countsLabels: string[] = Array(this.countsMax).fill('.');

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
    this.statusSubscription = this.statusService.subscribeChanged((v) => {
//      debug('status subscribe fired:', v);
      try {
        this.cdr.detectChanges();
      } catch (e) {
        console.error('detectChanges failed err:', e);
      }
    });

    this.countsSubscription = this.statusService.subscribeCounts((v: CountsEvent) => {
//      debug('count subscribe fired:', v);
//      debug('moment:', v.datetime, moment(v.datetime).fromNow());
      this.counts[v.id] = v;

//      if (!this.countsHist[v.id]) {
//        this.countsHist[v.id] = [];
//      }
//      this.countsHist[v.id].push(v);
//      const ch = this.countsHist[v.id];
//      if (ch.length > this.countsMax) {
//        ch.shift();
//      }
      if (!this.countsHashDataset[v.id]) {
        this.countsHashDataset[v.id] = [
          { data: Array(this.countsMax).fill(0), label: 'read' },
          { data: Array(this.countsMax).fill(0), label: 'write' },
        ];
      }
      const rData = _.clone(this.countsHashDataset[v.id][0].data);
      const wData = _.clone(this.countsHashDataset[v.id][1].data);

      rData.push(v.bytesRead);
      if (rData.length > this.countsMax) {
        rData.shift();
      }
      this.countsHashDataset[v.id][0].data = rData;

      wData.push(v.bytesWritten);
      if (wData.length > this.countsMax) {
        wData.shift();
      }
      this.countsHashDataset[v.id][1].data = wData;

      this.countsLabels = Array(this.countsMax).fill('10');
      this.countsLabels = this.countsLabels.map((e, i) => {
        if ((i + 1) % 10 === 0) {
          return '-';
        }
        return '.';
      });
//      debug('countsLabels:', this.countsLabels);
//      debug('countsHashDataset:', this.countsHashDataset[v.id]);

      try {
        this.cdr.detectChanges();
      } catch (e) {
        console.error('detectChanges failed err:', e);
      }
    });

    this.refresh();
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.countsSubscription.unsubscribe();
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
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
    this.recoverPersistentLocalTunnels();
    debug('after recoverPersistentLocalTunnels');
  }

  applyFilter(filterValue: string) {
    this.tableSource.filter = filterValue.trim().toLowerCase();
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
    const st = this.statusService.get(localTunnel.id); // readonly
    if (st && st.active) {
      this.tunnelService.stop(localTunnel);
      this.statusService.set(localTunnel.id, 'active', false);
    } else {
      debug('calling tunnelService.start from toggleState()');
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

//  bytesRead(id: string) {
//    const status = this.statusService.get(id);
//    return status.intvlBytesRead;
//  }
}
