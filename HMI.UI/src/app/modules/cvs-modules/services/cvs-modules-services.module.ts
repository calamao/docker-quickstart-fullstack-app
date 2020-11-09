import { ModuleSensorService } from './sensor/module-sensor.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleOperationManagerService } from './operation-manager/module-operation-manager.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ModuleSensorService,
    ModuleOperationManagerService,
  ],
})
export class CvsModulesServicesModule { }
