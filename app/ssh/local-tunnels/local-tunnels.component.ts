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

  constructor(
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
    this.localTunnels = this.localTunnelsService.find();
    console.log('localTunnels:', this.localTunnels);
    this.tableSource = new MatTableDataSource<any>(this.localTunnels);
    this.recoverPersistentLocalTunnels();
  }

  addLocalTunnel() {
    console.log('addLocalTunnel clicked');
    this.dialog.open(LocalTunnelAddDialog, {

    })
    .afterClosed()
    .subscribe((res) => {
      console.log('dialog result:', res);
      this.refresh();
    });
  }

  editLocalTunnel(localTunnel: any) {
    console.log('editLocalTunnel clicked');
    this.dialog.open(LocalTunnelAddDialog, {
      data: {
        localTunnel
      }
    })
    .afterClosed()
    .subscribe((res) => {
      console.log('dialog result:', res);
      this.refresh();
    });
  }

  delLocalTunnel(e: any) {
    console.log('delLocalTunnel e:', e);
    // TODO: prompt dialog ok/cancel
    this.localTunnelsService
    .remove(e.id);

    this.refresh();
  }

  toggleState(localTunnel: any) {
    console.log('toggleState() localTunnel:', localTunnel);
    if (localTunnel.active) {
      this.tunnelService.stop(localTunnel);
      localTunnel.active = false;
    } else {
      this.tunnelService.start('local', localTunnel);
      localTunnel.active = true;
    }
  }

  recoverPersistentLocalTunnels() {
    console.log('recoverPersistentLocalTunnels');
    this.localTunnels.forEach((t: any) => {
      if (t.persistent && !t.active) {
        this.tunnelService.start('local', t);
        t.active = true;
      }
    });
  }
}
