import { ControlComponentsModule } from '../components/control-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './status/status.component';

@NgModule({
  imports: [
    CommonModule,
    ControlComponentsModule,
  ],
  entryComponents: [],
  declarations: [
    StatusComponent,
  ],
})
export class ControlPagesModule {}
