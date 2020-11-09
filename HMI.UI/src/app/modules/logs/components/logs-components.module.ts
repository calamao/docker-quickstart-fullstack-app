import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsTableComponent } from './logs-table/logs-table.component';
import { LogsIconSeverityComponent } from './logs-icon-severity/logs-icon-severity.component';
import { LogsTable2Component } from './logs-table2/logs-table2.component';

@NgModule({
  // eslint-disable-next-line prettier/prettier
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    LogsTableComponent,
    LogsIconSeverityComponent,
    LogsTable2Component,
  ],
  declarations: [
    LogsTableComponent,
    LogsIconSeverityComponent,
    LogsTable2Component,
  ],
})
export class LogsComponentsModule {}
