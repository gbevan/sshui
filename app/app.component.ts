import { Component,
         OnInit,
         ViewContainerRef }     from '@angular/core';
import { MatDialog,
         MatDialogRef,
         MatDialogConfig }       from '@angular/material';

//import { SocketService,
//         AgentsService,
//         CsrsService,
//         EnvironmentsService,
//         IssuesService,
//         UsersService,
//         PermissionsService,
//         RolesService }         from './services/services.module';
//
//import { RoleComponent }        from './roles/role.component';
//
//import { HasPermissionGuard }   from './common/guards/rbac.guard';
//
//import { AgentsTabClass }       from './agents/agents-tab.class';
//import { CsrsTabClass }         from './csrs/csrs-tab.class';
//import { EnvironmentsTabClass } from './environments/envs-tab.class';
//import { IssuesTabClass }       from './issues/issues-tab.class';
//import { UsersTabClass }        from './users/users-tab.class';
//import { RolesTabClass }        from './roles/roles-tab.class';
//import { PermissionsTabClass }  from './permissions/permissions-tab.class';

const html = require('./app.template.html');
const css = require('./app.css');

const debug = require('debug').debug('partout:component:app');

@Component({
  selector: 'sshui',
  template: html,
  styles: [css]
})
export class AppComponent {
  title = 'SSH UI';

  config: MatDialogConfig;

  constructor(
//    private dialog: MatDialog,
//    private viewContainerRef: ViewContainerRef,

  ) {
//    this.config = new MatDialogConfig();
//    this.config.viewContainerRef = this.viewContainerRef; // for mdDialog
  }

//  ngOnInit() {
//  }

}
