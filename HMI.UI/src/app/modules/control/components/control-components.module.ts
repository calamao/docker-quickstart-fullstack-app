import { HelloComponent } from './hello/hello.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AbbCommonUxButtonModule} from '@abb/abb-common-ux-angular';

@NgModule({
  // eslint-disable-next-line prettier/prettier
  imports: [
    CommonModule,
    AbbCommonUxButtonModule,
  ],
  exports: [
    HelloComponent,
  ],
  declarations: [
    HelloComponent,
  ],
})
export class ControlComponentsModule {}
