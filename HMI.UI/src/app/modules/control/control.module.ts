import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlRoutingModule } from './control-routing.module';
import { ControlPagesModule } from './pages/control-pages.module';

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    ControlRoutingModule,
    ControlPagesModule,
  ],
})
export class ControlModule {}
