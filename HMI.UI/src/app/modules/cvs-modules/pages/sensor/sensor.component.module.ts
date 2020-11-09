import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { MainConfigComponent } from './main-config/main-config.component';
import { SensorComponent } from './sensor.component';
import { ExtrinsicCalibrationComponent } from './extrinsic-calibration/extrinsic-calibration.component';
import { CalibrationComponent } from './calibration/calibration.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  entryComponents: [],
  declarations: [
    MainConfigComponent,
    SensorComponent,
    ExtrinsicCalibrationComponent,
    CalibrationComponent,
  ],
})
export class SensorComponentModule {}
