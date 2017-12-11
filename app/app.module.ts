import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { FormsModule }              from '@angular/forms';
import { FlexLayoutModule }         from '@angular/flex-layout';

import { NgbModule }                from '@ng-bootstrap/ng-bootstrap';

import { SshuiMaterialModule }      from './sshui-material.module';

import { AppComponent }             from './app.component';
import { ToolbarComponent }         from './toolbar/toolbar.component';

import { ActiveSessionsComponent }  from './ssh/active-sessions.component';
import { TerminalComponent }        from './terminal/terminal.component';

import { CredentialAddDialog }      from './ssh/credentials/credential-add.dialog';
import { CredentialsComponent }     from './ssh/credentials/credentials.component';

import { SessionAddDialog }         from './ssh/sessions/session-add.dialog';
import { SessionsComponent }        from './ssh/sessions/sessions.component';

import { LocalTunnelsComponent }    from './ssh/tunnels/local-tunnels.component';
import { RemoteTunnelsComponent }   from './ssh/tunnels/remote-tunnels.component';

import { LowdbService }             from './services/lowdb.service';
import { CredentialsService }       from './services/credentials.service';
import { LocalTunnelsService }      from './services/local-tunnels.service';
import { RemoteTunnelsService }     from './services/remote-tunnels.service';
import { PreferencesService }       from './services/preferences.service';
import { SessionsService }          from './services/sessions.service';

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

    ActiveSessionsComponent,
    LocalTunnelsComponent,
    RemoteTunnelsComponent,

    CredentialAddDialog,
    CredentialsComponent,

    SessionAddDialog,
    SessionsComponent,

    TerminalComponent,
    ToolbarComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    LowdbService,
    CredentialsService,
    LocalTunnelsService,
    RemoteTunnelsService,
    PreferencesService,
    SessionsService
  ],
  entryComponents: [
    CredentialAddDialog,
    SessionAddDialog
  ]
})
export class AppModule { }
