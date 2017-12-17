import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { FormsModule }              from '@angular/forms';
import { FlexLayoutModule }         from '@angular/flex-layout';

import { NgbModule }                from '@ng-bootstrap/ng-bootstrap';

import { SshuiMaterialModule,
         MatIconRegistry }          from './sshui-material.module';
import { AppComponent }             from './app.component';

import { LowdbService }             from './services/lowdb.service';
import { CredentialsService }       from './services/credentials.service';
import { LocalTunnelsService }      from './services/local-tunnels.service';
import { RemoteTunnelsService }     from './services/remote-tunnels.service';
import { PreferencesService }       from './services/preferences.service';
import { SessionsService }          from './services/sessions.service';

import { TunnelService }            from './services/tunnel.service';
import { VaultPwService }           from './services/vaultpw.service';

import { ToolbarComponent }         from './toolbar/toolbar.component';
import { ManageComponent }          from './manage/manage.component';

import { ActiveSessionsService }    from './services/active-sessions.service';
import { ActiveSessionsComponent }  from './ssh/active-sessions.component';
import { TerminalComponent }        from './terminal/terminal.component';

import { CredentialAddDialog }      from './ssh/credentials/credential-add.dialog';
import { CredentialsComponent }     from './ssh/credentials/credentials.component';

import { SessionAddDialog }         from './ssh/sessions/session-add.dialog';
import { SessionsComponent }        from './ssh/sessions/sessions.component';

import { VaultPwComponent }         from './vaultpw/vaultpw.component';

//import { ActiveLocalTunnelsService } from './services/active-local-tunnels.service';
import { LocalTunnelAddDialog }     from './ssh/local-tunnels/local-tunnel-add.dialog';
import { LocalTunnelsComponent }    from './ssh/local-tunnels/local-tunnels.component';

import { RemoteTunnelsComponent }   from './ssh/remote-tunnels/remote-tunnels.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SshuiMaterialModule,
    NgbModule.forRoot(),
    FormsModule,
    FlexLayoutModule
  ],
  declarations: [
    AppComponent,

    ManageComponent,
    ActiveSessionsComponent,

    LocalTunnelAddDialog,
    LocalTunnelsComponent,

    RemoteTunnelsComponent,

    CredentialAddDialog,
    CredentialsComponent,

    SessionAddDialog,
    SessionsComponent,

    TerminalComponent,
    ToolbarComponent,

    VaultPwComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
//    ActiveLocalTunnelsService,
    ActiveSessionsService,
    LowdbService,
    CredentialsService,
    LocalTunnelsService,
    RemoteTunnelsService,
    PreferencesService,
    SessionsService,
    TunnelService,
    VaultPwService
  ],
  entryComponents: [
    CredentialAddDialog,
    LocalTunnelAddDialog,
    SessionAddDialog
  ]
})
export class AppModule {
  constructor(
    public matIconRegistry: MatIconRegistry
  ) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
