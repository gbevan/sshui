import { Component,
         OnInit,
         AfterViewInit,
         ChangeDetectorRef }    from '@angular/core';
import { MatTableDataSource,
         MatDialog }            from '@angular/material';

import { LocalTunnelsService }  from '../../services/local-tunnels.service';
import { LocalTunnelAddDialog } from './local-tunnel-add.dialog';

//import { ActiveLocalTunnelsService } from '../../services/active-local-tunnels.service';
import { TunnelService }        from '../../services/tunnel.service';
import { Status,
         StatusService }        from '../../services/status.service';

const html = require('./local-tunnels.template.html');
const css = require('./local-tunnels.css');

@Component({
  selector: 'local-tunnels',
  template: html,
  styles: [css]
})
export class LocalTunnelsComponent implements OnInit, AfterViewInit {
  private tableSource: MatTableDataSource<any>;
  private displayedColumns: string[] = [
//    'id',
    'name',
    'host',
    'port',
    'cred',
    'persistent',
    'connected',
    'localPort',
    'remoteHost',
    'remotePort',
    'edit',
    'delete'
  ];
  private localTunnels: any = [];
  private status: any = {}; // key by id

  constructor(
    private statusService: StatusService,
    private tunnelService: TunnelService,
    private localTunnelsService: LocalTunnelsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.refresh();
  }

  ngAfterViewInit() {
//    this.recoverPersistentLocalTunnels();
    this.cdr.detectChanges();
  }

  refresh() {
    process.stdout.write('refresh\n');
    this.localTunnels = this.localTunnelsService.find();
    this.tableSource = new MatTableDataSource<any>(this.localTunnels);
    this.recoverPersistentLocalTunnels();
  }

  addLocalTunnel() {
    this.dialog.open(LocalTunnelAddDialog, {

    })
    .afterClosed()
    .subscribe((res) => {
      this.statusService.set(res.id, null, null);
      this.refresh();
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
    if (this.statusService.get(localTunnel.id).active) {
      this.tunnelService.stop(localTunnel);
//      localTunnel.active = false;
      this.statusService.set(localTunnel.id, 'active', false);
    } else {
      this.tunnelService.start('local', localTunnel);
//      localTunnel.active = true;
      this.statusService.set(localTunnel.id, 'active', true);
    }

    // TODO: find a better way to do this, maybe a once() event for status?
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1000);
  }

  recoverPersistentLocalTunnels() {
    console.log('recoverPersistentLocalTunnels');
    this.localTunnels.forEach((t: any) => {
      console.log(`b4 status get for ${t.name}`);
      const s = this.statusService.get(t.id);
      console.log(`after status get for ${t.name} s:${s}`);
      if (s) {
        console.log(`active:${s.active}`);
      }

      if (t.persistent && (!s || !s.active)) {
        console.log(`b4 start for t.name`);
        this.tunnelService.start('local', t);
        console.log(`after start for ${t.name}`);
//        t.active = true;
        console.log('setting active', t.id);
        this.statusService.set(t.id, 'active', true);
        console.log(`after set for ${t.name}`);
//        this.cdr.detectChanges();
      }
    });
  }
}
