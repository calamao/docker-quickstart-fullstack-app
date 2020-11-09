import { SharedModule } from './../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { HelloComponent } from './hello/hello.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsTableComponent } from './logs-table/logs-table.component';
import { LogsIconSeverityComponent } from './logs-icon-severity/logs-icon-severity.component';

@NgModule({
  // eslint-disable-next-line prettier/prettier
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    HelloComponent,
    LogsTableComponent,
    LogsIconSeverityComponent,
  ],
  declarations: [
    HelloComponent,
    LogsTableComponent,
    LogsIconSeverityComponent,
  ],
})
export class LogsComponentsModule {}
