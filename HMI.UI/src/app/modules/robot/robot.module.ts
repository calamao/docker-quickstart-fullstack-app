import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RobotRoutingModule } from './robot-routing.module';
import { RobotPagesModule } from './pages/robot-pages.module';

@NgModule({
  // entryComponents: [JournalComponent, UserManagementComponent, UsersComponent, RolesComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    RobotRoutingModule,
    RobotPagesModule,
  ],
})
export class RobotModule {}
