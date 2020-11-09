import { SharedModule } from '@app/shared/shared.module';
import { HelloComponent } from './hello/hello.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSensorComponent } from './create-sensor/create-sensor.component';
import { CreateOperationComponent } from './create-operation/create-operation.component';
import { ParameterBlockComponent } from './parameters/parameter-block/parameter-block.component';
import { ParameterInfoComponent } from './parameters/parameter-info/parameter-info.component';

@NgModule({
  // eslint-disable-next-line prettier/prettier
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    HelloComponent,
    ParameterBlockComponent,
    ParameterInfoComponent,
  ],
  declarations: [
    HelloComponent,
    CreateSensorComponent,
    CreateOperationComponent,
    ParameterBlockComponent,
    ParameterInfoComponent,
  ],
})
export class CvsModulesComponentsModule {}
