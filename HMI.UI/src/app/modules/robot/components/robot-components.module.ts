import { HelloComponent } from './hello/hello.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AbbCommonUxButtonModule} from '@abb/abb-common-ux-angular';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AbbCommonUxButtonModule,
    SharedModule,
  ],
  exports: [
    HelloComponent,
  ],
  declarations: [
    HelloComponent,
  ],
})
export class RobotComponentsModule {}
