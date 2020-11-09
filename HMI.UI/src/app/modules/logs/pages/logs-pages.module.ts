import { AbbCommonUxButtonModule } from '@abb/abb-common-ux-angular';
import { ViewLogComponent } from './view-log/view-log.component';
import { LogsComponentsModule } from '../components/logs-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './status/status.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LogsComponentsModule,
    AbbCommonUxButtonModule,
    SharedModule,
  ],
  entryComponents: [],
  declarations: [
    StatusComponent,
    ViewLogComponent,
  ],
})
export class LogsPagesModule {}
