import { SharedModule } from '../../../shared/shared.module';
import { CvsModulesComponentsModule } from '../components/cvs-modules-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './status/status.component';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import { ParameterEditorComponent } from './parameter-editor/parameter-editor.component';
import { SensorComponentModule } from './sensor/sensor.component.module';
import { OperationManagerComponentModule } from './operation-manager/operation-manager.component.module';
import { ParameterEditorModule } from './parameter-editor/parameter-editor.module';

@NgModule({
  imports: [
    CommonModule,
    CvsModulesComponentsModule,
    SharedModule,
    RouterModule,
    SensorComponentModule,
    OperationManagerComponentModule,
    ParameterEditorModule,
  ],
  entryComponents: [],
  declarations: [
    StatusComponent,
    MainComponent,
  ],
})
export class CvsModulesPagesModule {}
