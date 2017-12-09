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

import { SessionsComponent }        from './ssh/sessions.component';
import { LocalTunnelsComponent }    from './ssh/local-tunnels.component';
import { RemoteTunnelsComponent }   from './ssh/remote-tunnels.component';

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
    SessionsComponent,
    TerminalComponent,
    ToolbarComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class AppModule { }
