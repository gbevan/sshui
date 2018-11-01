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

import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { HttpClientModule }         from '@angular/common/http';
import { FormsModule }              from '@angular/forms';
import { FlexLayoutModule }         from '@angular/flex-layout';
// import { OverlayContainer }         from '@angular/cdk/overlay';

import { NgbModule }                from '@ng-bootstrap/ng-bootstrap';

import { ChartsModule }             from 'ng2-charts';

import { SshuiMaterialModule,
         MatIconRegistry }          from './sshui-material.module';
import { AppComponent }             from './app.component';

import { CliService }               from './services/cli.service';
import { LowdbService }             from './services/lowdb.service';
import { CredentialsService }       from './services/credentials.service';
import { LocalTunnelsService }      from './services/local-tunnels.service';
import { RemoteTunnelsService }     from './services/remote-tunnels.service';
import { PreferencesService }       from './services/preferences.service';
import { SessionsService }          from './services/sessions.service';
import { KnownHostsService }        from './services/known-hosts.service';

import { StatusService }            from './services/status.service';
import { TunnelService }            from './services/tunnel.service';
//import { VaultPwService }           from './services/vaultpw.service';

import { ToolbarComponent }         from './toolbar/toolbar.component';
import { ManageComponent }          from './manage/manage.component';

import { ReleasesService }          from './services/releases.service';
import { NewreleaseComponent }      from './releases/newrelease.component';

import { ActiveSessionsService }    from './services/active-sessions.service';
import { ActiveSessionsComponent }  from './ssh/active-sessions.component';
import { TerminalComponent }        from './terminal/terminal.component';

import { CredentialAddDialog }      from './ssh/credentials/credential-add.dialog';
import { CredentialsComponent }     from './ssh/credentials/credentials.component';

import { KnownHostsAddDialog }      from './ssh/known-hosts/known-hosts-add.dialog';
import { KnownHostsComponent }      from './ssh/known-hosts/known-hosts.component';

import { SessionAddDialog }         from './ssh/sessions/session-add.dialog';
import { SessionsComponent }        from './ssh/sessions/sessions.component';

import { VaultPwComponent }         from './vaultpw/vaultpw.component';
import { NewVaultPwComponent }      from './vaultpw/newvaultpw.component';

//import { ActiveLocalTunnelsService } from './services/active-local-tunnels.service';
import { LocalTunnelAddDialog }     from './ssh/local-tunnels/local-tunnel-add.dialog';
import { LocalTunnelsComponent }    from './ssh/local-tunnels/local-tunnels.component';

import { RemoteTunnelsComponent }   from './ssh/remote-tunnels/remote-tunnels.component';

import { OpenUrlComponent }         from './open/open-url.component';

import { ChangeVaultPwDialog }      from './toolbar/change-vault-pw.dialog';
import { SettingsDialog }           from './toolbar/settings.dialog';
import { AboutDialog }              from './toolbar/about.dialog';

import { ErrorPopupDialog }         from './error/error-popup.dialog';

import { DefaultPipe }              from './pipes/default.pipe';

import '../themes.scss';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SshuiMaterialModule,
    NgbModule.forRoot(),
    FormsModule,
    FlexLayoutModule,
    ChartsModule
  ],
  declarations: [
    AppComponent,
    OpenUrlComponent,

    NewreleaseComponent,
    ManageComponent,
    ActiveSessionsComponent,

    LocalTunnelAddDialog,
    LocalTunnelsComponent,

    RemoteTunnelsComponent,

    CredentialAddDialog,
    CredentialsComponent,

    KnownHostsAddDialog,
    KnownHostsComponent,

    SessionAddDialog,
    SessionsComponent,

    TerminalComponent,
    ToolbarComponent,

    VaultPwComponent,
    NewVaultPwComponent,
    ChangeVaultPwDialog,
    SettingsDialog,
    ErrorPopupDialog,
    AboutDialog,

    DefaultPipe
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
//    ActiveLocalTunnelsService,
    CliService,
    ReleasesService,
    ActiveSessionsService,
    LowdbService,
    CredentialsService,
    KnownHostsService,
    LocalTunnelsService,
    RemoteTunnelsService,
    PreferencesService,
    SessionsService,
    StatusService,
    TunnelService
//    VaultPwService
  ],
  entryComponents: [
    ChangeVaultPwDialog,
    CredentialAddDialog,
    KnownHostsAddDialog,
    LocalTunnelAddDialog,
    SessionAddDialog,
    SettingsDialog,
    ErrorPopupDialog,
    AboutDialog
  ]
})
export class AppModule {
  constructor(
    public matIconRegistry: MatIconRegistry
    // public overlayContainer: OverlayContainer
  ) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
